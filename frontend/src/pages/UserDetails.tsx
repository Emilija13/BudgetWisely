import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../models/User";
import { UserService } from "../services/UserService";

const UserDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");

  const fetchUser = async (userId: number) => {
    try {
      const response = await UserService.getUser(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");

    navigate("/");
  };

  useEffect(() => {
    if(userId)
      fetchUser(+userId);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
console.log(user)
  return (
    <div className="">
      <div className="p-10 mx-10 pt-[4rem] ">
        <Typography
          variant="lead"
          color="blue-gray"
          className="font-bold text-lg dark-blue-text"
        >
          My Profile
        </Typography>
      </div>
      <div className="flex justify-center items-center">
        <div
          className="w-[85%] h-[25rem] p-9 bg-white mr-[3rem] rounded-lg"
          style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex h-[40%] pb-11 ">
            <img src="person.png" className="" />
            <Typography
              variant="lead"
              className="font-semibold dark-blue-text text-3xl pl-11 pt-11"
            >
              Welcome, {user?.userName}! 👋
            </Typography>
          </div>
          <div className="border border-gray-100 p-7 px-11 h-[50%] rounded-xl">
            <Typography
              variant="lead"
              color="blue-gray"
              className="font-bold text-lg dark-blue-text"
            >
              Personal info
            </Typography>
            <div className="flex justify-between mt-5">
              <div className="flex">
                <div className="text-sm font-light text-gray-400 mr-[12rem]">
                  Username
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-bold text-md my-2 dark-blue-text"
                  >
                    {user?.userName}
                  </Typography>
                </div>
                <div className="text-sm font-light text-gray-400 mr-{10rem]">
                  Email
                  <Typography
                    variant="lead"
                    color="blue-gray"
                    className="font-bold text-md my-2 dark-blue-text"
                  >
                    {user?.email}
                  </Typography>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className=" main-color my-3  px-5 font-sm font-light text-white rounded-xl shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
