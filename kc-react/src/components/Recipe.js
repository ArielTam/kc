import React, { Component } from 'react'

class Recipe extends Component {
   render() {
      const { name, ingredientList, targets} = this.props;
      return (
         <div>
            <b>{name}</b>
            <div>{ingredientList.map( i => ( 
               <button key={i}>
                  {targets && targets.includes(i) ? 
                     (<h2>{i}</h2>) : 
                     (<p>{i}</p>)}
               </button>
            ))}</div>
         </div>
      ) 
   }
}

export default Recipe
