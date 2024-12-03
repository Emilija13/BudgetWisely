import { Account } from "../../models/Account";
import { Transaction } from "../../models/Transaction";

export interface TableProps {
  TABLE_HEAD : string[];
  accounts? : Account[];
  transactions? : Transaction[];
}
