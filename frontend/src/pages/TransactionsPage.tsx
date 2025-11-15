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
import { RecurringTransaction } from "../models/RecurringTransaction";
import RecurringTransactionEditForm from "../components/RecurringTransactionEditForm";
import { RecurringTransactionService } from "../services/RecurringTransactionService";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../components/Tabs";
import { Repeat } from "lucide-react";
import RecurringTransactionsView from "../components/RecurringTransactionsView";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showRecurring, setShowRecurring] = useState(false);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false); // State to toggle form visibility
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const userId = localStorage.getItem("userId");
  const [selectedRecurring, setSelectedRecurring] = useState<RecurringTransaction | null>(null);
  const [isRecurringFormVisible, setIsRecurringFormVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  const handleEditRecurring = (recurring: RecurringTransaction) => {
    setSelectedRecurring(recurring);
    setIsRecurringFormVisible(true);
  };
  const handleCloseRecurringForm = () => {
    setIsRecurringFormVisible(false);
    setSelectedRecurring(null);
  };


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

  useEffect(() => {
    if (selectedTab === "recurring") {
      fetchRecurringTransactions();
    }
  }, [selectedTab]);

  const fetchRecurringTransactions = async () => {
    if (userId) {
      const response = await RecurringTransactionService.getAllRecurringTransactionsForUser(+userId);
      setRecurringTransactions(response.data);
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

  const handleToggleActive = async (id: number) => {
    setRecurringTransactions((prev) =>
      prev.map((rt) => (rt.id === id ? { ...rt, isActive: !rt.isActive } : rt))
    );
  };

  const handleDeleteRecurring = (id: number) => {
    setRecurringTransactions((prev) => prev.filter((rt) => rt.id !== id));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
  if (showRecurring) {
    fetchRecurringTransactions();
    }
  }, [showRecurring]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="w-full">
      {/* Transaction Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg relative">
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

      {/* Recurring Transaction Edit Form Modal */}
      {isRecurringFormVisible && selectedRecurring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg relative">
            <button
              onClick={handleCloseRecurringForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <RecurringTransactionEditForm
              recurring={selectedRecurring}
              categories={categories}
              accounts={accounts}
              onClose={handleCloseRecurringForm}
              onSubmitSuccess={() => {
                handleCloseRecurringForm();
                fetchRecurringTransactions();
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        

        {/* Conditional rendering based on accounts length */}
        {accounts.length === 0 ? (
          <NoAccountsPage></NoAccountsPage>
        ) : (
          <div className="flex justify-center pt-[4rem]">
            <div className="w-[92%] h-210 px-6 py-1 overflow-hidden">

              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                {/* Tabs header with Add button */}
                <div className="flex items-center mb-6 w-full">
                  <TabsList className="flex gap-2 w-full p-1 rounded-full">
                    <TabsTrigger
                      value="all"
                      className="px-4 py-1 text-sm font-medium text-gray-600 rounded-full hover:bg-white hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 shadow-sm transition-colors"
                    >
                      All Transactions
                    </TabsTrigger>
                    <TabsTrigger
                      value="recurring"
                      className="flex items-center gap-1 px-4 py-1 text-sm font-medium text-gray-600 rounded-full hover:bg-white hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 shadow-sm transition-colors"
                    >
                      <Repeat className="h-4 w-4" />
                      Recurring
                    </TabsTrigger>

                    {/* Push the Add button to the right */}
                    <div className="ml-auto">
                      <AddButton text="Add +" onClick={handleAddButtonClick} />
                    </div>
                  </TabsList>
                </div>


                {/* All Transactions Content */}
                <TabsContent value="all" className="space-y-4">
                  <Filter
                    categories={categories}
                    accounts={accounts}
                    userId={+userId!}
                    onFilterChange={handleFilterChange}
                  />
                  <TransactionsTable
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onEditRecurring={handleEditRecurring}
                  />
                </TabsContent>

                {/* Recurring Transactions Content */}
                <TabsContent value="recurring">
                  <RecurringTransactionsView
                    recurringTransactions={recurringTransactions}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteRecurring}
                    onEdit={handleEditRecurring}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionsPage;
