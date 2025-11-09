import React, { useState } from "react";
import { RecurringTransaction } from "../models/RecurringTransaction";
import { RecurringTransactionService } from "../services/RecurringTransactionService";

interface EditRecurringFormProps {
  recurringTransaction: RecurringTransaction;
  onSave: (updated: RecurringTransaction) => void;
  onStop: () => void;
  onClose: () => void;
}

const RecurringTransactionEditForm: React.FC<EditRecurringFormProps> = ({
  recurringTransaction,
  onSave,
  onStop,
  onClose,
}) => {
  // Local state for editing
  const [formData, setFormData] = useState({
    frequency: recurringTransaction.frequency,
    dayOfMonth: recurringTransaction.dayOfMonth || "",
    dayOfWeek: recurringTransaction.dayOfWeek || "",
    endDate: recurringTransaction.endDate || "",
    amount: recurringTransaction.cost,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Build the payload (remember to use only primitives/IDs for relations)
  const fields = {
    name: recurringTransaction.name,
    cost: Number(formData.amount),
    type: recurringTransaction.type,
    frequency: formData.frequency,
    dayOfMonth: formData.dayOfMonth ? Number(formData.dayOfMonth) : null,
    dayOfWeek: formData.dayOfWeek ? Number(formData.dayOfWeek) : null,
    startDate: recurringTransaction.startDate,
    endDate: recurringTransaction.endDate,
    isActive: recurringTransaction.isActive,
    categoryId: recurringTransaction.category.id,
    accountId: recurringTransaction.account.id
  };

  try {
    await RecurringTransactionService.editRecurringTransaction(recurringTransaction.id, fields);
    alert("Recurring transaction updated successfully");
    onClose(); // to close the modal
    // optionally, refresh transactions in parent using a callback or context
  } catch (err) {
    alert("Failed to update recurring transaction");
    // Optionally, handle error state here
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h3 className="text-md font-semibold text-gray-600 mb-6 text-center">
          Edit Recurring Transaction
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Frequency */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full h-10 p-2 text-sm text-gray-600 purple-light rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          {/* Day of Month */}
          {(formData.frequency === "MONTHLY" || formData.frequency === "YEARLY") && (
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1">
                Day of Month
              </label>
              <input
                type="number"
                min={1}
                max={31}
                name="dayOfMonth"
                value={formData.dayOfMonth}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded-3xl purple-light focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}
          {/* Day of Week */}
          {formData.frequency === "WEEKLY" && (
            <div>
              <label className="block text-sm font-light text-gray-600 mb-1">
                Day of Week (1=Monday)
              </label>
              <input
                type="number"
                min={1}
                max={7}
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded-3xl purple-light focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}
          {/* Amount */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded-3xl purple-light focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {/* End Date */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              End Date (optional)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full h-10 p-2 text-sm rounded-3xl purple-light focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {/* Actions */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onStop}
              className="px-4 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 font-semibold"
            >
              Stop Recurrence
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringTransactionEditForm;
