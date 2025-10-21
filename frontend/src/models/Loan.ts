import { Account } from "./Account";

export interface Loan {
  id: number;
  purpose: string;
  bank_name: string;
  amount: number;
  deposit: number;
  interest_rate: number;
  monthly_payment: number;
  total_interest: number;
  months_paid: number;
  period: number;
  start_date: string;
  account: Account;
}
