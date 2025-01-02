import React, { useState } from "react";
import { FormProps } from "./props/FormProps";
import { AccountService } from "../services/AccountService";

const AccountForm: React.FC<FormProps> = ({
  onFormSubmitSuccess,
  userId,
  account,
}) => {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    balance: account?.balance || 0,
    user: userId,
  });
  console.log(formData, account);
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
      const newAccount = {
        name: formData.name,
        balance: formData.balance,
        user: userId,
      };
      console.log("account: ", newAccount);
      if (account) {
        await AccountService.editAccount(account.id, newAccount);
      } else {
        await AccountService.addAccount(newAccount);
      }
      onFormSubmitSuccess();
    } catch (error) {
      console.error(`Error adding account:`, error);
      alert(`Failed to add account`);
    }
  };

  return (
    <div className="my-4 w-full">
      <div className="relative px-3 pt-6 pb-4 bg-white rounded-xl">
        <h3 className="text-md font-semibold text-gray-600 mb-10">
          Account Form
        </h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              Account name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              Balance
            </label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="purple-light w-full p-2 text-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 main-color font-sm font-light text-white p-2 rounded-xl shadow-md transition"
            >
              Add +
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
