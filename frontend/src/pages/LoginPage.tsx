import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { LoginRequest } from '../models/dto/LoginRequest';
import AuthService from '../services/AuthService';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const request: LoginRequest = { email, password };

    try {
        const response = await AuthService.login(request)

      const token = response.token;
      if (token) {
        setError(null);
        console.log(response)
        localStorage.setItem("user", token);
        localStorage.setItem("userId", response.user.id);
        navigate('/overview');  
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;