import axiosInstance from "../auth/axiosInstance";
import { RecurringTransaction } from "../models/RecurringTransaction";

export const RecurringTransactionService = {
  url: "http://localhost:8080/api/recurring-transactions",

  getAllRecurringTransactionsForUser: async (user: number) => {
      return await axiosInstance.get<RecurringTransaction[]>(`${RecurringTransactionService.url}/${user}`);
  },

  async toggleActiveStatus(id: number, active: boolean): Promise<RecurringTransaction> {
    const response = await axiosInstance.put(
      `${this.url}/${id}/toggle-active?active=${active}`
    );
    return response.data;
  },

  deleteRecurringTransaction: async (id: number) => {
    return await axiosInstance.delete<RecurringTransaction[]>(`${RecurringTransactionService.url}/delete/${id}`);
  },

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