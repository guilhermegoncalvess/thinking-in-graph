import { Express } from 'express'
import graphql from './graphql';

const server = (graphqlServer: Express) => {
  const graphqlPort = process.env.GRAPHQL_PORT || 4000

  return async () => {
    graphqlServer.listen(graphqlPort, () => {
      global.console.log(`Graphql server ready at http://localhost:${graphqlPort}`)
    });
  }
}

server(graphql())()