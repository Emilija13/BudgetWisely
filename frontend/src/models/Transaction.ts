import { Account } from "./Account";
import { Category } from "./Category";
import { TransactionType } from "./enum/TransactionType";

export interface Transaction{
    id : number;
    name : string;
    cost : number;
    date : Date;
    type : TransactionType; 
    category : Category;
    account : Account;
}