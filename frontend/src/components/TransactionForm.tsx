import React from "react";
import { FilterProps } from "./props/FilterProps";

const TransactionForm: React.FC<FilterProps> = ({
  categories = [],
  accounts = [],
}) => {
  return (
    <div className="my-4">
      <div className="relative w-96 px-8 pt-6 pb-4 bg-white rounded-xl shadow-lg">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-600 mb-3">
          New Transaction
        </h2>

        {/* Form Fields */}
        <form className="space-y-2">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Amount and Account */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Account
              </label>
              <select className="w-full p-2 text-sm purple-light text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-300">
                {accounts.map((account) => (
                  <option value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <input
                type="number"
                className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="datetime-local"
                className="purple-light w-full p-2 text-sm text-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <div className="relative">
              <select className="w-full p-2 text-sm text-gray-600 purple-light rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {categories.map((category) => (
                  <option value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end ">
          <button
            type="submit"
            className="px-3 bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-300  text-white p-2 rounded-xl shadow-md hover:bg-purple-600 transition"
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
