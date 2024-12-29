import { Transaction } from "../Transaction";

export interface FilteredTransactionsDto{
    totalAmount: number;
    transactions: Transaction[];
}