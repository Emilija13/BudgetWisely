import axios from "axios";
import { Category } from "../models/Category";

export const CategoryService = {
    url: "http://localhost:8080/api/categories",

    getAllCategories: async () => {
        return await axios.get<Category[]>(CategoryService.url);
    }

};