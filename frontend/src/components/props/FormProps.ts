import { Category } from "../../models/Category";
import { Account } from "../../models/Account";
import { TransactionType } from "../../models/enum/TransactionType";

export interface FormProps{
    name? : string;
    balance? : number;
    cost? : number;
    date? : Date;
    type?: TransactionType;
    categories? : Category[];
    accounts? : Account[];
    pageName? : string;
    onFormSubmitSuccess : () => void; 
}