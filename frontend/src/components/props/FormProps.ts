import { Category } from "../../models/Category";
import { Account } from "../../models/Account";
import { TransactionType } from "../../models/enum/TransactionType";

export interface FormProps{
    userId: number;
    name? : string;
    balance? : number;
    cost? : number;
    date? : Date;
    type?: TransactionType;
    categories? : Category[];
    accounts? : Account[];
    onFormSubmitSuccess?: () => void; 
    onClose?: () => void;
}