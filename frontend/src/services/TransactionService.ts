import { Transaction } from "../models/Transaction";
import axiosInstance from "../auth/axiosInstance";
import { FilterDto } from "../models/dto/FilterDto";

export const TransactionService = {
  url: "http://localhost:8080/api/transactions",

  getAllTransactions: async () => {
    return await axiosInstance.get<Transaction[]>(TransactionService.url);
  },
  getAllTransactionsForUser: async (user: number) => {
    return await axiosInstance.get<Transaction[]>(`${TransactionService.url}/${user}`);
  },
  filter: async (filterDto: FilterDto) => {
    return await axiosInstance.post((TransactionService.url + "/filter"), filterDto);
  },
  addTransaction: async (transactionData: {
    name: string;
    cost: number;
    date: string;
    type: string;
    account: number;
    category: number;
  }) => {
    return await axiosInstance.post((TransactionService.url + "/add"), transactionData);
  },
  editTransaction: async (id: number,transactionData: {
    name: string;
    cost: number;
    date: string;
    type: string;
    account: number;
    category: number;
  }) => {
    return await axiosInstance.put<Transaction[]>(`${TransactionService.url}/edit/${id}`,transactionData);
  },
  deleteTransaction: async (id: number) => {
    return await axiosInstance.delete<Transaction[]>(`${TransactionService.url}/delete/${id}`);
  },

};