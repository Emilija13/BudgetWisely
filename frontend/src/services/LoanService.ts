import axiosInstance from "../auth/axiosInstance";
import { Loan } from "../models/Loan";

export const LoanService = {
  url: "http://localhost:8080/api/loans",

  getAllLoans: async () => {
    return await axiosInstance.get<Loan[]>(LoanService.url);
  },

  getAllLoansForUser: async (user: number) => {
    return await axiosInstance.get<Loan[]>(`${LoanService.url}/${user}`);
  },

  addLoan: async (loanData: {
    purpose: string;
    bank_name: string;
    amount: number;
    deposit: number;
    interest_rate: number;
    monthly_payment: number;
    period: number;
    start_date: string;
    account: number;
    user: number;
  }) => {
    return await axiosInstance.post(`${LoanService.url}/add`, loanData);
  },

  editLoan: async (
    id: number,
    loanData: {
      purpose: string;
      bank_name: string;
      amount: number;
      deposit: number;
      interest_rate: number;
      monthly_payment: number;
      period: number;
      start_date: string;
      account: number;
      user: number;
    }
  ) => {
    return await axiosInstance.put(`${LoanService.url}/edit/${id}`, loanData);
  },

  deleteLoan: async (id: number) => {
    return await axiosInstance.delete(`${LoanService.url}/delete/${id}`);
  },
};
