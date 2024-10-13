import React from "react";

export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; className?: string }> = ({ children, onClick, icon, className = '' }) => (
    <button
        className={`bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2 ${className}`}
        onClick={onClick}
    >
        {icon}
        <span>{children}</span>
    </button>
);

