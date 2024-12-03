import { Account } from "./Account";
import { Category } from "./Category";
import { TransactionType } from "./enum/TransactionType";

export interface Transaction{
    id : number;
    name : string;
    cost : number;
    type : TransactionType; 
    date : Date;
    category : Category;
    account : Account;
}