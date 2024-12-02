import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { Card, Typography } from "@material-tailwind/react";
import Table from "../components/Table";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await AccountService.getAllAccounts();
        setAccounts(response.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load accounts:");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const TABLE_HEAD = ["Name", "Balance"];

  return (
    <section className="w-full bg-white">
      <div className="p-6">
        <Typography variant="lead" color="blue-gray" className="font-bold">
          Accounts List
        </Typography>
        <Typography className="mb-4 w-80 font-normal text-gray-600 md:w-full">
          A list of all your current accounts.
        </Typography>
      </div>
      <Card className="h-full w-full border border-gray-300 px-6 overflow-hidden">
        {accounts.length > 0 ? (
          <Table TABLE_HEAD={TABLE_HEAD} accounts={accounts} />
        ) : (
          <Typography>No accounts available.</Typography>
        )}
      </Card>
    </section>
  );
};

export default AccountsPage;
