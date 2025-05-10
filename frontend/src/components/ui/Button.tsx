import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export default function Button({children, onClick, disabled}: ButtonProps) {
    return (
        <button disabled={disabled}
                className='w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-3xl transition duration-200 ease-in-out transform hover:scale-[1.05]'
                onClick={onClick}
        >
            {children}
        </button>
    );
}