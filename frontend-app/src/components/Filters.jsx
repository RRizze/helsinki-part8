import { useQuery } from "@apollo/client";
import { GENRES } from "../queries";

const Filters = ({ onHandleFilter }) => {
  const { data, loading } = useQuery(GENRES);

  if (!data || loading) {
    return <div>filters loading...</div>
  }

  return (
    <ul>
      {data.allGenres.map(f =>
        <li key={Math.random().toString() + f}>
          <button onClick={() => onHandleFilter(f)}>{f}</button>
        </li>)
      }
    </ul>
  );
};

export default Filters;
