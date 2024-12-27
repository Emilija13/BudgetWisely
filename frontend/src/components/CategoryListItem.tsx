import React, { useState, useEffect, useRef } from "react";
import { CategoryListItemProps } from "./props/CategoryListItemProps";
import { Typography } from "@material-tailwind/react";
import ProgressBar from "./ProgressBar";

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  budget,
  onAddBudget,
  onDeleteBudget,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState<number | null>(
    budget?.spendingLimit || null
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsAdding(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        setSpendingLimit(null);
      }
    }
  };

  const handleDeleteClick = () => {
    if (budget?.id && onDeleteBudget) {
      onDeleteBudget(budget.id);
    }
  };

  const spent = budget?.spendingLimit!! - budget?.leftover!! || 0;
  const limit = budget?.spendingLimit || null;
  const percentage = Math.min((spent / limit!!) * 100, 100);

  return (
    <div
      className="flex justify-between items-center rounded-lg pl-7 pr-0 py-6 bg-white relative group"
      style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center">
        <img
          src={category?.image || budget?.category.image}
          className="w-12 h-12 rounded-full"
          alt={category?.name || budget?.category.name}
        />
      </div>

      <div className="flex-1 mx-4">
        <div className="flex justify-between items-center">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-semibold ml-1 mb-0.5 text-base"
          >
            {category?.name || budget?.category.name}
          </Typography>


          {/* {limit !== null ? (

          <Typography
            variant="small"
            className="text-sm font-thin mr-3 text-gray-500"
          >
            {`Left: ${budget?.leftover} MKD`}
          </Typography>
        ) : (
          <Typography> </Typography>
        )} */}
        </div>

        {limit !== null ? (
          <ProgressBar percentage={percentage} spent={spent} limit={limit} />
        ) : (
          <div className="flex-1 mx-4"></div>
        )}
      </div>

      {isAdding ? (
        <div className="pr-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter amount"
            className="py-1 px-3 border rounded-lg font-light text-gray-700 focus:ring-2 focus:ring-indigo-300 w-28"
            value={spendingLimit || ""}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      ) : (
        <div className="pr-4 mr-2">
          {spendingLimit !== null ? (
            <button
              className="w-7 h-7 rounded-full hover:bg-gray-100 p-0.7 group-hover:block hidden hover:text-gray-400"
              onClick={handleDeleteClick}
            >
              <span className="text-xl font-light text-gray-300">×</span>
            </button>
          ) : (
            <button className="w-9 h-9 rounded-full hover:bg-gray-100 p-2">
              <img
                src="https://static.thenounproject.com/png/586769-200.png"
                className="w-5 h-5 cursor-pointer mr-3"
                alt="Add Budget"
                onClick={handleAddClick}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryListItem;
