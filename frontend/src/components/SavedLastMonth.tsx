import React from "react";

const LastMonthSaved = ({ savedAmount }: { savedAmount: number }) => {
    return (
        <div className="bg-[#677AE5] rounded-lg flex items-center h-[100%] py-4 px-10" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
            {/* Circle with image */}
            <div 
                className="flex items-center justify-center rounded-full bg-[#8394F8] w-[4rem] h-[4rem]" 
            >
                <img 
                    className="w-[2rem] h-[2rem]" 
                    src="../../save-money.png" 
                    alt="Save Money" 
                />
            </div>

            {/* Saved amount text */}
            <div className="ml-[2rem] text-white inter">
                <p className="text-lg font-bold mb-1">{savedAmount} MKD</p>
                <p className="text-sm font-thin arial">Budget Savings Last Month</p>
            </div>
        </div>
    );
};

export default LastMonthSaved;
