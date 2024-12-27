import { useState, useEffect, useCallback } from "react";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { Typography } from "@material-tailwind/react";
import AddButton from "../components/AddButton";
import AccountsList from "../components/AccountsList";
import AccountForm from "../components/AccountForm";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const userId = localStorage.getItem("userId");


  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
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
  },[userId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAddButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    fetchAccounts();
    setIsFormVisible(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className=" mx-10">
      {isFormVisible ? (
        <AccountForm onClose={handleCloseForm} userId={+userId!} onFormSubmitSuccess={handleCloseForm}/>
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
          <AccountsList accounts={accounts}></AccountsList>
        </div>
      )}
    </section>
  );
};

export default AccountsPage;
