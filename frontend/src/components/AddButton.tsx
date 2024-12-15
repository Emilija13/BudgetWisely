import React from 'react';
import { ButtonProps } from './props/ButtonProps';

const AddButton :React.FC<ButtonProps> = ({ text, onClick}) => {

    return (
        <div className="">
            {/* <button onClick={onClick} className={`bg-indigo-400 text-white text-center text-4xl px-0 pb-3 w-12 h-12 rounded-md flex items-center justify-center`} > 
                {text}
            </button> */}
            <button onClick={onClick} className={`main-color text-white text-center text-sm font-light p-1 w-20 h-8 rounded-md flex items-center justify-center`} > 
                {text}
            </button>
        </div>
    );
};

export default AddButton;