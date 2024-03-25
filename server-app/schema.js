const typeDefs = `
  type User {
    id: ID!
    username: String!
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    booksCount: Int
  }

  type Subscription {
    bookAdded: Book!
  }

  type Subscription {
    authorAdded: Author!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    me: User
  }

  type Query {
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    recommendedBooks: [Book]
    allGenres: [String]
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published:  Int!
      genres: [String!]
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`
module.exports = typeDefs;
