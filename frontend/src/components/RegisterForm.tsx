import React, { useState } from 'react';
import { RegisterRequest } from '../models/dto/RegisterRequest';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const RegisterForm: React.FC<{ onRegisterError: (error: string) => void; }> = ({ onRegisterError }) => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate(); // Initialize navigate for redirecting after success

    // Helper function to validate the form
    const validateForm = () => {
        if (!email || !userName || !password || !repeatPassword) {
            setFormError('All fields are required');
            return false;
        }

        // Email validation (simple regex for email format)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            setFormError('Please enter a valid email address');
            return false;
        }

        // Password validation (at least 6 characters)
        if (password.length < 6) {
            setFormError('Password must be at least 6 characters');
            return false;
        }

        // Check if passwords match
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
            // Register the user
            await AuthService.register(request);

            // Display success message
            setSuccessMessage('Registration successful! Redirecting to login page...');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login'); // Navigate to the login page
            }, 2000); // Wait 2 seconds before redirecting
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed, please try again');
            onRegisterError('Registration failed, please try again');
        }
    };

    return (
        <div className="relative">
            {/* Success message alert */}
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
                        className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

                <div className="mb-7">
                    <label className="block text-md font-light text-gray-600 mb-1" htmlFor="repeatPassword">Repeat Password:</label>
                    <input
                        id="repeatPassword"
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="h-[40px] purple-light w-full p-2 text-sm text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                </div>

                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" className="w-full main-color text-white p-2 rounded-md">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
