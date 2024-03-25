import { useApolloClient, useLazyQuery, useQuery, useSubscription } from "@apollo/client"
import { ALL_BOOKS, BOOK_ADDED } from "../queries"
import { useState, useEffect } from "react";
import { updateCache } from "../helpers";
import Filters from "./Filters";

const Books = () => {
  const [currentFilter, setCurrentFilter] = useState('all genres');
  const [filters, setFilters] = useState([]);
  const { loading, data, refetch } = useQuery(ALL_BOOKS);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded;
      window.alert('book added', bookAdded);

      updateCache(client.cache, { query: ALL_BOOKS }, bookAdded);
      refetch({ genre: currentFilter });
    },
  });

  useEffect(() => {
    if (data) {
      let genres = ['all genres'];
      data.allBooks.map(b => {
        genres = genres.concat(b.genres);
      });
      setFilters([...new Set(genres)]);
      refetch({ genre: currentFilter });
    }
  }, [data]);

  if (loading || !data) {
    return <div>loading...</div>
  }
  const onRefetch = (f) => {
    setCurrentFilter(f);
    refetch({ genre: f });
  };

  return (
    <div>
      <h2>books</h2>
      <Filters onHandleFilter={onRefetch}/>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
