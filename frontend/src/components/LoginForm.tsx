import React, { useState } from 'react';
import { LoginRequest } from '../models/dto/LoginRequest';
import AuthService from '../services/AuthService';
import { LoginFormProps } from './props/LoginFormProps';

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

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
                    className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                />
            </div>
            <div className="mb-7">
                <label className="block text-md font-light text-gray-600 mb-1" htmlFor="password">Password:</label>
                <div className="relative">
                    <input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                    {/* Show the eye icon only if the password field is not empty */}
                    {password && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <svg className="w-6 h-6 mt-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                                : <svg className="w-6 h-6 mt-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="1" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                    <path stroke="currentColor" strokeWidth="1" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>}
                        </button>
                    )}
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="w-full mt-4 p-2 main-color text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400">
                Sign in
            </button>
        </form>
    );
};

export default LoginForm;
