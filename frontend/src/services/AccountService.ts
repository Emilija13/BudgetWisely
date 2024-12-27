import { Account } from "../models/Account";
import axiosInstance from "../auth/axiosInstance";
import { FilterDto } from "../models/dto/FilterDto";

export const AccountService = {
  url: "http://localhost:8080/api/accounts",

  getAllAccounts: async () => {
    return await axiosInstance.get<Account[]>(AccountService.url);
  },
  getAllAccountsForUser: async (user: number) => {
    return await axiosInstance.get<Account[]>(`${AccountService.url}/${user}`);
  },
  getBalanceHistory: async (filterDto: FilterDto) => {
    return await axiosInstance.post((AccountService.url + "/balance-history"), filterDto);
  },
  addAccount: async (accountData: { name: string; balance: number; user: number; }) => {
    return await axiosInstance.post(AccountService.url+"/add", accountData);
  },
};