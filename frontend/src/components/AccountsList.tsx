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
    gap: "16px", // Spacing between cards
    padding: "16px",
    overflowX: "auto", // Horizontal scrolling for overflow
    scrollbarWidth: "thin", // For modern browsers (optional)
    scrollBehavior: "smooth", // Smooth scrolling (optional)
  },
};

export default AccountsList;
