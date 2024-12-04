import React, { useState } from "react";
import { FormProps } from "./props/FormProps";
import CustomButton from "./CustomButton";
import { AccountService } from "../services/AccountService";
import { TransactionService } from "../services/TransactionService";
import { TransactionType } from "../models/enum/TransactionType";

const AddForm: React.FC<FormProps> = ({ pageName, categories, accounts, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    balance: 0,
    cost: 0,
    date: "",
    category: 0,
    user: 1,
    account: 0,
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Changing: ${name}, Value: ${value}`);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pageName === "transaction" && formData.category === 0) {
      alert("Please select a category.");
      return;
    }
    try {
      if (pageName === "account") {
        const newAccount = {
          name: formData.name,
          balance: formData.balance,
          user: 1,
        };
        await AccountService.addAccount(newAccount);
      } else if (pageName === "transaction") {
        const newTransaction = {
          name: formData.name,
          cost: formData.cost,
          date: formData.date,
          category: formData.category,
          account: formData.account,
          type: formData.type,
        };
        await TransactionService.addTransaction(newTransaction);
      }
      onClose();
    } catch (error) {
      console.error(`Error adding ${pageName}:`, error);
      alert(`Failed to add ${pageName}`);
    }
  };

  return (
    <div className="h-full p-6">
      <form className="" onSubmit={handleSubmit}>
        {pageName == "account" ? (
          <div>
            <label className="font-normal text-gray-600">Account name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 my-3 border border-gray-300 rounded-md"
            />
            <label className="font-normal text-gray-600">Balance:</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="w-full p-2 my-3 border border-gray-300 rounded-md"
            />
          </div>
        ) : (
          <div>
            <label className="font-normal text-gray-600">
              Transaction name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 my-3 border border-gray-300 rounded-md"
            />
            <label className="font-normal text-gray-600">Cost:</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full p-2 my-3 border border-gray-300 rounded-md"
            />
            <label className="font-normal text-gray-600">Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 my-3 border border-gray-300 rounded-md font-normal text-gray-600"
            ></input>

            <label className="font-normal text-gray-600">
              Transaction type:
            </label>
            <select
              className="w-full p-2 my-3 border border-gray-300 rounded-md font-normal text-gray-600"
              value={formData.type}
              name="type"
              onChange={handleChange}
            >
              <option value="" >
                Select type of transaction
              </option>
              <option value={TransactionType.INCOME} >
                Income
              </option>
              <option value={TransactionType.EXPENSE} >
                Expense
              </option>
            </select>

            <label className="font-normal text-gray-600">Category:</label>
            <select
              className="w-full p-2 my-3 border border-gray-300 rounded-md font-normal text-gray-600"
              value={formData.category}
              name="category"
              onChange={handleChange}
            >
              <option value="" >
                Select a category
              </option>
              {categories?.map(({ name, id }) => {
                return (
                  <option className="font-normal text-gray-600" value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            
            <label className="font-normal text-gray-600">
              Account:
            </label>
            <select
              className="w-full p-2 my-3 border border-gray-300 rounded-md font-normal text-gray-600"
              value={formData.account}
              name="account"
              onChange={handleChange}
            >
              <option value="" >
                Select an account
              </option>
              {accounts?.map(({ name, id }) => {
                return (
                  <option className="font-normal text-gray-600" value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <div className="flex justify-end ">
          <CustomButton text="Add" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddForm;
