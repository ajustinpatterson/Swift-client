import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query {
    getUsers {
      _id
      name
      email
      bio
      imageUrl
      status
    }
  }
`