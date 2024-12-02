import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";

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
        setError("Failed to load accounts.");
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

  return (
    <div className="p-7 m-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>{account.name}: {account.balance}MKD</li>
        ))}
      </ul>
    </div>
  );
};

export default AccountsPage;
