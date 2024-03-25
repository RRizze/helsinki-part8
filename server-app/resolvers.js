const { GraphQLError } = require('graphql');
const Book = require('./src/models/book');
const Author = require('./src/models/author');
const User = require('./src/models/user');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');
const pubsub = new PubSub();

const resolvers = {
  Author: {
    id: (parent, args, context, info) => {
      return parent.id || parent._id;
    }
  },
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const queryObj = {};
      if (args.author) {
        queryObj.author = args.author;
      }
      if(args.genre && args.genre !== 'all genres') {
        queryObj.genres = args.genre;
      }

      try {
        console.log('queryObject', queryObj);
        const query = await Book.find(queryObj).populate('author');
        return query;
      } catch (err) {
        console.log(err.message);
        throw new GraphQLError(err.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

    },
    allAuthors: async (root, args) => {
      try {
        const authors = await Author
          .aggregate([
            {
              $lookup: {
                from : "books",
                localField: "_id",
                foreignField: "author",
                as: "books"
              }
            },
            {
              $project: {
                booksCount: { $size: "$books" },
                name: 1,
                _id: 1,
              }
            }
          ]);

        return authors;
      } catch (err) {
        console.log(err.message);
        throw new GraphQLError(err.message, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
    recommendedBooks: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const queryObj = {};
      queryObj.genres = currentUser.favoriteGenre;

      try {
        const query = await Book.find(queryObj).populate('author');
        return query;
      } catch (err) {
        console.log(err);
        throw new GraphQLError(err, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
    },
    allGenres: async () => {
      const genres = await Book.distinct('genres');
      return genres;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!author) {
        author = new Author({ name: args.author });
      }

      try {
        await author.save();
      } catch (err) {
        console.log(err);
        throw new GraphQLError(err.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let book = new Book({ ...args, author: author._id });
      try {
        book = await book.save();
        book = await book.populate('author');
      } catch (err) {
        console.log(err);
        throw new GraphQLError(err.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          // TODO find out what is it
          { new: true, runValidators: true, context: 'query' },
        );

        return author;
      } catch (err) {
        console.log(err);
        throw new GraphQLError(err.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      });

      return user.save()
        .catch(err => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: [...args],
              error: err,
            },
          });
        });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user  || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers;
