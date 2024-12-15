import { Typography } from "@material-tailwind/react";
import { CategoryService } from "../services/CategoryService";
import { useEffect, useState } from "react";
import { Category } from "../models/Category";
import CategoryListItem from "../components/CategoryListItem";
import { BudgetService } from "../services/BudgetService";
import { Budget } from "../models/Budget";

function BudgetsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log("userid: ", userId);
      const response = await CategoryService.getAllCategories();
      setCategories(response.data);
      if (userId) {
        const response1 = await BudgetService.getAllBudgetsForUser(+userId);
        setBudgets(response1.data);
        console.log("Budgets: ", response1.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories:");
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = (
    categories: Category[],
    budgets: Budget[]
  ): Category[] => {
    const budgetCategoryIds = budgets.map((budget) => budget.category.id);
    return categories.filter(
      (category) => !budgetCategoryIds.includes(category.id)
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = filterCategories(categories, budgets);

  const addBudget = async (categoryId: number, spendingLimit: number) => {
    try {
      //const user = localStorage.getItem("user");
      if (userId) {
        //const userId: number = JSON.parse(user).id;
        const leftover = spendingLimit;
        const newBudget = {
          spendingLimit,
          leftover,
          category: categoryId,
          user: +userId,
        };
        const response = await BudgetService.addBudget(newBudget);
        setBudgets([...budgets, response.data]);
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      setError("Failed to add budget.");
    }
  };
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="w-full bg-white">
      <div className="p-6">
        <Typography variant="lead" color="blue-gray" className="font-bold">
          Budgets List
        </Typography>
        <Typography className="mb-4 w-80 font-normal text-gray-600 pt-2 md:w-full">
          A list of all your current budgets.
        </Typography>
      </div>
      <div className="flex flex-col items-center pb-5 h-[527px] overflow-y-auto">
        {budgets.map((budget) => {
          return <CategoryListItem key={budget.category.id} budget={budget} />;
        })}
        {filteredCategories.map((category) => {
          return (
            <CategoryListItem
              key={category.id}
              category={category}
              onAddBudget={addBudget}
            />
          );
        })}
      </div>
    </section>
  );
}

export default BudgetsPage;
