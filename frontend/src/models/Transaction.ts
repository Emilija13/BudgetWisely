import { Category } from "./Category";

export interface Transaction{
    id : number;
    name : string;
    cost : number;
    date : Date;
    category : Category;
}