import React, { Component } from 'react'
import Recipe from './Recipe'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const RECIPES_QUERY = gql`
{
   getRecipes{
      name
      id
      ingredientList
   }

   getIngredients{
      name
      usedIn
   }
}
`

class RecipeList extends Component {
   
   findRecipeIDsFromIngredientList = (allIngredients, targetIngredients) => {
      let refRecipeIDs = new Set()
      for (let i in allIngredients){
         let ingr = allIngredients[i]
         if (targetIngredients.includes(ingr.name)) {
            let current = new Set(ingr.usedIn)
            refRecipeIDs = new Set([...refRecipeIDs, ...current])
         }
      }
      return refRecipeIDs
   }

   findRecipesFromIDList = (recipeIDs, allRecipes) => {
      let refRecipes = []
      for (let i in allRecipes) {
         let recipe = allRecipes[i]
         if (recipeIDs.has(recipe.id)) {
            refRecipes.push(recipe)
         }
      }
      return refRecipes
   } 

   getTargets = () => {
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
               const targets = this.getTargets()

               let ids = this.findRecipeIDsFromIngredientList(ingredients, targets)
               let filteredRecipes = this.findRecipesFromIDList(ids, recipes)

               return (
                  <div>
                     <h2>filtered</h2>
                     <div>
                     {filteredRecipes.map(r => 
                        <Recipe 
                           key={r.id+"filtered"} 
                           id={r.id} 
                           name={r.name} 
                           ingredientList={r.ingredientList}
                           target={targets}
                        />)}
                     </div>
                     <br/>
                     <h2>all</h2>
                     <div>
                     {recipes.map(r => 
                        <Recipe 
                           key={r.id} 
                           id={r.id} 
                           name={r.name} 
                           ingredientList={r.ingredientList}
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
