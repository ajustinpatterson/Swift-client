import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const userClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3002/graphql'
  }),
  cache: new InMemoryCache(),
});

export default userClient;

