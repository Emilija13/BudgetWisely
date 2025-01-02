import { Budget } from "../models/Budget";
import axiosInstance from "../auth/axiosInstance";
import { BudgetStatsDto } from "../models/dto/BudgetStatsDto";

export const BudgetService = {
  url: "http://localhost:8080/api/budgets",

  getAllBudgets: async () => {
    return await axiosInstance.get<Budget[]>(BudgetService.url);
  },
  getAllBudgetsForUser: async (user: number) => {
    return await axiosInstance.get<Budget[]>(`${BudgetService.url}/${user}`);
  },

  getLastBudgetsForUser: async (user: number) => {
    return await axiosInstance.get<Budget[]>(`${BudgetService.url}/last/${user}`);
  },

  getAllCurrentBudgets: async (user: number) => {
    return await axiosInstance.get<Budget[]>(`${BudgetService.url}/${user}`);
  },

  getCurrentBudgetsStats: async (user: number) => {
    return await axiosInstance.get<BudgetStatsDto>(`${BudgetService.url}/${user}/stats`);
  },

  getLastMonthSaved: async (user: number) => {
    return await axiosInstance.get<number>(`${BudgetService.url}/${user}/saved-last-month`);
  },

  addBudget: async (budgetData: {
    spendingLimit : number;
    leftover : number;
    category : number;
    user : number;
  }) => {
    return await axiosInstance.post(BudgetService.url + "/add", budgetData);
  },

  deleteBudget: async (budgetId: number) => {
    console.log("BudgetId: ", budgetId)
    return await axiosInstance.delete<Budget[]>(`${BudgetService.url}/delete/${budgetId}`);
  },
};
