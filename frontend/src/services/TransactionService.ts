import { Transaction } from "../models/Transaction";
import axiosInstance from "../auth/axiosInstance";

export const TransactionService = {
    url: "http://localhost:8080/api/transactions",

    getAllTransactions: async () => {
        return await axiosInstance.get<Transaction[]>(TransactionService.url);
    }
};