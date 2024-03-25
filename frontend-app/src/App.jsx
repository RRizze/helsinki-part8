import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Recommendations from './Recommendations';
import { Link, Route, Routes } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    );
  }

  return (
    <div>
      <nav>
        <Link to='/authors' >authors</Link>
        <Link to='/books' >books</Link>
        <Link to='/add' >add book</Link>
        <Link to='/' >home</Link>
        <Link to='/recommendations' >recommendations</Link>
        {token ? <button onClick={logout}>logout</button> : null}
      </nav>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/add' element={<NewBook />} />
        <Route path='/recommendations' element={<Recommendations />} />
      </Routes>
    </div>
  );
};

export default App;
