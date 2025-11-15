import React, { useState } from "react";
import { RecurringTransaction } from "../models/RecurringTransaction";
import { RecurrenceFrequency } from "../models/enum/RecurrenceFrequency";
import { RecurringTransactionService } from "../services/RecurringTransactionService";
import { AlertCircle } from "lucide-react";

interface EditRecurringProps {
  recurring: RecurringTransaction;
  categories: { id: number; name: string }[];
  accounts: { id: number; name: string }[];
  onClose: () => void;
  onSubmitSuccess: () => void; // renamed for clarity
}

const RecurringTransactionEditForm: React.FC<EditRecurringProps> = ({
  recurring,
  categories,
  accounts,
  onClose,
  onSubmitSuccess,
}) => {
  const [name, setName] = useState(recurring.name);
  const [cost, setCost] = useState(recurring.cost);
  const [account, setAccount] = useState(recurring.account.id);
  const [category, setCategory] = useState(recurring.category.id);

  const [frequency, setFrequency] = useState(recurring.frequency);
  const [dayOfWeek, setDayOfWeek] = useState(recurring.dayOfWeek || 1);
  const [dayOfMonth, setDayOfMonth] = useState(recurring.dayOfMonth || 1);
  const [endDate, setEndDate] = useState(recurring.endDate || "");

  const validate = () => {
    if (!name.trim()) return alert("Name is required");
    if (cost <= 0) return alert("Amount must be greater than 0");
    if (account === -1) return alert("Select an account");
    if (category === -1) return alert("Select a category");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updatedRecurring = {
        name,
        cost,
        type: recurring.type,
        frequency: String(frequency),
        dayOfMonth,
        dayOfWeek,
        startDate: recurring.startDate,
        endDate: endDate || null,
        categoryId: category,
        accountId: account,
      };

      await RecurringTransactionService.editRecurringTransaction(
        recurring.id,
        updatedRecurring
      );

      alert("Recurring transaction updated successfully");
      onSubmitSuccess(); // call the parent callback after success
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update recurring transaction");
    }
  };

  return (
    <div className="my-4 w-full">
      <div className="relative px-3 pt-1 pb-3 bg-white rounded-xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-md font-semibold text-gray-600 mb-3">
          Edit Recurring Transaction
        </h3>

        {/* Info Notice */}
        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm px-3 py-2 rounded-xl mb-6">
          <AlertCircle className="h-4 w-4" />
          <p>Changes will apply to future transactions only. Already created transactions remain unchanged.</p>
        </div>

        <form className="space-y-3 px-[1.3rem]" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="pb-2">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="purple-light w-full p-2 text-sm rounded-3xl"
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
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="purple-light w-full p-2 text-sm rounded-3xl"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-light text-gray-600 mb-1">
                Account
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(Number(e.target.value))}
                className="w-full h-[2.3rem] p-2 text-sm purple-light rounded-3xl"
              >
                <option value={-1}>Select an account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="pb-3">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              className="w-full h-[2.3rem] p-2 text-sm purple-light rounded-3xl"
            >
              <option value={-1}>Select a category</option>
              {categories
                .filter((c) => c.name !== "Income")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Frequency */}
          <div className="pb-3">
            <label className="block text-sm font-light text-gray-600 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as RecurrenceFrequency)
              }
              className="purple-light w-full p-2 text-sm rounded-3xl"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          {/* WEEKLY → Day of week */}
          {frequency === RecurrenceFrequency.WEEKLY && (
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

          {/* MONTHLY → Day of month */}
          {frequency === RecurrenceFrequency.MONTHLY && (
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
                className="purple-light w-full p-2 text-sm rounded-3xl"
              />
            </div>
          )}

          {/* End Date */}
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              End Date (optional)
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="purple-light w-full p-2 text-sm rounded-3xl"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-3 main-color font-sm font-light text-white p-2 rounded-xl shadow-md hover:bg-[rgb(81,103,233)] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringTransactionEditForm;
