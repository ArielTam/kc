const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const functions = require("firebase-functions");
const express = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type Ingredient {
     name: String,
     usedIn: [ID],
  }

  type Recipe {
     id: ID,
     name: String,
     ingredientList: [ID],
  }

  type Query {
     getRecipes: [Recipe],
     getIngredients: [Ingredient],
  }

`;

const resolvers = {
   Query: {
      getRecipes(root, args) {
         return admin
            .database()
            .ref("recipes")
            .once("value")
            .then(snapshot => snapshot.val())
            .then(val => Object.keys(val).map(key => val[key]))
      },  
      getIngredients(root, args) {
         return admin
            .database()
            .ref("ingredients")
            .once("value")
            .then(snapshot => snapshot.val())
            .then(val => Object.keys(val).map(key => val[key]))
      }  
   }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });

exports.graphql = functions.https.onRequest(app);
