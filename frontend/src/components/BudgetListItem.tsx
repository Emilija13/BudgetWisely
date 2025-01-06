import { CategoryListItemProps } from "./props/CategoryListItemProps";
import { Typography } from "@material-tailwind/react";
import ProgressBar from "./ProgressBar";

const BudgetListItem: React.FC<CategoryListItemProps> = ({
  budget
}) => {

  const spent = (budget?.spendingLimit ?? 0) - (budget?.leftover ?? 0);
  const limit = budget?.spendingLimit ?? null;
  const percentage = limit ? Math.min((spent / limit) * 100, 100) : 0;

  return (
    <div
      className="flex mb-4 justify-between items-center rounded-lg pl-3 pr-0 py-2 relative group">
      <div className="flex items-center mr-2">
        <img
          src={budget?.category.image}
          className="w-12 h-12 rounded-full "
          alt={budget?.category.name}
        />
      </div>

      <div className="flex-1 mx-4">
        <div className="flex justify-between items-center">
          <Typography
            variant="lead"
            color="blue-gray"
            className="font-semibold ml-1 mb-0.5 text-base dark-blue-text"
          >
            {budget?.category.name}
          </Typography>
        </div>

        {limit !== null ? (
          <ProgressBar percentage={percentage} spent={spent} limit={limit} overview={true} />
        ) : (
          <div className="flex-1 mx-4"></div>
        )}
      </div>
    </div>
  );
};

export default BudgetListItem;
