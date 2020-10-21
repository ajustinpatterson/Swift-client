import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const userClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://fathomless-eyrie-92787.herokuapp.com/graphql'
  }),
  cache: new InMemoryCache(),
});

export default userClient;

