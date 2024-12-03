import React from 'react';
import { ButtonProps } from './props/ButtonProps';

const CustomButton :React.FC<ButtonProps> = ({ text, onClick}) => {

    return (
        <div className="">
            <button onClick={onClick} className={`bg-indigo-400 text-white text-center text-xl px-5 py-1 pb2 mt-5 rounded-lg flex items-center justify-center`} > 
                {text}
            </button>
        </div>
    );
};

export default CustomButton;