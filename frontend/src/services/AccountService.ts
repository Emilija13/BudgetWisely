import { Account } from "../models/Account";
import axiosInstance from "../auth/axiosInstance";

export const AccountService = {
    url: "http://localhost:8080/api/accounts",

    getAllAccounts: async () => {
        return await axiosInstance.get<Account[]>(AccountService.url);
    }

};