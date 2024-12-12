import { Category } from "./Category";

export interface Budget{
    id : number;
    spendingLimit : number;
    leftover : number;
    category : Category;
}