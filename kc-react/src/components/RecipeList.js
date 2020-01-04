import React, { Component } from 'react'
import Recipe from './Recipe'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';

const RECIPES_QUERY = gql`
{
   recipes {
      name
      id
      ingredients
    }

   ingredients {
      name
      usedIn
   }
}
`
// ingredients: list of Ingredients
// recipes: list of Recipes
// searched: list of ingredient strings from the search query
//
// Returns list of Recipes
const filterRecipesByIngredients = (ingredients, recipes, searched) => {
  let recipeIDs = new Set()
  for (let i in ingredients) {
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

const getSearchResult = () => {
  let params = new URLSearchParams(document.location.search.substring(1))
  let q = params.get("q")
  return q ? q.split("%2C") : []
}

const RecipeList = () => {
  const { loading, data } = useQuery(RECIPES_QUERY);

  if (!data || !data.recipes || !data.ingredients || data.loading) {
    return <div>loading...</div>
  }

  const { recipes, ingredients } = data;
  const searchResult = getSearchResult();
  const filteredRecipes = filterRecipesByIngredients(ingredients, recipes, searchResult);

  return (
    <div>
      <h2>Filtered</h2>
      <div>
        {filteredRecipes.map(recipe =>
          <Recipe
            key={recipe.id + "filtered"}
            recipe={recipe}
            searched={searchResult}
          />)}
      </div>
    </div>
  )
}

export default RecipeList
