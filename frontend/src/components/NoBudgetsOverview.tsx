import { useNavigate } from "react-router-dom";

useNavigate

function NoBudgetsOverview() {

    const navigate = useNavigate();

    const goToBudgetsPage = () => {
        navigate("/budgets");
    }
    return (
        <div className="flex bg-white rounded-lg p-5" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
        <div className="mt-7 ml-10 font-semibold dark-blue-text text-md w-[50%]">
            Budgets
        </div>

        <div
            className="h-[100%] w-[50%] px-10 py-4 flex justify-end items-center text-gray-500 text-sm font-light">
            <div className="mr-10 mt-3">You don't have any budgets yet!</div>
            <button
                className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-md main-color transition"
                onClick={goToBudgetsPage}
            >
                Go to Budgets
            </button>
        </div>

    </div>
    )
}

export default NoBudgetsOverview;