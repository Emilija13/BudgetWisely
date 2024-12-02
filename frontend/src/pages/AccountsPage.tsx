import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { Card, Typography } from "@material-tailwind/react";

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

  const TABLE_HEAD = ["Name", "Balance"];

  return (
    <section className="w-full bg-white">
      <div className="p-6">
        <Typography variant="lead" color="blue-gray" className="font-bold">
          Accounts List
        </Typography>
        <Typography className="mb-4 w-80 font-normal text-gray-600 md:w-full">
          A list of all you current accounts.
        </Typography>
      </div>
      <Card className="h-full w-full border border-gray-300 px-6 overflow-hidden">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map(({ name, balance }, index) => {
              const isLast = index === accounts.length - 1;
              const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";

              return (
                <tr key={name} className="hover:bg-gray-50">
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {balance} MKD
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
};

export default AccountsPage;
