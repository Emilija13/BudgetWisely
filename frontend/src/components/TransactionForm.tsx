import React, { useState } from "react";
import { FormProps } from "./props/FormProps";
import { TransactionType } from "../models/enum/TransactionType";
import { TransactionService } from "../services/TransactionService";

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
        };

        console.log(newTransaction);
        await TransactionService.addTransaction(newTransaction);
        alert("Transaction added successfully");
        onFormSubmitSuccess();
      } catch (error) {
        console.error(`Error adding transaction:`, error);
        alert(`Failed to add transaction`);
      }
    }
  };

  return (
    <div className="my-4 w-full">
      <div className="relative px-3 pt-1 pb-3 bg-white rounded-xl">
        {/* Title */}
        <h3 className="text-md font-semibold text-gray-600 mb-10">
          New Transaction
        </h3>

        {/* Form Fields */}
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

          {/* Amount and Account */}
          <div className="flex flex-wrap gap-5 pb-3">
            <div className="flex-2 mr-4 w-[35%]">
              <label className="block text-sm font-light text-gray-600 mb-1 ">
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

          <div className="pb-3">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Date
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="purple-light w-full h-[2.3rem] p-2 text-sm text-gray-600 rounded-3xl focus:outline-none hover:ring-2 hover:ring-indigo-300 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-3 main-color font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(81, 103, 233)]; transition"
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
