import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className=" bg-[rgb(249,249,251)] ">
      {/*First part*/}
      <div className="main-color pb-[23rem]">
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
          <img src="images/main-page-img.png" className="w-3/5 rounded-lg" />
        </div>
      </div>
      {/*First part*/}

      <div className="/h-[2000px]">
        {/*Second part*/}
        <div
          className="bg-white mx-[8rem] mt-[-15rem] mb-[8rem] rounded-2xl p-[5rem]"
          style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <Typography
            variant="lead"
            className="font-bold text-4xl text-center main-color-text-darker pb-11"
          >
            The True Cost of Ignoring Budget Management
          </Typography>
          <div className="flex justify-between pt-5">
            <div className="flex flex-col items-center text-center">
              <img className="w-[20px]" src="images/dot-inside-a-circle.png" />
              <Typography
                variant="lead"
                className="font-bold text-xl dark-blue-text py-3"
              >
                Delayed Goals
              </Typography>

              <Typography className="w-[19rem] dark-blue-text font-thin">
                75% of people without a budget fail to meet key financial
                milestones like home ownership or retirement savings on time.
              </Typography>
            </div>
            <div className="flex flex-col items-center text-center">
              <img className="w-[20px]" src="images/dot-inside-a-circle.png" />
              <Typography
                variant="lead"
                className="font-bold text-xl dark-blue-text py-3"
              >
                Missed Opportunities
              </Typography>

              <Typography className="w-[19rem] dark-blue-text font-thin">
                30% of potential savings lost each month due to unmonitored
                subscriptions, impulse purchases, and overlooked expenses.
              </Typography>
            </div>
            <div className="flex flex-col items-center text-center">
              <img className="w-[20px]" src="images/dot-inside-a-circle.png" />
              <Typography
                variant="lead"
                className="font-bold text-xl dark-blue-text py-3"
              >
                Financial Stress
              </Typography>
              <Typography className="w-[19rem] dark-blue-text font-thin">
                Up to a 60% increase in stress levels when budgets are poorly
                managed, impacting overall well-being and decision-making.
              </Typography>
            </div>
          </div>
        </div>
        {/*Second part*/}

        {/*Third part*/}
        <div className="p-11 pb-[8rem]">
          <div className="flex /mt-[8rem]">
            <div className="w-3/5">
              <Typography
                variant="lead"
                className="font-bold text-5xl text-gray-700  /main-color-text-darker pb-[5rem]"
              >
                Uncover the Hidden Path to Financial Freedom
              </Typography>
              <div className="flex pr-4">
                <div className="w-1/5 ">
                  <img src="images/magnifying-glass.png" className="w-[30px]" />
                  <img src="images/link.png" className="w-[30px] pt-[5.7rem]" />
                  <img
                    src="images/growth.png"
                    className="w-[30px] pt-[5.8rem]"
                  />
                </div>
                <div>
                  <Typography
                    variant="lead"
                    className="font-bold text-xl text-gray-600 /main-color-text-darker pb-2"
                  >
                    Discover the “Why”
                  </Typography>
                  <Typography className=" text-gray-400 font-thin text-sm pb-7">
                    Go beyond tracking expenses and income. Uncover the key
                    drivers of financial success, like mindful spending, saving
                    for the future, and aligning your money with your goals.
                    Understand why you spend and save the way you do to create a
                    budget that truly works for you.
                  </Typography>

                  <Typography
                    variant="lead"
                    className="font-bold text-xl text-gray-600  /main-color-text-darker pb-2"
                  >
                    Connecting the Dots
                  </Typography>
                  <Typography className=" text-gray-400 font-thin text-sm pb-7">
                    If your monthly savings are shrinking, it could signal
                    creeping expenses or oversights in planning. Connect the
                    dots between your spending habits, savings goals, and
                    financial health, all in one place. Gain insights to make
                    informed decisions without the guesswork.
                  </Typography>
                  <Typography
                    variant="lead"
                    className="font-bold text-xl text-gray-600 /main-color-text-darker pb-2"
                  >
                    BudgetWisely: Your Guide to Financial Clarity
                  </Typography>
                  <Typography className=" text-gray-400 font-thin text-sm">
                    Empower your financial journey by uncovering the underlying
                    factors, connecting the dots, and staying ahead of
                    challenges—before they impact your goals.
                  </Typography>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="w-3/5 pl-[8rem] pt-[6.5rem]">
              <img
                src="images/browser.jpg"
                className="rounded-lg h-[21rem]"
                style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
              />
              <img
                src="images/pie.jpg"
                className="h-[10rem] rounded-lg mt-[-28rem] ml-[28rem]"
                style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
              />
              <img
                src="images/graph.jpg"
                className="w-[15rem] rounded-lg ml-[-7rem] mt-[16rem]"
                style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
              />
            </div>
          </div>
          <button
            className="mx-11  p-2 px-9 text-white font-thin dark-blue"
            onClick={() => navigate("/register")}
          >
            Join now
          </button>
        </div>
        {/*Third part*/}

        {/*Fourth part*/}
        <div className="main-color flex py-[4rem] ">
          <div className="flex ">
            <img
              src="images/laptop-1.jpg"
              className="mr-5 rounded-lg h-[30rem]"
            />
            <img
              src="images/laptop-2.jpg"
              className="mr-5 rounded-lg h-[30rem]"
            />
            <img src="images/laptop-3.jpg" className=" rounded-lg h-[30rem]" />
          </div>

          <div className="w-2/5 p-11 flex flex-col justify-center items-center">
            <Typography variant="lead" className="font-bold text-4xl pb-[5rem]">
              Take control of your finances and avoid the hidden costs of poor
              budgeting.
            </Typography>
            <Typography variant="lead" className="font-bold text-4xl">
              Build smarter habits today for a more secure tomorrow.
            </Typography>
          </div>
        </div>
        {/*Fourth part*/}

        {/*Footer*/}
        <div className="dark-blue py-[2rem] text-white">
          <div className="flex justify-center">
            <div className="flex-col pr-4 border-r border-white">
              <Typography
                variant="lead"
                className="font-bold text-white text-xl text-right mb-2"
              >
                Save smarter.
              </Typography>
              <Typography
                variant="lead"
                className="font-bold text-white text-xl text-right mb-3"
              >
                Spend wiser.
              </Typography>
              <Typography
                variant="lead"
                className="font-bold text-white text-xl text-right"
              >
                Grow faster.
              </Typography>
            </div>
            <button
              className="pl-4 text-sm flex items-center font-thin"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to the top
              <svg
                className="w-[25px] text-white dark:text-white"
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
                  d="M12 19V5m0 0-4 4m4-4 4 4"
                />
              </svg>
            </button>
          </div>
          <span className="mt-4 text-xs flex pl-5 justify-center">
            Copyright © BudgetWisely
          </span>
        </div>
        {/*Footer*/}
      </div>
    </div>
  );
};

export default HomePage;
