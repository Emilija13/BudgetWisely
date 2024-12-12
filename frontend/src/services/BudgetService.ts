import axios from "axios";
import { Budget } from "../models/Budget";

export const BudgetService = {
  url: "http://localhost:8080/api/budgets",

  getAllBudgets: async () => {
    return await axios.get<Budget[]>(BudgetService.url);
  },
  addBudget: async (budgetData: {
    spendingLimit : number;
    leftover : number;
    category : number;
    user : number;
  }) => {
    return await axios.post(BudgetService.url + "/add", budgetData);
  },
};
