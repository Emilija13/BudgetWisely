import { useState, useEffect, useCallback } from "react";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { Typography } from "@material-tailwind/react";
import AddButton from "../components/AddButton";
import AccountsList from "../components/AccountsList";
import AccountForm from "../components/AccountForm";
import { FilterDto } from "../models/dto/FilterDto";
import LineChartAccountBalance from "../components/charts/LineChartAccounts";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<string>("Last 7 days");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [showBarChart, setShowBarChart] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    undefined
  );
  const userId = localStorage.getItem("userId");

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      if (userId) {
        const response = await AccountService.getAllAccountsForUser(+userId);
        setAccounts(response.data);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAddButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleDeleteAcc = async (id: number) => {
    try {
      console.log("id", id);
      const response = await AccountService.deleteAccount(id);
      console.log(response);
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      fetchAccounts();
    }
  };

  const handleEditAcc = (account: Account) => {
    setSelectedAccount(account);

    setIsFormVisible(true);
    console.log("acc", selectedAccount);
  };

  const calculateDateRange = (range: string) => {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case "Today":
        break; // No adjustment, today is the default
      case "Yesterday":
        start.setDate(now.getDate() - 1);
        now.setDate(now.getDate() - 1);
        break;
      case "Last 7 days":
        start.setDate(now.getDate() - 7);
        break;
      case "Last 30 days":
        start.setDate(now.getDate() - 30);
        break;
      case "Last 90 days":
        start.setDate(now.getDate() - 90);
        break;
      case "Last 6 months":
        start.setMonth(now.getMonth() - 6);
        break;
      case "Last Year":
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }

    return {
      start: start.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    };
  };

  const { start, end } = calculateDateRange(selectedTimeRange);

  const filterDto: FilterDto = {
    userId: +userId!,
    accountId: selectedAccountId,
    categoryId: null,
    type: null,
    start,
    end,
  };

  const handleCloseForm = () => {
    fetchAccounts();
    setIsFormVisible(false);
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAccountId(value === "null" ? null : +value);
  };

  const handleTimeRangeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTimeRange(event.target.value);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="p-10 mx-10 w-[95%] pt-[4rem]">
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <AccountForm
              onClose={handleCloseForm}
              userId={+userId!}
              onFormSubmitSuccess={handleCloseForm}
              account={selectedAccount}
            />
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between">
          <div>
            <Typography
              variant="lead"
              color="blue-gray"
              className="font-bold text-lg dark-blue-text"
            >
              Accounts List
            </Typography>

            <div className="flex justify-between w-full">
              <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
                A list of all your current accounts.
              </Typography>
            </div>
          </div>
          <div className="mr-[3rem]">
            <AddButton text="Add +" onClick={handleAddButtonClick} />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="overflow-auto w-[70rem] pb-5">
            <AccountsList
              accounts={accounts}
              onDeleteAcc={handleDeleteAcc}
              onEditAcc={handleEditAcc}
            />
          </div>
        </div>


        <div
          className=" mt-[2.5rem] mb-[3rem] pt-[2rem] pb-[0.5rem] px-[4rem] bg-white rounded-lg"
          style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex justify-between mb-[2rem]">
            <div>
              <Typography
                variant="lead"
                color="blue-gray"
                className="font-bold text-lg dark-blue-text"
              >
                Balance history
              </Typography>
              <Typography className="w-80 font-normal text-gray-600 pt-2 md:w-full">
                A visual journey through your accounts—spot the peaks, plateaus,
                and progress!
              </Typography>
            </div>
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
              <div className="flex p-8">
                <div className="w-[80%]">
                  <LineChartAccountBalance filterDto={filterDto} />
                </div>

                <div className=" mt-[6rem]">
                  <select
                    className="cursor-pointer arial mb-2 w-[150px] text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-0 focus:border-transparent border-none"
                    onChange={handleAccountChange}
                    value={selectedAccountId ?? "null"}
                  >
                    <option value="null">All Accounts</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  <br></br>

                  <select
                    className="cursor-pointer arial w-[150px] text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-0 focus:border-transparent border-none"
                    onChange={handleTimeRangeChange}
                    value={selectedTimeRange}
                  >
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 90 days">Last 90 days</option>
                    <option value="Last 6 months">Last 6 months</option>
                    <option value="Last Year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountsPage;
