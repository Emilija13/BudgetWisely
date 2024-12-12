import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to the App</h1>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default HomePage;
