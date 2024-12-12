import { Budget } from "../../models/Budget";
import { Category } from "../../models/Category";

export interface CategoryListItemProps{
    category? : Category;
    budget? : Budget;
    onAddBudget? : (categoryId: number, spendingLimit: number) => void; 
}