import axiosInstance from "../auth/axiosInstance";
import { RecurringTransaction } from "../models/RecurringTransaction";

export const RecurringTransactionService = {
  url: "http://localhost:8080/api/recurring-transactions",

  editRecurringTransaction: async (
    id: number,
    transactionData: {
      name: string;
      cost: number;
      type: string;
      frequency: string;
      dayOfMonth?: number | null;
      dayOfWeek?: number | null;
      startDate: string;
      endDate?: string | null;
      isActive?: boolean;
      categoryId: number;
      accountId: number;
    }
  ) => {
    return await axiosInstance.put<RecurringTransaction>(
      `${RecurringTransactionService.url}/edit/${id}`,
      transactionData
    );
  }
};