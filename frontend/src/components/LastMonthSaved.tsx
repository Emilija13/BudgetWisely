import React from "react";

const LastMonthSaved = ({ savedAmount }: { savedAmount: number }) => {
    return (
        <div className="bg-white rounded-lg flex items-center h-[100%] py-4 px-10" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
            {/* Circle with image */}
            <div 
                className="flex items-center justify-center rounded-full bg-[#516bff] w-[4rem] h-[4rem]" 
            >
                <img 
                    className="w-[2rem] h-[2rem]" 
                    src="images/save-money.png" 
                    alt="Save Money" 
                />
            </div>

            {/* Saved amount text */}
            <div className="ml-[2rem] dark-blue-text inter">
                <p className="text-lg font-semibold main-color-text mb-1">{savedAmount} MKD</p>
                <p className="text-sm font-thin arial">Budget Savings Last Month</p>
            </div>
        </div>
    );
};

export default LastMonthSaved;
