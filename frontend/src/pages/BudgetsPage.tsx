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

  const fetchCategories = async () => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        const userId: number = JSON.parse(user).id;

        const response = await CategoryService.getAllCategories();
        setCategories(response.data);
        const response1 = await BudgetService.getAllCurrentBudgets(userId);
        setBudgets(response1.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories:");
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = (categories: Category[], budgets: Budget[]): Category[] => {
    const budgetCategoryIds = budgets.map((budget) => budget.category.id);
    return categories.filter((category) => !budgetCategoryIds.includes(category.id));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = filterCategories(categories, budgets);

  const addBudget = async (categoryId: number, spendingLimit: number) => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userId: number = JSON.parse(user).id;
        const leftover = spendingLimit;
        const newBudget = {
          spendingLimit,
          leftover,
          category: categoryId,
          user: userId,
        };
        const response = await BudgetService.addBudget(newBudget);
        setBudgets([...budgets, response.data]);
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      setError("Failed to add budget.");
    }
  };

  const deleteBudget = async (budgetId: number) => {
    try {
      await BudgetService.deleteBudget(budgetId);
      setBudgets(budgets.filter((budget) => budget.id !== budgetId));
    } catch (error) {
      console.error("Error deleting budget:", error);
      setError("Failed to delete budget.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="w-full">
      <div className="p-10">
        <Typography variant="lead" color="blue-gray" className="font-bold text-lg">
          Budgets
        </Typography>
      </div>
      <div className="mx-20 grid grid-cols-2 gap-4 pb-5 h-auto w-auto overflow-y-auto">
        {budgets.map((budget) => (
          <CategoryListItem
            key={budget.category.id}
            budget={budget}
            onDeleteBudget={deleteBudget} 
          />
        ))}
        {filteredCategories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            onAddBudget={addBudget}
          />
        ))}
      </div>

    </section>
  );
}

export default BudgetsPage;
``
