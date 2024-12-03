import { Category } from "../../models/Category";
import { Account } from "../../models/Account";

export interface FormProps{
    name? : string;
    balance? : number;
    cost? : number;
    date? : Date;
    categories? : Category[];
    accounts? : Account[];
    pageName? : string;
    onClose : () => void; 
}