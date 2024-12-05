import { Transaction } from "../models/Transaction";
import axiosInstance from "../auth/axiosInstance";

export const TransactionService = {
  url: "http://localhost:8080/api/transactions",

  getAllTransactions: async () => {
    return await axiosInstance.get<Transaction[]>(TransactionService.url);
  },
  getAllTransactionsForUser: async (user: number) => {
    return await axiosInstance.get<Transaction[]>(`${TransactionService.url}/${user}`);
  },
  addTransaction: async (transactionData: {
    name: string;
    cost: number;
    date: string;
    category: number;
  }) => {
    return await axiosInstance.post((TransactionService.url + "/add"), transactionData);
  },
};