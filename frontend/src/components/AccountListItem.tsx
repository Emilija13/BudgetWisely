import React from "react";
import { Account } from "../models/Account";
import { AccountListItemProps } from "./props/AccountListItemProps";

const AccountListItem: React.FC<AccountListItemProps> = ({
  account,
  onEdit,
  onDelete,
}) => {

  const handleDeleteClick = (id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirmed) {
      onDelete(id);
    }
  };
  const handleEditClick = (account: Account) => {
      onEdit(account);
  };

  return (
    <div style={styles.card} className="group">
      <div className="flex justify-between">
        <div className="text-sm font-thin">{account.name}</div>

        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            x-data="{ tooltip: 'Edit' }"
            onClick={() => handleEditClick(account)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
              x-tooltip="tooltip"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </a>
          <a
            x-data="{ tooltip: 'Delete' }"
            href="#"
            onClick={() => handleDeleteClick(account.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
              x-tooltip="tooltip"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex jusitfy-end">
        <div style={styles.button}></div>
      </div>
      <div className="text-2xl font-normal">
        {account.balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}{" "}
        MKD
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#475EE1",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "16px", 
    minWidth: "230px", 
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    width: "3rem",
    height: "2rem",
    backgroundColor: "#6075EC",
    borderRadius: "5px",
  },
  name: {
    fontWeight: "1",
  },
};

export default AccountListItem;
