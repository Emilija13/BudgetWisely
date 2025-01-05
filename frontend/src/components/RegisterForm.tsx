import React, { useState } from 'react';
import { RegisterRequest } from '../models/dto/RegisterRequest';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC<{ onRegisterError: (error: string) => void; }> = ({ onRegisterError }) => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !userName || !password || !repeatPassword) {
            setFormError('All fields are required');
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            setFormError('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters');
            return false;
        }

        if (password !== repeatPassword) {
            setFormError('Passwords do not match');
            return false;
        }

        setFormError(null);
        return true;
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

        const request: RegisterRequest = { email, userName, password };

        try {
            await AuthService.register(request);

            setSuccessMessage('Registration successful! Redirecting to login page...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            const errorMessage = error || 'Registration failed, please try again'

            setError(errorMessage);
        
            onRegisterError(errorMessage);
          }
    };

    return (
        <div className="relative">
            {successMessage && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full p-4 bg-green-500 text-white text-center rounded-md shadow-lg">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleRegister}>
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
                    <label className="block text-md font-light text-gray-600 mb-1" htmlFor="userName">Username:</label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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

                <div className="mb-7">
                    <label className="block text-md font-light text-gray-600 mb-1" htmlFor="repeatPassword">Repeat Password:</label>
                    <div className="relative">
                        <input
                            id="repeatPassword"
                            type={repeatPasswordVisible ? "text" : "password"}
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                        {repeatPassword && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={() => setRepeatPasswordVisible(!repeatPasswordVisible)}
                            >
                                {repeatPasswordVisible ? <svg className="w-6 h-6 mt-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg> : <svg className="w-6 h-6 mt-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="1" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                    <path stroke="currentColor" strokeWidth="1" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                }
                            </button>
                        )}
                    </div>
                </div>

                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" className="w-full mt-4 main-color text-white p-2 rounded-xl">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
