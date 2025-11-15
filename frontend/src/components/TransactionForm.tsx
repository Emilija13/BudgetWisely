import React, { useState } from "react";
import { FormProps } from "./props/FormProps";
import { TransactionType } from "../models/enum/TransactionType";
import { TransactionService } from "../services/TransactionService";
import { RecurringTransactionService } from "../services/RecurringTransactionService";

const TransactionForm: React.FC<FormProps> = ({
  categories = [],
  accounts = [],
  userId,
  onFormSubmitSuccess,
}) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    cost: 0,
    date: getCurrentDateTime(),
    category: -1,
    user: userId,
    account: -1,
    type: TransactionType.EXPENSE,
  });

  // Recurring transaction state
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("MONTHLY");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [startDate, setStartDate] = useState(getCurrentDateTime().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "type") {
        updatedData.category = value === TransactionType.INCOME ? 17 : -1;
      }
      return updatedData;
    });
  };

  const validate = (): boolean => {
    if (formData.name === "") {
      alert("Set a name.");
      return false;
    }
    if (formData.cost <= 0) {
      alert("Amount must be greater than 0.");
      return false;
    }
    if (formData.account == -1) {
      alert("Select an account.");
      return false;
    }
    if (formData.date === "") {
      alert("Select a date.");
      return false;
    }
    if (formData.category == -1) {
      alert("Select a category.");
      return false;
    }

    if (isRecurring && !startDate) {
      alert("Select a start date for recurring transaction.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (validate()) {
    try {
      const newTransaction = {
        name: formData.name,
        cost: formData.cost,
        date: formData.date,
        category: formData.category,
        account: formData.account,
        type: formData.type,
        isRecurring, // 👈 backend will handle recurring creation
        frequency: isRecurring ? frequency : null,
        dayOfWeek: isRecurring ? dayOfWeek : null,
        dayOfMonth: isRecurring ? dayOfMonth : null,
        startDate: isRecurring ? startDate : null,
        endDate: isRecurring ? endDate || null : null,
      };

      await TransactionService.addTransaction(newTransaction);

      alert(
        isRecurring
          ? "Recurring transaction added successfully"
          : "Transaction added successfully"
      );

      onFormSubmitSuccess();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction");
    }
  }
};


  return (
    <div className="my-4 w-full">
      <div className="relative px-3 pt-1 pb-3 bg-white rounded-xl max-h-[80vh] overflow-y-auto">

        {/* Title */}
        <h3 className="text-md font-semibold text-gray-600 mb-10">
          New Transaction
        </h3>

        {/* Form */}
        <form className="space-y-3 px-[1.3rem]" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="pb-2">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Amount + Account */}
          <div className="flex flex-wrap gap-5 pb-3">
            <div className="flex-2 mr-4 w-[35%]">
              <label className="block text-sm font-light text-gray-600 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
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

          {/* Type */}
          <div className="flex flex-wrap gap-4 pb-3">
            <div className="flex items-center space-x-4">
              <label className="block text-sm font-light text-gray-600 mb-1 mr-[3.5rem]">
                Type:
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 pr-4">
                  <input
                    type="radio"
                    name="type"
                    value={TransactionType.EXPENSE}
                    checked={formData.type === TransactionType.EXPENSE}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-400 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Expense</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value={TransactionType.INCOME}
                    checked={formData.type === TransactionType.INCOME}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-400 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Income</span>
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="pb-3">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Category
            </label>
            {formData.type === TransactionType.INCOME ? (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled
                className="w-full h-[2.3rem] p-2 text-sm text-gray-400 purple-light rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value={TransactionType.INCOME}>Income</option>
              </select>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-[2.3rem] p-2 text-sm text-gray-600 purple-light rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              >
                <option value={-1}>Select a category</option>
                {categories
                  .filter((category) => category.name !== "Income")
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Date */}
          <div className="pb-3">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Date
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isRecurring}
              className={`purple-light w-full h-[2.3rem] p-2 text-sm text-gray-600 rounded-3xl focus:outline-none ${
                isRecurring ? "bg-gray-100 cursor-not-allowed" : "hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
              }`}
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <label
              htmlFor="recurring"
              className="text-sm font-light text-gray-600 cursor-pointer"
            >
              Make Recurring
            </label>
            <input
              id="recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-5 w-5 text-indigo-500 focus:ring-indigo-400 rounded"
            />
          </div>

          {/* Recurring Options */}
          {isRecurring && (
            <div className="space-y-4 border rounded-xl p-4 bg-gray-50 mt-3">
              {/* Frequency */}
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              {/* Day selection depending on frequency */}
              {frequency === "WEEKLY" && (
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-2">
                    Day of Week
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setDayOfWeek(index + 1)}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            dayOfWeek === index + 1
                              ? "bg-indigo-500 text-white"
                              : "bg-white text-gray-600 hover:bg-indigo-100"
                          }`}
                        >
                          {day}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {frequency === "MONTHLY" && (
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-1">
                    Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(Number(e.target.value))}
                    className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              )}

              {/* Start & End Date */}
              <div>
                <label className="block text-sm font-light text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-600 mb-1">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <p className="text-xs text-gray-500">
                Transactions will automatically repeat according to this
                schedule.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-3 main-color font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(81,103,233)] transition"
            >
              Add +
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
