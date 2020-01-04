import React, { Component } from 'react'
import styled from 'styled-components'

const Card = styled.button`
   margin: 5px;
   border-radius: 5px;
   background: ${props => props.isSelected ? "lightblue" : "white"}
`

class Recipe extends Component {
   render() {
      const { recipe, searched } = this.props;
      const { name, ingredients } = recipe;
      return (
         <div>
            <b>{name}</b>
            <div>{ingredients.map(ingredient => ( 
               <Card 
                  key={ingredient} 
                  isSelected={searched.includes(ingredient)}>
               {ingredient} 
               </Card>
            ))}</div>
         </div>
      ) 
   }
}

export default Recipe
