import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ALL_AUTHORS, CREATE_BOOK, RECOMMENDED_BOOKS } from '../queries'
import { updateCache } from '../helpers'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (err) => {
      const messages = err.graphQLErrors.map(e => e.message).join('\n');
      console.log(messages);
    },
    update: (cache, response) => {
      updateCache(cache,
        [
          { query: ALL_BOOKS },
          { query: ALL_AUTHORS },
          { query: RECOMMENDED_BOOKS },
        ],
        response.data.bookAdded
      );
    },
  });

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    createBook({
      variables: { title, author, published: Number(published), genres },
    });

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
