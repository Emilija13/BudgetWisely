import React from "react";
import { TableProps } from "./props/TableProps";
import { TransactionType } from "../models/enum/TransactionType";
import { Transaction } from "../models/Transaction";

const TransactionsTable: React.FC<TableProps> = ({ transactions = [], onDelete,onEdit }) => {
   
    const handleDeleteClick = (id : number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (isConfirmed) {
          onDelete(id); 
        }
    }
    const handleEditClick = (transaction: Transaction) => {
        // Pass the transaction object to the parent or directly open the form with the transaction details
        onEdit(transaction);
    }

  return (
    <div className="overflow-hidden rounded-lg shadow-lg">
      {/* Wrapper with a fixed height for the scrollable container */}
      <div className="max-h-[500px] overflow-auto ">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="w-[25%] px-6 py-4 font-medium text-gray-600">
                Name and account
              </th>
              <th scope="col" className="w-[25%] px-6 py-4 font-medium text-gray-600">
                Category
              </th>
              <th scope="col" className="w-[24%] px-6 py-4 font-medium text-gray-600">
                Date
              </th>
              <th scope="col" className="w-[24%] px-6 py-4 font-medium text-gray-600">
                Amount
              </th>
              <th scope="col" className="w-[1%] px-6 py-4 font-medium text-gray-600">
                Type
              </th>
              <th scope="col" className="w-[1%] px-6 py-4 font-medium text-gray-900"></th>
            </tr>
          </thead>
          {/* Table body with overflow auto for scrolling */}
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {transactions.map((transaction, index) => {
              return (
                <tr key={index} className="group hover:bg-gray-50 h-[60px]">
                  <th className="flex gap-3 px-6 py-3 font-normal text-gray-900">
                    <div className="relative h-10 w-10">
                      <img
                        className="h-full w-full rounded-full object-cover object-center"
                        src={transaction.category.image}
                        alt=""
                      />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">{transaction.name}</div>
                      <div className="text-gray-400">{transaction.account.name}</div>
                    </div>
                  </th>

                  {/* Ensure the Category column is properly aligned */}
                  <td className="px-6 py-4 text-left">
                    <div className="text-sm font-light text-gray-400">{transaction.category.name}</div>
                  </td>

                  <td className="px-6 py-4 text-left">{new Date(transaction.date).toLocaleDateString()}</td>
                  {transaction.type === TransactionType.EXPENSE ? (
                    <td className="px-6 py-4 text-red-600">-{transaction.cost}.00 MKD</td>
                  ) : (
                    <td className="px-6 py-4 text-green-600">{transaction.cost}.00 MKD</td>
                  )}

                  <td className="px-6 py-4">
                    {transaction.type === TransactionType.EXPENSE ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                        Expense
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        Income
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <a x-data="{ tooltip: 'Edit' }"  onClick={() => handleEditClick(transaction)}>
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
                      <a x-data="{ tooltip: 'Delete' }" href="#" onClick={() => handleDeleteClick(transaction.id)}>
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
                  </td>
                </tr>

              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
