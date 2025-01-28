// loginpage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;
    
    if ((username === 'admin' && password === '123') ) {
      localStorage.setItem('user', username);
      alert('Login successful');
      navigate('/dashboard');
    } else {
      

    if ((username === 'customer' && password === '123') ) {
      localStorage.setItem('user', username);
      alert('Login successful');
      navigate('/customer');
    } else {
      alert('Invalid credentials');
    }
        
  }};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
