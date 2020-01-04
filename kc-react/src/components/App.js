import React, { Component } from 'react'
import RecipeList from './RecipeList'

class App extends Component {

   constructor(props){
      super(props)
      this.state = {
         q: '',
         targetIngredients: [],
      }
   }

   handleInputChange = e => {
      e.preventDefault()
      const {name, value} = e.target
      this.setState({
         [name]: value
      })

      let url = new URL('http://localhost:3000/?q='+value)
      let params = new URLSearchParams(url.search.slice(1))
      params.append('list',value)
   }

   search = () => {
   }

   render() {
      const {q} = this.state

      return (<div>
         <h3> Search for recipes by ingredients, comma-separated </h3>
         <form onSubmit={this.search()}>
            <input 
               name='q'
               value={q}
               type='search'
               onChange={this.handleInputChange}
               aria-label="Search for recipes by ingredients"
               autoFocus />
            <input type="submit" value="Search"/>
         </form>
         <RecipeList/>
      </div>)
   }
}

export default App
