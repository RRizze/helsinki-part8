import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_BORN } from "../queries"
import { useState } from "react";

const Authors = () => {
  const [born, setBorn] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const res = useQuery(ALL_AUTHORS);

  const [ editBorn ] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (e) => {
    e.preventDefault();

    editBorn({
      variables: { setBornTo: Number(born), name: selectedName },
    });
  };

  if (res.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {res.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {res.data.allAuthors.length > 0
        ?
        <form onSubmit={submit}>
          <div>
            Pick a name:
            <select value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            >
              {res.data.allAuthors.map((a) => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type='submit'>updated born</button>
        </form>
        : null
      }
    </div>
  )
}

export default Authors
