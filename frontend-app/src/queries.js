import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
      id
      title
      published
      genres
      author {
        name
        id
      }
  }
`;

export const ALL_BOOKS = gql`
  query fetchBooks($genre: String){
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export const CREATE_BOOK = gql`
  mutation createBook($author: String!,
    $title: String!,
    $published: Int!,
    $genres: [String!]) {
    addBook (
      author: $author
      title: $title
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const EDIT_BORN = gql`
  mutation editBorn($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
      name
      born
      id
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query me {
    me {
      favoriteGenre
    }
  }
`;

export const RECOMMENDED_BOOKS = gql`
  query {
    recommendedBooks {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export const GENRES = gql`
  query {
    allGenres
  }
`;
