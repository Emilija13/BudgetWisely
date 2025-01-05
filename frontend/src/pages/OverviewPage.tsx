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
import { FilteredTransactionsDto } from "../models/dto/FilteredTransactionsDto";
import { User } from "../models/User";
import BudgetsOverview from "../components/BudgetsOverview";
import { Budget } from "../models/Budget";
import { BudgetService } from "../services/BudgetService";
import { UserService } from "../services/UserService";
import NoAccountsPage from "./NoAccountsPage";
import NoBudgetsOverview from "../components/NoBudgetsOverview";
import DonutChartBudgetProgress from "../components/charts/DonutChartBudgetProgress";
import { BudgetStatsDto } from "../models/dto/BudgetStatsDto";
import LastMonthSaved from "../components/LastMonthSaved";
import IncomeExpenseTotal from "../components/IncomeExpenseTotal";


function OverviewPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [FilteredTransactions, setFilteredTransactions] = useState<FilteredTransactionsDto>();
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User>();
    // const [selectedRange, setSelectedRange] = useState<string>("This month"); // New State
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [budgetStats, setBudgetStats] = useState<BudgetStatsDto>();
    const [savedLastMonth, setSavedLastMonth] = useState<number>();
    const [donutChartTransactions, setDonutChartTransactions] = useState<FilteredTransactionsDto>();
    const [barChartTransactions, setBarChartTransactions] = useState<FilteredTransactionsDto>();
    const [selectedRange, setSelectedRange] = useState<string>("This month"); // For the donut chart
    const [barChartRange, setBarChartRange] = useState<string>("This month"); // For the bar chart
    const [totalExpenses, setTotalExpenses] = useState<number>();
    const [totalIncome, setTotalIncome] = useState<number>();
    const [showBarChart, setShowBarChart] = useState(false); 




    const fetchUser = async (userId: number) => {
        try {
            const response = await UserService.getUser(userId);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            setError("Failed to fetch user.");
        }
    };

    const fetchBudgets = useCallback(async () => {
        try {
            setLoading(true);
            if (userId) {
                const response1 = await BudgetService.getLastBudgetsForUser(+userId);
                const response2 = await BudgetService.getCurrentBudgetsStats(+userId);
                const response3 = await BudgetService.getLastMonthSaved(+userId);
                setBudgets(response1.data);
                setBudgetStats(response2.data)
                setSavedLastMonth(response3.data)
                console.log("Budgets: ", response1.data);
            }
        } catch (err) {
            console.error("Error fetching budgets:", err);
            setError("Failed to load budgets:");
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

    const fetchFilteredTransactionsForDonut = useCallback(async () => {
        try {
            const dateRange = calculateDateRange(selectedRange);
            const filterDto: FilterDto = {
                userId: +userId!,
                accountId: null,
                categoryId: null,
                type: "EXPENSE", // Only expenses for the donut chart
                start: dateRange.start,
                end: dateRange.end,
            };
            const response = await TransactionService.filter(filterDto);
            setDonutChartTransactions(response.data);
        } catch (err) {
            console.error("Error fetching donut chart transactions:", err);
            setError("Failed to load donut chart transactions.");
        }
    }, [selectedRange, userId]);

    const fetchFilteredTransactionsForBar = useCallback(async () => {
        try {
            const dateRange = calculateDateRange(barChartRange);
            const filterDto: FilterDto = {
                userId: +userId!,
                accountId: null,
                categoryId: null,
                type: null, // All types for the bar chart
                start: dateRange.start,
                end: dateRange.end,
            };
            const response = await TransactionService.filter(filterDto);

            // Set bar chart transactions
            setBarChartTransactions(response.data);

            // Set totalExpenses and totalIncome only for the first fetch and "This month"
            if (!totalExpenses && !totalIncome && barChartRange === "This month") {
                setTotalExpenses(response.data?.totalExpense || 0);
                setTotalIncome(response.data?.totalIncome || 0);
            }
        } catch (err) {
            console.error("Error fetching bar chart transactions:", err);
            setError("Failed to load bar chart transactions.");
        }
    }, [barChartRange, userId, totalExpenses, totalIncome]);



    useEffect(() => {
        fetchFilteredTransactionsForDonut();
        fetchFilteredTransactionsForBar();
    }, [fetchFilteredTransactionsForDonut, fetchFilteredTransactionsForBar]);


    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
        fetchBudgets();
        if (userId)
            fetchUser(+userId);
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
    // if (loading) {
    //     return <div>Loading...</div>;
    // }


    return (
        <section className="w-full">
            {/* Header */}
            <div className="p-10 mx-10 pt-[4rem] flex justify-between">
                <Typography variant="lead" color="blue-gray" className="font-bold text-lg dark-blue-text">
                    Overview
                </Typography>
                <Typography variant="lead" className="font-semibold dark-blue-text text-3xl">
                    Welcome, {user?.userName}! 👋
                </Typography>
            </div>

            {/* Conditional Rendering: Check if accounts exist */}
            {accounts.length === 0 ? (
                <NoAccountsPage />
            ) : (
                <div className="mx-[4rem]">
                    <div className="flex h-25">
                        <div className="flex w-[77%] h-[25rem] bg-white mr-[2.5rem] rounded-lg" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                            <div className="flex-1 rounded-lg" >
                                <div className="text-md font-semibold dark-blue-text mt-8 ml-8">Total Balance</div>

                                {/* Total Balance */}
                                <div className="flex justify-center my-10 mt-[40px]">
                                    <div className="text-[37px] ml-2 font-semibold main-color-text">
                                        {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        <span className="text-[20px] font-light ml-1 dark-blue-text" >MKD</span>
                                    </div>
                                </div>

                                {/* Accounts */}
                                <div className="mt-4 mx-4 ml-10">
                                    <div className="font-thin text-gray-600 text-md mb-2">Accounts:</div>
                                    <div className="mx-3 overflow-auto h-40 pr-6">
                                        {accounts.map((account) => (
                                            <div>
                                                <div key={account.id} className="flex justify-between py-2 spacing-3 dark-blue-text">
                                                    <span className="font-light">{account.name}</span>
                                                    <span className="text-right">
                                                        {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} MKD
                                                    </span>
                                                </div>
                                                <hr></hr>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-[550px] bg-white rounded-lg py-7 pl-1" >
                                <div className="flex justify-between items-center px-7">
                                    <div className="text-md font-semibold dark-blue-text">Expenses Analytics</div>
                                    <div className="custom-select">
                                        <select
                                            value={selectedRange}
                                            onChange={(e) => setSelectedRange(e.target.value)}
                                            className="cursor-pointer text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-0 focus:border-transparent border-none"
                                        >
                                            <option value="This month">This month</option>
                                            <option value="Last month">Last month</option>
                                            <option value="Last 3 months">Last 3 months</option>
                                            <option value="Last 6 months">Last 6 months</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="px-[2rem] pt-[2.5rem]">
                                    <DonutChartTransactions filteredTransactionsDto={donutChartTransactions!}></DonutChartTransactions>
                                </div>
                            </div>
                        </div>

                        <div className="w-[23%]">
                            <LastTransactionsTable transactions={transactions}></LastTransactionsTable>
                        </div>
                    </div>

                    <div className="mt-[2.5rem] rounded-lg">
                        <div className="w-[100%] h-[23rem]">
                            {budgets.length === 0 ? (
                                <div>
                                    <NoBudgetsOverview></NoBudgetsOverview>
                                </div>
                            ) : (
                                <div className="flex">
                                    <div className="w-[27%] h-[22.6rem] rounded-lg mr-[2.5rem]">
                                        <div className="h-[44%] mb-[2.5rem]">
                                            <div className="mb-1 px-1 py-1 flex justify-between items-center font-light text-gray-800 spacing-5 pl-[5px]">
                                                <div className="ml-1 font-semibold dark-blue-text text-md">
                                                    Transactions amount this month
                                                </div>
                                                <div className="flex justify-end">
                                                    {/* <button className="text-end text-sm flex justify-end font-thin text-gray-400  mr-2">
                                                        View more <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                                        </svg>
                                                    </button> */}
                                                </div>
                                            </div>
                                            <IncomeExpenseTotal totalExpenses={totalExpenses!} totalIncome={totalIncome!}>

                                            </IncomeExpenseTotal>
                                        </div>
                                        <div className="h-[35%] mt-[4.7rem]">

                                            <LastMonthSaved savedAmount={savedLastMonth!}></LastMonthSaved>
                                        </div>

                                    </div>

                                    <div className="flex flex-grow rounded-lg h-[22.6rem]" >

                                        <div className="flex-1 mr-[2.5rem]">
                                            <BudgetsOverview budgets={budgets}></BudgetsOverview>
                                        </div>
                                        <div className="w-[312px] bg-white rounded-lg" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                                            <div className="text-md font-semibold dark-blue-text mt-8 ml-8 mb-6">Total budget expenditures</div>
                                            <div className="px-9">
                                                <div className="text-sm font-thin text-gray-700 custom-select mb-3">This month</div>
                                                <DonutChartBudgetProgress totalAmount={budgetStats?.totalAmount!} spent={budgetStats?.spent!}></DonutChartBudgetProgress>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>



                    {/* <div className=" mt-[2.5rem] mb-[3rem] pt-[2rem] pb-[2rem] px-[4rem] bg-white rounded-lg " style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                        <div className="text-md font-semibold dark-blue-text">Expenses Analytics</div>
                        <div className="flex justify-end">
                            <button className="text-end text-sm flex justify-end font-thin text-gray-400  mr-2">
                                Open Chart <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                </svg>
                            </button>
                        </div>
                    </div> */}

                    <div
                        className="mt-[2.5rem] mb-[3rem] pt-[2rem] pb-[0.5rem] px-[4rem] bg-white rounded-lg"
                        style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
                    >
                        <div className="flex justify-between mb-[2rem]">
                            <div className="text-md font-semibold dark-blue-text">Expenses Analytics</div>

                            {showBarChart ? (
                                <button
                                    className="text-end text-sm flex justify-end font-thin text-gray-600 hover:text-gray-800 mr-2 arial"
                                    onClick={() => setShowBarChart(false)}
                                >
                                    Close Chart 
                                </button>
                            ) : (
                                <button
                                    className="text-end text-sm flex justify-end font-thin text-gray-600 hover:text-gray-800 mr-2 arial"
                                    onClick={() => setShowBarChart(true)}
                                >
                                    Open Chart
                                </button>
                            )}
                        </div>

                        {/* Conditional Rendering of Chart */}
                        {showBarChart && (
                            <div>
                                <div className="custom-select flex justify-end mb-2">
                                    <select
                                        value={barChartRange}
                                        onChange={(e) => setBarChartRange(e.target.value)}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-0 focus:border-transparent border-none"
                                    >
                                        <option value="This month">This month</option>
                                        <option value="Last month">Last month</option>
                                        <option value="Last 3 months">Last 3 months</option>
                                        <option value="Last 6 months">Last 6 months</option>
                                    </select>
                                </div>
                                <div className="h-[20rem] w-[100%] flex justify-center mb-[2rem]">
                                    <BarChartTransactions
                                        filteredTransactionsDto={barChartTransactions}
                                    ></BarChartTransactions>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </section>
    );


}

export default OverviewPage