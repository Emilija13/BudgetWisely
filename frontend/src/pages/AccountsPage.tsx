import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { Card, Typography } from "@material-tailwind/react";
import Table from "../components/Table";
import AddButton from "../components/AddButton";
import AddForm from "../components/AddForm";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      console.log("userid: ", userId)
      if(userId)
      {  const response = await AccountService.getAllAccountsForUser(+userId);
        setAccounts(response.data);
        console.log("Acc: ",response.data)
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    fetchAccounts();
    setIsFormVisible(false);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  const TABLE_HEAD = ["Name", "Balance"];

  return (
    <section className="w-full bg-white">
      {isFormVisible ? (
        <AddForm pageName="account" onClose={handleCloseForm} />
      ) : (
        <div>
          <div className="flex justify-between p-6">
            <div>
              <Typography
                variant="lead"
                color="blue-gray"
                className="font-bold"
              >
                Accounts List
              </Typography>
              <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
                A list of all your current accounts.
              </Typography>
            </div>

            <AddButton text="+" onClick={handleAddButtonClick} />
          </div>
          <Card className="h-full w-full border border-gray-300 px-6 overflow-hidden">
            {accounts.length > 0 ? (
              <Table TABLE_HEAD={TABLE_HEAD} accounts={accounts} />
            ) : (
              <Typography>No accounts available.</Typography>
            )}
          </Card>
        </div>
      )}
    </section>
  );
};

export default AccountsPage;
