import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Account } from "../models/Account";
import { AccountService } from "../services/AccountService";

const LoansPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = localStorage.getItem("userId");

  const fetchLoans = async () => {
    try {
      setLoading(true);
      console.log("userid: ", userId);

      if (userId) {
        const response2 = await AccountService.getAllAccountsForUser(+userId);
        setAccounts(response2.data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  const [formData, setFormData] = useState({
    purpose: "",
    bank_name: "",
    amount: 0,
    deposit: 0,
    interest_rate: 0,
    monthly_payment: 0,
    period: 0,
    start_date: getCurrentDateTime(),
    account: -1,
  });

  return (
    <div className="">
      <div className="p-10 mx-10 pt-[4rem] pb-3">
        <Typography
          variant="lead"
          color="blue-gray"
          className="font-bold text-lg dark-blue-text"
        >
          Loans
        </Typography>
        <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
          Track and manage your bank loans and debt payments
        </Typography>
      </div>

      <div className="mx-20">
        <div
          className="bg-white mr-[2.5rem] rounded-lg p-8"
          style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="pb-7">Enter a new loan</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Loan Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="ex. Mortgage, Car Loan etc."
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Bank / Lender Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                placeholder="ex. NLB etc."
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 pt-5">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Loan Amount (MKD)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Deposit (MKD)
              </label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Interest Rate (%)
              </label>
              <input
                type="number"
                name="interest_rate"
                value={formData.interest_rate}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Monthly Payment (MKD)
              </label>
              <input
                type="number"
                name="monthly_payment"
                value={formData.monthly_payment}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-5">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Period (Months)
              </label>
              <input
                type="number"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-light text-gray-600 mb-1">
                Account
              </label>
              <select
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full h-[2.3rem] p-2 text-sm purple-light text-gray-600 rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              >
                <option value={-1}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-11 main-color font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(81, 103, 233)]; transition"
            >
              Add +
            </button>
          </div>
        </div>
      </div>

      <div className="px-10 mx-10 pt-11 p-3">
        <Typography
          variant="lead"
          color="blue-gray"
          className="font-bold text-lg dark-blue-text"
        >
          Your previous loans
        </Typography>
      </div>

    </div>
  );
};

export default LoansPage;
