import express, { Express } from 'express'
import { graphqlHTTP } from 'express-graphql'
import bodyParser from 'body-parser'
import cors from 'cors'

import schema from './schema'

/* istanbul ignore next */
export default (): Express => {
  const server = express()

  server.use(bodyParser.json())

  /* istanbul ignore next */
  server.use(cors())

  /* istanbul ignore next */
  server.use(
    '/graphql',
    graphqlHTTP(async (req: any) => ({
      schema,
      graphiql: true,
    }))
  )

  return server
}
