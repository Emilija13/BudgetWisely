import { Category } from "../../models/Category";

export interface FormProps{
    name? : string;
    balance? : number;
    cost? : number;
    date? : Date;
    categories? : Category[];
    pageName? : string;
    onClose : () => void; 
}