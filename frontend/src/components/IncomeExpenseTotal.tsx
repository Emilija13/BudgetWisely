
const IncomeExpenseTotal = ({ totalExpenses, totalIncome }: { totalExpenses: number, totalIncome: number }) => {
    return (
        <div className="flex h-[100%] relative bg-white rounded-lg font-light" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
            <div className="p-[2rem] w-[50%] dark-blue-text">
                <div>

                    <div className="font-thin text-center text-gray-600 arial text-sm">
                        Total income:
                    </div>

                    <div className="flex mt-4">

                        <svg className="w-[4rem] h-[4rem] mr-[-0.5rem] mt-[-0.5rem] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="#179B7E" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.7" d="M12 6v13m0-13 4 4m-4-4-4 4" />
                        </svg>

                        <div>
                            <div className="text-[1.7rem] ">
                                {totalIncome}
                            </div>
                            <div className="mt-[-0.7rem] ml-1">
                                MKD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-l border-gray-200 p-[2rem] w-[50%] dark-blue-text ">
                <div>

                    <div className="font-thin text-center text-gray-600 arial text-sm">
                        Total expenses:
                    </div>

                    <div className="flex mt-4">

                        <svg className="w-[4rem] h-[4rem] mr-[-0.5rem] mt-[-0.5rem] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="#DD5A5A" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.7" d="M12 19V5m0 14-4-4m4 4 4-4" />
                        </svg>


                        <div>
                            <div className="text-[1.7rem] ">
                                {totalExpenses}
                            </div>
                            <div className="mt-[-0.7rem] ml-1">
                                MKD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>




    )
}
export default IncomeExpenseTotal;