import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Typography } from '@material-tailwind/react';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();  // Get current location (route)
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (token: string, userId: string) => {
    setError(null);
    localStorage.setItem("user", token);
    localStorage.setItem("userId", userId);
    navigate('/overview');
  };

  const handleLoginError = (error: string) => {
    setError(error);
  };

  const goToPage = () => {
    isLoginRoute ? navigate('/register') : navigate('/login');
  }

  // Determine which form to display based on the route
  const isLoginRoute = location.pathname === '/login';
  const isRegisterRoute = location.pathname === '/register';

  return (
    <div className="flex w-full h-screen">

      {/* Left Side */}
      <div className="flex-1 bg-white p-8 flex justify-center items-center">
        <div className="w-full max-w-sm">

          <div className='mb-10'>
            <Typography
              variant="lead"
              color="blue-gray"
              className="font-bold text-3xl"
            >
              {isLoginRoute ? 'Log in' : 'Sign up'}
            </Typography>
            <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
              {isLoginRoute ? 'Welcome back! Please enter your details.' : 'Create an account to get started.'}
            </Typography>
          </div>

          {/* Conditionally render LoginForm or RegisterForm */}
          {isLoginRoute && (
            <LoginForm onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
          )}
          {isRegisterRoute && (
            <RegisterForm onRegisterError={handleLoginError} />
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className='mt-2 text-center'>
            <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
              {isLoginRoute ? "Don't have an account?" : "Already have an account?"}{' '}
              <button className='main-color-text' onClick={goToPage}>
                {isLoginRoute ? 'Sign up' : 'Log in'}
              </button>
            </Typography>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 main-color p-4">
        {/* Optionally add additional content here */}
      </div>
    </div>
  );
}

export default LoginPage;
