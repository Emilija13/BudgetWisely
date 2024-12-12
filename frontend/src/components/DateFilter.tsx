import React, { useState } from "react";

const DateFilter: React.FC = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const [selectedMonth, setSelectedMonth] = useState("Dec");

  return (
    <div className="flex items-center justify-between pb-3">

      {/* Month Selection */}
      <div className="flex gap-4">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 text-sm font-semibold rounded-full ${
              selectedMonth === month
                ? "bg-gradient-to-r from-indigo-400 via-indigo-400 to-purple-400  text-white"
                : " text-gray-600 hover:bg-gray-200"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

    </div>
  );
};

export default DateFilter;
