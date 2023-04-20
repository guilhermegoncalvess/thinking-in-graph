import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { join } from 'path'
import { users } from '../../data/users'
import { followers } from '../../data/followers'
import { posts } from '../../data/posts'

export const baseSchema = loadFilesSync(join(__dirname, 'base.gql'))
export const typeDefs = loadFilesSync(join(__dirname, 'typedefs.gql'))

/* istanbul ignore next */
export const resolvers = {
  Query: {
    user: (_: any, args: any) => {
      return users.find(user => args.id === user.id)
    }
  },
  Mutation: {
    user: (_: any, args: any) => {
      const user = {
        id: users.length,
        name: args.input.name,
        email: args.input.email
      }
      users.push(user)
      followers.push({
        userId: user.id,
        followedBy: []
      })
      return user
    },
    follow: (_: any, args: any) => {
      const { followedBy }: any = followers.find(user => args.input.wantFollow === user.userId)

      followedBy.push(args.input.followerId)

      return 'successfull'
    },
  },
  User: {
    followedBy: (obj: any) => {
      console.log('followers resolver')
      const { followedBy }: any = followers.find(user => obj.id === user.userId)
      const followerUsers = followedBy.map((follower: any) => {
        return users[follower]
      })

      return followerUsers
    },
    posts: (obj: any) => {
      console.log('posts resolver')
      const userPosts = posts.filter(user => obj.id === user.userId)
      const finalPosts = userPosts.map(({ likedBy, ...rest }) => {
        const likeUsers = likedBy.map((follower: any) => {
          return users[follower]
        })

        return { likedBy: likeUsers, ...rest, totalLikes: likedBy.length }
      })

      return finalPosts
    }
  }
}

/* istanbul ignore next */
const baseResolvers = {
  Query: { ping: () => 'PONG' },
  Mutation: { _empty: () => '' },
}

/* istanbul ignore next */
export default makeExecutableSchema({
  typeDefs: mergeTypeDefs([baseSchema, typeDefs]),
  resolvers: mergeResolvers([baseResolvers, resolvers]),
})
