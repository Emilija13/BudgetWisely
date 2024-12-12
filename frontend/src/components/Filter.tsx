import React from "react";
import { FilterProps } from "./props/FilterProps";
import { TransactionType } from "../models/enum/TransactionType";

const Filter: React.FC<FilterProps> = ({ categories = [], accounts = [] }) => {
  return (
    <div className="">
      <div className="relative w-96 pt-6 pb-4 px-8 bg-white rounded-xl shadow-lg">
        <div className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 blur-xl"></div>

        <h2 className="text-lg font-semibold text-gray-600 mb-4">Filters</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Category</label>
            <select className="w-40 p-2 text-sm text-indigo-600 bg-indigo-50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">All</option>
              {categories.map((category) => (
                <option value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Account</label>
            <select className="w-40 p-2 text-sm text-pink-600 bg-pink-50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option value="">All</option>
              {accounts.map((account) => (
                <option value={account.name}>{account.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Type</label>
            <select className="w-40 p-2 text-sm text-purple-600 bg-purple-50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-300">
              <option value="">All</option>
              <option value={TransactionType.INCOME}>Income</option>
              <option value={TransactionType.EXPENSE}>Expense</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
