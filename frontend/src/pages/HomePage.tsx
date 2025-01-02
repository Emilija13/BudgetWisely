import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className=" bg-[rgb(249,249,251)] ">
      <div className="main-color ">
        <div className="flex justify-between  pt-[3rem] px-[7rem]">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-bold text-3xl"
          >
            BudgetWisely
          </Typography>
          <div className="">
            <button onClick={() => navigate("/login")} className="text-lg">
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="pl-[3rem] text-lg"
            >
              Register
            </button>
          </div>
        </div>

        <div className="flex justify-end items-center py-[3rem]">
          <div className="flex-col pr-[7rem]">
            <Typography
              variant="lead"
              className="font-bold text-6xl text-right mb-2"
            >
              Save smarter.
            </Typography>
            <Typography
              variant="lead"
              className="font-bold text-6xl text-right mb-3"
            >
              Spend wiser.
            </Typography>
            <Typography
              variant="lead"
              className="font-bold text-6xl text-right"
            >
              Grow faster.
            </Typography>
            <div className="my-9 bg-white flex justify-between">
              <Typography className="p-7 dark-blue-text font-thin">
                Start your budgeting journey now!
              </Typography>
              <button
                className="w-1/5  dark-blue"
                onClick={() => navigate("/register")}
              >
                <svg
                  className="w-full h-full text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                  />
                </svg>
              </button>
            </div>
          </div>
          <img src="main-page-img-1.jpg" className="w-3/5 rounded-lg" />
        </div>
      </div>
      <div className="h-[400px]">Second part</div>
    </div>
  );
};

export default HomePage;
