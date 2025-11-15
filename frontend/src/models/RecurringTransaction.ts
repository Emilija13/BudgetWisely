import { RecurrenceFrequency } from "./enum/RecurrenceFrequency";
import { Category } from "./Category";
import { Account } from "./Account";
import { TransactionType } from "./enum/TransactionType";

export interface RecurringTransaction {
  id: number;
  name: string;
  cost: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  lastProcessedDate?: string | null;
  category: Category;
  account: Account;
}