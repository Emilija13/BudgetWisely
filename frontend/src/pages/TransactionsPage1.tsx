import { Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Transaction } from "../models/Transaction";
import { TransactionService } from "../services/TransactionService";
import Table from "../components/Table";
import AddButton from "../components/AddButton";
import { Category } from "../models/Category";
import { CategoryService } from "../services/CategoryService";
import AddForm from "../components/AddForm";
import { Account } from "../models/Account";
import { AccountService } from "../services/AccountService";
import TransactionsTable from "../components/TransactionsTable";
import Filter from "../components/Filter";
import TransactionForm from "../components/TransactionForm";
import DateFilter from "../components/DateFilter";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        const userId: number = JSON.parse(user).id;

        const response =
          await TransactionService.getAllTransactionsForUser(userId);
        setTransactions(response.data);
        const response2 = await AccountService.getAllAccountsForUser(userId);
        setAccounts(response2.data);
      } else {
        //TODO treba voopsto da ne se setiraat transactions i accounts
        const response = await TransactionService.getAllTransactions();
        setTransactions(response.data);
        const response2 = await AccountService.getAllAccounts();
        setAccounts(response2.data);
      }
      const response1 = await CategoryService.getAllCategories();
      setCategories(response1.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddButtonClick = () => {
    setIsFormVisible(true);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  const TABLE_HEAD = ["Name", "Cost", "Type", "Date", "Category", "Account"];

  return (
    <section className="w-full purple-light">
      <div>
        <div className="p-6">
          <Typography
            variant="lead"
            color="blue-gray"
            className="text-gray-600 font-bold"
          >
            Transactions List
          </Typography>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col">
            <Filter categories={categories} accounts={accounts} />
            <TransactionForm categories={categories} accounts={accounts} />
          </div>
          <div className="w-4/6 h-200 px-6 overflow-hidden">
            <DateFilter />
            <TransactionsTable transactions={transactions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionsPage;
