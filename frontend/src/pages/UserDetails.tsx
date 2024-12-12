import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
    const navigate = useNavigate();

    
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    navigate('/');

  };
  return (
    <div> <button 
    onClick={handleLogout} 
    className="bg-white text-blue-600 py-2 px-4 rounded">
    Logout
  </button></div>
  )
}

export default UserDetails