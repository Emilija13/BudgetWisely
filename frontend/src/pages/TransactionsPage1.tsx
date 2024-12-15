import { Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Transaction } from "../models/Transaction";
import { TransactionService } from "../services/TransactionService";
import TransactionsTable from "../components/TransactionsTable";
import AddButton from "../components/AddButton";
import { Category } from "../models/Category";
import { CategoryService } from "../services/CategoryService";
import { Account } from "../models/Account";
import { AccountService } from "../services/AccountService";
import TransactionForm from "../components/TransactionForm";
import Filter from "../components/Filter";
import { FilterDto } from "../models/dto/FilterDto";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false); // State to toggle form visibility

  const fetchTransactions = async () => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        const userId: number = JSON.parse(user).id;
        const response = await TransactionService.getAllTransactionsForUser(userId);
        setTransactions(response.data);

        const accountResponse = await AccountService.getAllAccountsForUser(userId);
        setAccounts(accountResponse.data);
      } else {
        const response = await TransactionService.getAllTransactions();
        setTransactions(response.data);

        const accountResponse = await AccountService.getAllAccounts();
        setAccounts(accountResponse.data);
      }

      const categoryResponse = await CategoryService.getAllCategories();
      setCategories(categoryResponse.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions:");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: FilterDto) => {
    try {
      setLoading(true);
      const response = await TransactionService.filter(newFilters);
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching filtered transactions:", err);
      setError("Failed to apply filters:");
    } finally {
      setLoading(false);
    }
  };

  const handleAddButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="w-full">
      {/* Transaction Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <TransactionForm onFormSubmitSuccess={handleCloseForm} categories={categories} accounts={accounts} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        <div className="p-10">
          <Typography variant="lead" color="blue-gray" className="font-bold text-lg">
            Transactions
          </Typography>
        </div>
        <div className="flex justify-center">
          <div className="w-[92%] h-210 px-6 py-4 overflow-hidden">
            <div className="flex justify-between">
              <Filter
                categories={categories}
                accounts={accounts}
                onFilterChange={handleFilterChange}
              />
              <div className="mb-5 mr-6">
                <AddButton
                  text="Add +"
                  onClick={handleAddButtonClick} // Trigger form toggle
                />
              </div>
            </div>
            <TransactionsTable transactions={transactions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionsPage;
