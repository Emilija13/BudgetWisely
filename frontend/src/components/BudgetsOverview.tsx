import { Budget } from "../models/Budget";
import BudgetListItem from "./BudgetListItem";
import CategoryListItem from "./CategoryListItem";
import { useNavigate } from "react-router-dom";

interface BudgetsListProps {
    budgets: Budget[];
}



const BudgetsOverview = ({ budgets }: BudgetsListProps) => {

    const navigate = useNavigate();

    const goToBudgetsPage = () => {
        navigate("/budgets");
    }

    return (
        <div className="bg-white h-[100%] rounded-lg p-5" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>

            <div>
                <div className="px-4 py-2 flex justify-between items-center font-light text-gray-800 inter spacing-5 pl-[5px]" >
                    <div className="ml-3 mb-3 font-semibold dark-blue-text text-md">
                        Budgets
                    </div>
                    <div className="flex justify-end">
                        <button onClick={goToBudgetsPage} className="text-end text-sm flex justify-end font-thin text-gray-400 mr-2 ">See all <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 12H5m14 0-4 4m4-4-4-4" />
                        </svg></button>
                    </div>
                </div>
                {budgets.map((budget) => (
                    <BudgetListItem budget={budget}></BudgetListItem>
                ))}
            </div>

        </div>
    );
};

export default BudgetsOverview;
