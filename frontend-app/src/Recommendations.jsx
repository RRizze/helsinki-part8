import { RECOMMENDED_BOOKS } from "./queries";
import { useQuery } from "@apollo/client";

const Recommendations = () => {
  const { data, loading } = useQuery(RECOMMENDED_BOOKS);

  if (!data || loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.recommendedBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
