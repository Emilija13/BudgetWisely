import { Card, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Transaction } from "../models/Transaction";
import { TransactionService } from "../services/TransactionService";
import Table from "../components/Table";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await TransactionService.getAllTransactions();
        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions:");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const TABLE_HEAD = ["Name", "Cost", "Date"];

  return (
    <section className="w-full bg-white">
      <div className="p-6">
        <Typography variant="lead" color="blue-gray" className="font-bold">
          Transactions List
        </Typography>
        <Typography className="mb-4 w-80 font-normal text-gray-600 md:w-full">
          A list of all your current transactions.
        </Typography>
      </div>
      <Card className="h-full w-full border border-gray-300 px-6 overflow-hidden">
        {transactions.length > 0 ? (
          <Table TABLE_HEAD={TABLE_HEAD} transactions={transactions} />
        ) : (
          <Typography>No transactions available.</Typography>
        )}
      </Card>
    </section>
  );
};

export default TransactionsPage;
