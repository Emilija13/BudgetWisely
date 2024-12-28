// LoginForm.tsx
import React, { useState } from 'react';
import { LoginRequest } from '../models/dto/LoginRequest';
import AuthService from '../services/AuthService';
import { LoginFormProps } from './props/LoginFormProps';

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const request: LoginRequest = { email, password };

        try {
            const response = await AuthService.login(request);
            const token = response.token;
            if (token) {
                setError(null);
                onLoginSuccess(token, response.user.id);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid email or password');
            onLoginError('Invalid email or password');
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <div className="mb-7">
                <label className="block text-md font-light text-gray-600 mb-1" htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                />
            </div>
            <div className="mb-7">
                <label className="block text-md font-light text-gray-600 mb-1" htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="w-full mt-4 p-2 main-color text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
                Sign in
            </button>
        </form>
    );
};

export default LoginForm;
