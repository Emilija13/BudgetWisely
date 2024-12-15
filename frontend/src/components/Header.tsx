import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');


  const isLoggedIn = user !== null;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    navigate('/login');
  };

  return (
    <header className="bg-white flex justify-end items-center">
      {/* <nav className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <span className="text-lg">{`Hello, ${user.email}`}</span>
            <button 
              onClick={handleLogout} 
              className="bg-white text-blue-600 py-2 px-4 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-blue-600 py-2 px-4 rounded">
            Login
          </Link>
        )}
      </nav> */}
    </header>
  );
};

export default Header;
