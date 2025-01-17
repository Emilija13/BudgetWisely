import { Account } from "../../models/Account";
import { Category } from "../../models/Category";
import { FilterDto } from "../../models/dto/FilterDto";

export interface FilterProps {
  categories: Category[];
  accounts: Account[];
  userId: number;
  onFilterChange?: (filters: FilterDto) => void;
}
