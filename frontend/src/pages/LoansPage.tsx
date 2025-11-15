import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Account } from "../models/Account";
import { AccountService } from "../services/AccountService";
import { LoanService } from "../services/LoanService";
import LoanList from "../components/LoanList";
import { Loan } from "../models/Loan";

const LoansPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan>();
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const userId = localStorage.getItem("userId");

  const fetchLoans = async () => {
    try {
      setLoading(true);
      console.log("userid: ", userId);

      if (userId) {
        const response = await AccountService.getAllAccountsForUser(+userId);
        setAccounts(response.data);
        const response1 = await LoanService.getAllLoansForUser(+userId);
        setLoans(response1.data);
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.purpose.trim())
      newErrors.purpose = "Loan purpose is required";
    if (!formData.bank_name.trim())
      newErrors.bank_name = "Bank name is required";

    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Invalid amount entered";

    if (Number(formData.deposit) < 0)
      newErrors.deposit = "Deposit cannot be negative";

    if (Number(formData.deposit) > Number(formData.amount))
      newErrors.deposit = "Deposit cannot be greater then the amount";

    if (!formData.interest_rate || Number(formData.interest_rate) < 0)
      newErrors.interest_rate =
        "Interest rate is required and must be positive";

    if (!formData.monthly_payment || Number(formData.monthly_payment) <= 0)
      newErrors.monthly_payment = "Monthly payment must be greater than 0";

    if (Number(formData.monthly_payment) > Number(formData.amount))
      newErrors.monthly_payment =
        "Monthly payment cannot be greater than the amount";

    if (!formData.period || Number(formData.period) < 1)
      newErrors.period = "Minimum period is 1 month";

    if (!formData.start_date) newErrors.start_date = "Start date is required";

    if (formData.account === -1) newErrors.account = "Please select an account";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      if (!userId) {
        alert("User not found!");
        return;
      }

      const loanData = {
        purpose: formData.purpose,
        bank_name: formData.bank_name,
        amount: formData.amount,
        deposit: formData.deposit,
        interest_rate: formData.interest_rate,
        monthly_payment: formData.monthly_payment,
        period: formData.period,
        start_date: formData.start_date,
        account: formData.account,
        user: +userId,
      };

      console.log("Sending loan:", loanData);

      const response = await LoanService.addLoan(loanData);

      if (response.status === 200 || response.status === 201) {
        alert("Loan successfully added!");
        setFormData({
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
        await fetchLoans();
      }
    } catch (err) {
      const error = err as any;
      console.error("Error adding loan:", error.response.data.message);
      alert("Failed to add loan" + "\n" + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await LoanService.deleteLoan(id);
      console.log(response);
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setLoading(false);
      fetchLoans();
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setFormData({
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
    fetchLoans();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      if (!userId) {
        alert("User not found!");
        return;
      }

      const loanEdit = {
        purpose: formData.purpose,
        bank_name: formData.bank_name,
        amount: formData.amount,
        deposit: formData.deposit,
        interest_rate: formData.interest_rate,
        monthly_payment: formData.monthly_payment,
        period: formData.period,
        start_date: formData.start_date,
        account: formData.account,
        user: +userId,
      };

      const response = await LoanService.editLoan(selectedLoan!.id, loanEdit);

      if (response.status === 200) {
        alert("Loan edited successfully");
        handleCloseForm();
      }

    } catch (err) {
      const error = err as any;
      alert("Failed to add loan" + "\n" + error.response.data.message);
    }
  };

  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan);
    setFormData({
      purpose: loan.purpose,
      bank_name: loan.bank_name,
      amount: loan.amount,
      deposit: loan.deposit,
      interest_rate: loan.interest_rate,
      monthly_payment: loan.monthly_payment,
      period: loan.period,
      start_date: loan.start_date,
      account: loan.account.id,
    });
    setIsFormVisible(true);
    console.log("loan", selectedLoan);
  };

  return (
    <div className="py-[4rem]">
      {/* Transaction Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white  p-6 rounded-lg relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            <div className="pb-7">Edit - {formData?.purpose}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1 ">
                  Loan Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData?.purpose}
                  onChange={handleChange}
                  placeholder="ex. Mortgage, Car Loan etc."
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.purpose && (
                  <p className="text-sm text-red-500">{errors.purpose}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1 ">
                  Bank / Lender Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData?.bank_name}
                  onChange={handleChange}
                  placeholder="ex. NLB etc."
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.bank_name && (
                  <p className="text-sm text-red-500">{errors.bank_name}</p>
                )}
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
                  value={formData?.amount}
                  onChange={handleChange}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1 ">
                  Deposit (MKD)
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData?.deposit}
                  onChange={handleChange}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.deposit && (
                  <p className="text-sm text-red-500">{errors.deposit}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1 ">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  value={formData?.interest_rate}
                  onChange={handleChange}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.interest_rate && (
                  <p className="text-sm text-red-500">{errors.interest_rate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1 ">
                  Monthly Payment (MKD)
                </label>
                <input
                  type="number"
                  name="monthly_payment"
                  value={formData?.monthly_payment}
                  onChange={handleChange}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.monthly_payment && (
                  <p className="text-sm text-red-500">
                    {errors.monthly_payment}
                  </p>
                )}
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
                  value={formData?.period}
                  onChange={handleChange}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.period && (
                  <p className="text-sm text-red-500">{errors.period}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1 ">
                  Date of first payment
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData?.start_date}
                  onChange={handleChange}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">{errors.start_date}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-light text-gray-600 mb-1">
                  Account
                </label>
                <select
                  name="account"
                  value={formData?.account}
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
                {errors.account && (
                  <p className="text-sm text-red-500">{errors.account}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                onClick={handleUpdate}
                className="px-11 main-color font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(81, 103, 233)]; transition"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-20 pb-3">
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
          className="bg-white rounded-lg p-8"
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
              {errors.purpose && (
                <p className="text-sm text-red-500">{errors.purpose}</p>
              )}
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
              {errors.bank_name && (
                <p className="text-sm text-red-500">{errors.bank_name}</p>
              )}
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
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
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
              {errors.deposit && (
                <p className="text-sm text-red-500">{errors.deposit}</p>
              )}
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
              {errors.interest_rate && (
                <p className="text-sm text-red-500">{errors.interest_rate}</p>
              )}
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
              {errors.monthly_payment && (
                <p className="text-sm text-red-500">{errors.monthly_payment}</p>
              )}
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
              {errors.period && (
                <p className="text-sm text-red-500">{errors.period}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1 ">
                Date of first payment
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">{errors.start_date}</p>
              )}
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
              {errors.account && (
                <p className="text-sm text-red-500">{errors.account}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-11 main-color font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(81, 103, 233)]; transition"
            >
              + Add
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
      <div className="mx-20">
        <LoanList loans={loans} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default LoansPage;
