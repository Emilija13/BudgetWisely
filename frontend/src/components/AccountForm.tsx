import React, { useState } from "react";
import { FormProps } from "./props/FormProps";
import CustomButton from "./CustomButton";
import { AccountService } from "../services/AccountService";

const AccountForm: React.FC<FormProps> = ({ onClose, userId }) => {

  const [formData, setFormData] = useState({
    name: "",
    balance: 0,
    cost: 0,
    date: "",
    category: 0,
    user: userId,
    account: 0,
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
        const newAccount = {
          name: formData.name,
          balance: formData.balance,
          user: userId,
        };
        console.log("account: ", newAccount)
        await AccountService.addAccount(newAccount);
        onClose();
    } catch (error) {
      console.error(`Error adding account:`, error);
      alert(`Failed to add account`);
    }
  };

  return (
    <div className="h-full p-6">
      <form className="" onSubmit={handleSubmit}>
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
        
        <div className="flex justify-end ">
          <CustomButton text="Add" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
