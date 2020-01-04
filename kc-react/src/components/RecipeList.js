import React, { Component } from 'react'
import Recipe from './Recipe'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const RECIPES_QUERY = gql`
{
   getRecipes{
      name
      id
      ingredients
   }

   getIngredients{
      name
      usedIn
   }
}
`

class RecipeList extends Component {
   
   // ingredients: list of Ingredients
   // recipes: list of Recipes
   // searched: list of ingredient strings from the search query
   //
   // Returns list of Recipes
   filterRecipesByIngredients = (ingredients, recipes, searched) => {
      let recipeIDs = new Set()
      for (let i in ingredients){
         const ingredient = ingredients[i]
         if (searched.includes(ingredient.name)) {
            const current = new Set(ingredient.usedIn)
            recipeIDs = new Set([...recipeIDs, ...current])
         }
      }
      
      let filtered = []
      for (let i in recipes) {
         const recipe = recipes[i]
         if (recipeIDs.has(recipe.id)) {
            filtered.push(recipe)
         }
      }
      return filtered
   } 

   getSearchResult = () => {
      let params = new URLSearchParams(document.location.search.substring(1))
      let q = params.get("q")
      return q ? q.split("%2C") : []
   }

   render() {
      return (
         <Query query={RECIPES_QUERY}>
            {({ loading, error, data }) => {
               if (loading) return <div>Fetching</div>
               if (error) {
                  console.log(error)
                  return <div>Error</div>
               }

               const recipes = data.getRecipes
               const ingredients = data.getIngredients
               const searched = this.getSearchResult()
               const filteredRecipes = this.filterRecipesByIngredients(ingredients, recipes, searched)

               return (
                  <div>
                     <h2>filtered</h2>
                     <div>
                     {filteredRecipes.map(r => 
                        <Recipe 
                           key={r.id+"filtered"}
                           recipe={r}
                           searched={searched}
                        />)}
                     </div>
                  </div>
               )
            }}
         </Query>
      )
   }
}
export default RecipeList
