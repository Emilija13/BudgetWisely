import React from "react";
import { ProgressBarProps } from "./props/ProgressBarProps";

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, spent, limit }) => {
  return (
    <div className="flex-1 mx-4 ml-1">
      <div className="relative w-full bg-gray-200 h-2 rounded-full">
        <div
          className={`absolute top-0 left-0 h-2 rounded-full ${percentage < 50
              ? "bg-[rgb(0,181,141)]"
              : percentage < 85
                ? "bg-[rgb(255,148,87)]"
                : "bg-[rgb(255,97,97)]"
            }`}
          // className={`absolute top-0 left-0 h-2 rounded-full ${percentage < 50
          //   ? "main-color"
          //   : percentage < 85
          //     ? "main-color"
          //     : "main-color"
          // }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm mt-1 font-light">
        <span className="text-gray-600">{spent} MKD</span>
        <span className="text-gray-500">Remaining: {limit-spent} MKD</span>
        <span className="text-gray-600">{limit} MKD</span>
      </div>
    </div>
  );
};

export default ProgressBar;
