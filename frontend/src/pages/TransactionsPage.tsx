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
import TransactionEditForm from "../components/TransactionEditForm";
import { useNavigate } from "react-router-dom";
import NoAccountsPage from "./NoAccountsPage";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false); // State to toggle form visibility
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const userId = localStorage.getItem("userId");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      console.log("userid: ", userId);
      const response = await CategoryService.getAllCategories();
      setCategories(response.data);
      if (userId) {
        const response1 = await TransactionService.getAllTransactionsForUser(
          +userId
        );
        setTransactions(response1.data);

        const response2 = await AccountService.getAllAccountsForUser(+userId);
        setAccounts(response2.data);
        console.log("Transactions: ", response1.data);
      }
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
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error("Error fetching filtered transactions:", err);
      setError("Failed to apply filters:");
    } finally {
      setLoading(false);
    }
  };

  const handleAddButtonClick = () => {
    setSelectedTransaction(null);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    fetchTransactions();
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormVisible(true);
    console.log("transaction", selectedTransaction);
  };

  const goToAccountsPage = () => {
    navigate("/accounts");
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("id", id);
      const response = await TransactionService.deleteTransaction(id);
      console.log(response);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction:");
    } finally {
      setLoading(false);
      fetchTransactions();
    }
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
          <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            {selectedTransaction ? (
              <TransactionEditForm
                onFormSubmitSuccess={handleCloseForm}
                userId={+userId!}
                categories={categories}
                accounts={accounts}
                transaction={selectedTransaction}
              />
            ) : (
              <TransactionForm
                onFormSubmitSuccess={handleCloseForm}
                userId={+userId!}
                categories={categories}
                accounts={accounts}
              />
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        <div className="p-10 mx-10 pt-[4rem]">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-bold text-lg dark-blue-text"
          >
            Transactions
          </Typography>
        </div>

        {/* Conditional rendering based on accounts length */}
        {accounts.length === 0 ? (
          <NoAccountsPage></NoAccountsPage>
        ) : (
          <div className="flex justify-center">
            <div className="w-[92%] h-210 px-6 py-4 overflow-hidden">
              <div className="flex justify-between">
                <Filter
                  categories={categories}
                  accounts={accounts}
                  userId={+userId!}
                  onFilterChange={handleFilterChange}
                />
                <div className="mb-5 mr-6">
                  <AddButton
                    text="Add +"
                    onClick={handleAddButtonClick} // Trigger form toggle
                  />
                </div>
              </div>
              <TransactionsTable
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionsPage;
