import { Account } from "../../models/Account";

export interface AccountListItemProps {
  account: Account;
  onDelete: (id: number) => void;
  onEdit: (account: Account) => void;
}
