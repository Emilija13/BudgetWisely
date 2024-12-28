import React from "react";
import { Account } from "../models/Account";
import AccountListItem from "./AccountListItem";

const AccountsList: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  return (
    <div style={styles.listContainer}>
      {accounts.map((account) => (
        <AccountListItem key={account.id} account={account} />
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  listContainer: {
    display: "flex",
    flexWrap: "wrap", // Enable flex wrapping
    gap: "16px", 
    padding: "16px",
    overflowX: "hidden", // Adjust this if wrapping is used
    scrollbarWidth: "thin", 
    scrollBehavior: "smooth",
  },
};

export default AccountsList;
