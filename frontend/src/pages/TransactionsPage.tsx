import { Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Transaction } from "../models/Transaction";
import { TransactionService } from "../services/TransactionService";
import Table from "../components/Table";
import AddButton from "../components/AddButton";
import { Category } from "../models/Category";
import { CategoryService } from "../services/CategoryService";
import AddForm from "../components/AddForm";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const fetchTransactions = async () => {
    try {
      const response = await TransactionService.getAllTransactions();
      setTransactions(response.data);
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

  const handleCloseForm = () => {
    fetchTransactions();
    setIsFormVisible(false);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  const TABLE_HEAD = ["Name", "Cost", "Date", "Category"];

  return (
    <section className="w-full bg-white">
      {isFormVisible ? (
        <AddForm
          pageName="transaction"
          categories={categories}
          onClose={handleCloseForm}
        />
      ) : (
        <div>
          <div className="flex justify-between p-6">
            <div>
              <Typography
                variant="lead"
                color="blue-gray"
                className="font-bold"
              >
                Transactions List
              </Typography>
              <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
                A list of all your current transactions.
              </Typography>
            </div>

            <AddButton text="+" onClick={handleAddButtonClick} />
          </div>
          <Card className="h-full w-full border border-gray-300 px-6 overflow-hidden">
            {transactions.length > 0 ? (
              <Table TABLE_HEAD={TABLE_HEAD} transactions={transactions} />
            ) : (
              <Typography>No transactions available.</Typography>
            )}
          </Card>
        </div>
      )}
    </section>
  );
};

export default TransactionsPage;
