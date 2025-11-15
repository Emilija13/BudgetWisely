import { Account } from "../../models/Account";
import { Transaction } from "../../models/Transaction";
import { RecurringTransaction } from "../../models/RecurringTransaction";

export interface TableProps {
  TABLE_HEAD? : string[];
  accounts? : Account[];
  transactions? : Transaction[];
  onDelete?: (id: number) => void;
  onEdit?: (transaction: Transaction) => void;
  onEditRecurring?: (recurring: RecurringTransaction) => void;
}
