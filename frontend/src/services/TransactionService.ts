import axios from "axios";
import { Transaction } from "../models/Transaction";

export const TransactionService = {
  url: "http://localhost:8080/api/transactions",

  getAllTransactions: async () => {
    return await axios.get<Transaction[]>(TransactionService.url);
  },
  addTransaction: async (transactionData: {
    name: string;
    cost: number;
    date: string;
    category: number;
  }) => {
    return await axios.post((TransactionService.url + "/add"), transactionData);
  },
};
