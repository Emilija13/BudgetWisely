import axios from "axios";
import { Account } from "../models/Account";

export const AccountService = {
    url: "http://localhost:8080/api/accounts",

    getAllAccounts: async () => {
        return await axios.get<Account[]>(AccountService.url);
    }

};