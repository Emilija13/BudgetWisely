import React from "react";
import { Account } from "../models/Account";
import AccountListItem from "./AccountListItem";
import { AccountListProps } from "./props/AccountListProps";

const AccountsList: React.FC<AccountListProps> = ({ accounts, onDeleteAcc, onEditAcc }) => {
  const handleDelete = async (id: number) => {
   onDeleteAcc(id);
  };
  const handleEdit = (account: Account) => {
    onEditAcc(account);
  };

  return (
    <div className="flex gap-4">
      {accounts.map((account) => (
        <AccountListItem
          key={account.id}
          account={account}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  listContainer: {
    display: "flex",
    flexWrap: "nowrap", // Enable flex wrapping
    gap: "16px",
    padding: "16px",
    overflowX: "auto",
    maxWidth: "100%",
    scrollbarWidth: "thin",
    scrollBehavior: "smooth",
  },
};

export default AccountsList;
