import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
    mutation UpdateUser(
      $userDetails: UpdateUserInput!
    ) {
      updateUser(
        userDetails: $userDetails
      ) {
        _id
        name
        email
        bio
        imageUrl
        status
      }
    }
  `;

export const CREATE_USER = gql`
  mutation CreateUser(
    $userDetails: CreateUserInput!
  ) {
    createUser(
      userDetails: $userDetails
    ) {
      email
      familyName
      givenName
      googleId
      imageUrl
      name
    }
  }
`;