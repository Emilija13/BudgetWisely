import React, { useState } from "react";
import { CategoryListItemProps } from "./props/CategoryListItemProps";
import { Typography } from "@material-tailwind/react";

const CategoryListItem: React.FC<CategoryListItemProps> = ({category, budget, onAddBudget,}) => {
  const [isAdding, setIsAdding] = useState(false); 
  const [spendingLimit, setSpendingLimit] = useState<number | null>( budget?.spendingLimit || null ); 

  const handleAddClick = () => {
    setIsAdding(true); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpendingLimit(Number(e.target.value)); 
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsAdding(false); 
      if (category && spendingLimit && onAddBudget) {
        await onAddBudget(category.id, spendingLimit);
        setIsAdding(false); 
        setSpendingLimit(null); 
      }
  }};

  return (
    <div className="flex justify-between purple-light rounded-full mb-2 p-5 items-center w-11/12">
      {category == null ? (
        <div className="flex items-center pl-4">
          <img src={budget?.category.image} className="w-16 h-16" />
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-bold ml-5"
          >
            {budget?.category.name}
          </Typography>
        </div>
      ) : (
        <div className="flex items-center pl-4">
          <img src={category.image} className="w-16 h-16" />
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-bold ml-5"
          >
            {category.name}
          </Typography>
        </div>
      )}
      {isAdding ? (
        <div className="pr-4">
          <input
            type="text"
            placeholder="Enter amount"
            className="purple-light py-1 text-blue-gray-700 outline-none focus:ring-2 focus:ring-indigo-300 w-28"
            value={spendingLimit || ""}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      ) : spendingLimit !== null ? (
        <div className="pr-4">
          <span>{spendingLimit} MKD</span>
        </div>
      ) : (
        <div className="pr-4">
          <img
            src="plus.png"
            className="w-6 h-6 cursor-pointer"
            onClick={handleAddClick}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryListItem;