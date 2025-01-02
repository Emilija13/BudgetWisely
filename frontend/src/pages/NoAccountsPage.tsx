import { useNavigate } from "react-router-dom";

function NoAccountsPage() {

    const navigate = useNavigate();

    const goToAccountsPage = () => {
        navigate("/accounts");
    }

    return (
        <div className="mx-[5rem]">
            <div className="flex justify-between p-15 bg-white rounded-lg" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>

                <div className="flex flex-col justify-center items-center w-full h-[30rem]  text-center text-gray-600" >
                    <p className="text-lg font-semibold">Looks like you don’t have any accounts yet!</p>
                    <p className="mt-2 text-sm font-light">Let’s fix that so you can start tracking your transactions.</p>
                    <button
                        className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-md main-color transition"
                        onClick={goToAccountsPage}
                    >
                        Go to Accounts
                    </button>
                </div>

                {/* <img className="w-[25rem] h-[100%] mt-[3.5rem] mr-[13rem]" src="../../no_accounts.png"></img> */}


            </div>
        </div>
    );

}

export default NoAccountsPage