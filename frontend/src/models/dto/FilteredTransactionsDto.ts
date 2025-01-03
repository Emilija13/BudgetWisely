import { Transaction } from "../Transaction";

export interface FilteredTransactionsDto{
    totalAmount: number;
    totalExpense: number;
    totalIncome: number;
    transactions: Transaction[];
}