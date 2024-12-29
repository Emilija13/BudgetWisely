import { Account } from "../../models/Account";

export interface AccountListProps {
  accounts: Account[];
  onDeleteAcc: (id: number) => void;
  onEditAcc: (account: Account) => void;
}
