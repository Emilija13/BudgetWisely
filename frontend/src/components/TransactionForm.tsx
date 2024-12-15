import React, { useState } from "react";
import { FormProps } from "./props/FormProps";
import { TransactionType } from "../models/enum/TransactionType";
import { TransactionService } from "../services/TransactionService";


const TransactionForm: React.FC<FormProps> = ({ categories = [], accounts = [], onFormSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    cost: 0,
    date: "",
    category: "",
    user: 1,
    account: "",
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert('Transaction added successfully');
      onFormSubmitSuccess(); // Close the form after success
    } catch (error) {
      console.error(`Error adding transaction:`, error);
      alert(`Failed to add transaction`);
    }
  };

  return (
    <div className="my-4 w-full">
      <div className="relative px-3 pt-6 pb-4 bg-white rounded-xl">
        {/* Title */}
        <h3 className="text-md font-semibold text-gray-600 mb-10">New Transaction</h3>

        {/* Form Fields */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Amount and Account */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1">Account</label>
              <select
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full p-2 text-sm purple-light text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 text-sm purple-light text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select a type</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
                <option value={TransactionType.INCOME}>Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1">Date</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="purple-light w-full p-2 text-sm text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-600 purple-light rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 bg-[rgb(90,53,245)] font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(80,43,235)] transition"
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
