import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { LOGIN } from '../queries';

const LoginForm = ({ setToken }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('authToken', token);
    }
  }, [result.data]);

  const submit = (e) => {
    e.preventDefault();

    login({ variables: { username, password }});
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div>
          password
          <input value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );

};

export default LoginForm;
