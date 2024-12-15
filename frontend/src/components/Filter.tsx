import React, { useState, useEffect } from "react";
import { FilterProps } from "./props/FilterProps";
import { TransactionType } from "../models/enum/TransactionType";
import { FilterDto } from "../models/dto/FilterDto";
import { format } from 'date-fns';

const Filter: React.FC<FilterProps> = ({ categories = [], accounts = [], onFilterChange }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date>(today);

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const handleFilterChange = () => {
    if (onFilterChange) {
      const filter: FilterDto = {
        userId: 1, 
        accountId: selectedAccount,
        categoryId: selectedCategory,
        type: selectedType,
        start: formatDate(startDate), 
        end: formatDate(endDate),
      };
      console.log("filter", filter);
      onFilterChange(filter);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, selectedAccount, selectedType, startDate, endDate]);

  return (
    <div className="mb-1 ml-4">
      <div className="flex justify-between">
        <div className="flex">

          {/* Category Filter */}
          <div className="flex justify-between items-center mr-3">
            <select
            
              className="w-[8rem] p-[6px] text-sm font-light rounded-md main-color text-white"
              value={selectedCategory || ""}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                setSelectedCategory(value || null);
              }}
            >
              <option className="bg-white text-black" value="" >All categories</option>
              {categories.map((category) => (
                <option className="bg-white text-black" key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
          </div>

          {/* Account Filter */}
          <div className="flex justify-between items-center mr-3">
            <select
              className="w-[8rem] p-[6px] text-sm font-light rounded-md main-color text-white"
              value={selectedAccount || ""}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                setSelectedAccount(value || null);
              }}
            >
              <option className="bg-white text-black" value="">All accounts</option>
              {accounts.map((account) => (
                <option className="bg-white text-black" key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type Filter */}
          <div className="flex justify-between items-center">
            <select
              className="w-[8rem] p-[6px] text-sm font-light rounded-md main-color text-white"
              value={selectedType || ""}
              onChange={(e) => {
                setSelectedType(e.target.value || null);
              }}
            >
              <option className="bg-white text-black" value="">All types</option>
              <option className="bg-white text-black" value={TransactionType.INCOME}>Income</option>
              <option className="bg-white text-black" value={TransactionType.EXPENSE}>Expense</option>
            </select>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex ml-[7rem]">
          <div className="flex justify-between items-center mr-3">
            <input
              type="date"
              value={formatDate(startDate)}
              onChange={(e) => {
                setStartDate(new Date(e.target.value));
              }}
              className="bg-white w-full p-1 px-3 text-sm text-gray-600 rounded-md border"
            />
          </div>
          <div className="flex justify-between items-center">
            <input
              type="date"
              value={formatDate(endDate)}
              onChange={(e) => {
                setEndDate(new Date(e.target.value));
              }}
              className="bg-white w-full p-1 px-3 text-sm text-gray-600 rounded-md border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
