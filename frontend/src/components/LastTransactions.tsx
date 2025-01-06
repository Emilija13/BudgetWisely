import { TableProps } from "./props/TableProps";
import { TransactionType } from "../models/enum/TransactionType";
import { useNavigate } from "react-router-dom";

function LastTransactionsTable({ transactions = [] }: TableProps) {    
    const navigate = useNavigate();

    const goToTransactionsPage = () => {
        navigate("/transactions");
    };

    return (
        <div>
            <div className="bg-[rgb(240, 240, 240)]">
                <div className="h-[2.5rem] relative pt-2">
                    <div className="px-1 py-1 flex justify-between items-center font-light text-gray-800 spacing-5 pl-[5px]">
                        <div className="ml-1 font-semibold dark-blue-text text-md">
                            Last Transactions
                        </div>
                        {transactions.length > 0 ? (
                        <div className="flex justify-end">
                            <button onClick={goToTransactionsPage} className="text-end text-sm flex justify-end font-thin text-gray-400  mr-2">
                                See all <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                </svg>
                            </button>
                        </div>) : (
                            <div></div>
                        )}
                    </div>
                </div>
                <hr className="border-t-0 border-b-[1px] border-gray-100"></hr>
            </div>
            <div className="rounded-lg bg-white" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                {transactions.length === 0 ? (
                    <div
                        className="h-[22.4rem] flex flex-col justify-center items-center text-gray-500 text-sm font-light"
                    >
                        <div>You don't have any transactions yet!</div>
                        <button
                        className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-md main-color transition"
                        onClick={goToTransactionsPage}
                    >
                        Go to Transactions
                    </button>
                    </div>
                ) : (
                    transactions.map((transaction, index) => {
                        return (
                            <div key={index} className="group hover:bg-gray-50">
                                <div className="h-[3.7rem] pt-1">
                                    <div className="relative">
                                        <div
                                            className={`absolute left-0 top-0 bottom-0 w-[0px] ${transaction.type === TransactionType.INCOME ? 'bg-[#00B58D]' : 'bg-[#FF6161]'} rounded-[2px] group-hover:w-[4px] group-hover:opacity-100 opacity-75 transition-all duration-200`}
                                        ></div>
                                        <div className="h-[3.4rem] px-10 flex justify-between items-center font-light dark-blue-text text-[16px] spacing-5 pl-[12px]">
                                            <div className="ml-5">
                                                {transaction.name}
                                            </div>
                                            <div style={{ color: transaction.type === TransactionType.INCOME ? "#00B58D" : "#DD5A5A" }}>
                                                {transaction.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[12px]">MKD</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-t-0 border-b-[1px] border-gray-200 group-hover:border-gray-100"></hr>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LastTransactionsTable;
