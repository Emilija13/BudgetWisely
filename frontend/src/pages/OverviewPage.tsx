import { Typography } from "@material-tailwind/react";
import BarChartTransactions from "../components/charts/BarChartTransactions";
import { FilterDto } from "../models/dto/FilterDto";
import DonutChartTransactions from "../components/charts/DonutChartTransactions";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { useState, useEffect, useCallback } from "react";
import { TransactionService } from "../services/TransactionService";
import { Transaction } from "../models/Transaction";
import LastTransactionsTable from "../components/LastTransactions";
import { useNavigate } from "react-router-dom";
import PieChartTransactions from "../components/charts/PieChartTransactions";
import { FilteredTransactionsDto } from "../models/dto/FilteredTransactionsDto";
import { User } from "../models/User";
import BudgetsOverview from "../components/BudgetsOverview";
import { Budget } from "../models/Budget";
import { BudgetService } from "../services/BudgetService";


function OverviewPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [FilteredTransactions, setFilteredTransactions] = useState<FilteredTransactionsDto>();
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User>();
    const [selectedRange, setSelectedRange] = useState<string>("This month"); // New State
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const fetchBudgets = useCallback(async () => {
        try {
            setLoading(true);
            if (userId) {
                const response1 = await BudgetService.getLastBudgetsForUser(+userId);
                setBudgets(response1.data);
                console.log("Budgets: ", response1.data);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories:");
        } finally {
            setLoading(false);
        }
    }, [userId]);


    const fetchAccounts = async () => {
        try {
            if (userId) {
                const response1 = await AccountService.getTotalBalanceForUser(+userId);
                setTotalBalance(response1.data);
                const response = await AccountService.getAllAccountsForUser(+userId);
                setAccounts(response.data);
            }
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setError("Failed to load accounts.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            console.log("userid: ", userId);
            if (userId) {
                const response1 = await TransactionService.getLastTransactionsForUser(
                    +userId
                );
                setTransactions(response1.data);
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transactions:");
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredTransactions = useCallback(async () => {
        try {
            // Prepare the date range filter based on selectedRange
            const dateRange = calculateDateRange(selectedRange);

            // Create the filter DTO
            const filterDto: FilterDto = {
                userId: +userId!,  // Ensure userId is available
                accountId: null,
                categoryId: null,
                type: "EXPENSE",  // Default type for the donut chart
                start: dateRange.start,
                end: dateRange.end,
            };

            // Fetch filtered transactions based on the filter DTO
            const response = await TransactionService.filter(filterDto);
            setFilteredTransactions(response.data); // Set the filtered data
            console.log("Fetched filtered transactions:", response.data);
        } catch (err) {
            console.error("Error fetching filtered transactions:", err);
            setError("Failed to load filtered transactions.");
        }
    }, [selectedRange, userId]); // Re-fetch data when selectedRange or userId changes


    useEffect(() => {
        fetchFilteredTransactions();  // Fetch data when the component mounts or when selectedRange changes
    }, [fetchFilteredTransactions]);  // This will run on mount and when selectedRange changes


    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
        fetchBudgets();
    }, []);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const now = new Date();

    const filterDto: FilterDto = {
        userId: +userId!,
        accountId: null,
        categoryId: null,
        type: null,
        start: startOfMonth.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0],
    };

    // const donutChartDto: FilterDto = {
    //     ...filterDto,
    //     type: "EXPENSE",
    // };

    const calculateDateRange = (range: string) => {
        const now = new Date();
        let start = new Date(now);
        switch (range) {
            case "Last month":
                start.setMonth(now.getMonth() - 1);
                start.setDate(1);
                now.setDate(0);
                break;
            case "Last 3 months":
                start.setMonth(now.getMonth() - 3);
                start.setDate(1);
                break;
            case "Last 6 months":
                start.setMonth(now.getMonth() - 6);
                start.setDate(1);
                break;
            default: // "This month"
                start.setDate(1);
                break;
        }
        return { start: start.toISOString().split("T")[0], end: now.toISOString().split("T")[0] };
    };

    // Update `donutChartDto` based on the selected date range
    const dateRange = calculateDateRange(selectedRange);
    const donutChartDto: FilterDto = {
        userId: +userId!,
        accountId: null,
        categoryId: null,
        type: "EXPENSE",
        start: dateRange.start,
        end: dateRange.end,
    };


    if (error) {
        return <div>{error}</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="w-full">


            {/* <div className="pr-[7rem] pt[-5rem] text-end mt-10 mr-9">
                <Typography variant="lead" className="font-semibold dark-blue-text text-3xl">
                    Welcome, Mila! 👋
                </Typography>
            </div> */}

            <div className="p-10 mx-10 pt-[4rem] flex justify-between">
                <Typography variant="lead" color="blue-gray" className="font-bold text-lg dark-blue-text">
                    Overview
                </Typography>
                <Typography variant="lead" className="font-semibold dark-blue-text text-3xl">
                    Welcome, Mila! 👋
                </Typography>
            </div>

            {/* <div className="mx-[6rem] mb-3 mt-5">
                <Typography variant="lead" color="blue-gray" className="font-bold text-md">
                    This Month
                </Typography>
            </div> */}
            <div className="mx-[5rem]">
                <div className="flex h-25 " >
                    <div className="flex w-[75%] h-[25rem] bg-white mr-[3rem] rounded-lg" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }} >

                        <div className="flex-1 rounded-lg" >
                            <div className="text-md font-semibold dark-blue-text mt-6 ml-6">Total Balance</div>

                            {/* Total Balance */}
                            <div className="flex justify-center my-10 mt-[40px]">
                                <div className="text-[36px] ml-10 font-semibold dark-blue-text">{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} MKD
                                    {/* <span className="text-[25px] text-black ml-1 font-light">MKD</span> */}
                                </div>
                            </div>

                            {/* Accounts*/}
                            <div className="mt-4 mx-4 ml-10">
                                <div className="font-thin text-gray-600 text-md mb-2">Accounts:</div>
                                <div className="mx-3 overflow-auto h-40 pr-6">
                                    {accounts.map((account) => (
                                        <div key={account.id} className="flex justify-between py-2 spacing-3  dark-blue-text">
                                            <span className="font-light inter">{account.name}</span>
                                            <span className="text-right">{account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} MKD</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-[550px] bg-white rounded-lg py-7 pl-1">
                            <div className="flex justify-between items-center px-7">
                                <div className="text-md font-semibold dark-blue-text">Analytics</div>
                                <select
                                    value={selectedRange}
                                    onChange={(e) => setSelectedRange(e.target.value)}
                                    className="border border-gray-200 text-gray-500 rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="This month">This month</option>
                                    <option value="Last month">Last month</option>
                                    <option value="Last 3 months">Last 3 months</option>
                                    <option value="Last 6 months">Last 6 months</option>
                                </select>
                            </div>

                            

                            <div className="px-[2rem] pt-[2.5rem]">

                                <DonutChartTransactions filteredTransactionsDto={FilteredTransactions!}></DonutChartTransactions>
                            </div>
                        </div>
                    </div>

                    <div className="w-[25%]">
                        {/* <div className="text-xl font-bold mb-6 spacing-3 dark-blue-text">Last transactions</div> */}

                        <LastTransactionsTable transactions={transactions}></LastTransactionsTable>
                    </div>
                </div>

                <div className="flex my-[3rem] h-[25rem] rounded-lg " >
                    {/* <div className="w-[30%] bg-white rounded-lg mr-[3rem] p-6" > */}
                    <div className="w-[50%]  mr-[3rem]" >
                        <BudgetsOverview budgets={budgets}></BudgetsOverview>
                    </div>
                </div>



                <div className="flex my-[5rem] h-25 bg-white rounded-lg p-7" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>

                    <BarChartTransactions filterDto={filterDto}></BarChartTransactions>
                </div>
            </div>

            <div className="">
            </div>


        </section>
    );
}

export default OverviewPage