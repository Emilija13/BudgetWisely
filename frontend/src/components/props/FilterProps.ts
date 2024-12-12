import { Account } from "../../models/Account";
import { Category } from "../../models/Category";

export interface FilterProps {
  categories? : Category[];
  accounts? : Account[];
}
