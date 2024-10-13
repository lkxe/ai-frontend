import {MessageSquare} from "lucide-react";
import React from "react";

export const ChatItem: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
    <div
        className={`p-2 rounded-md cursor-pointer ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
        onClick={onClick}
    >
        <div className="flex items-center space-x-2">
            <MessageSquare size={18} />
            <span className="truncate">{title}</span>
        </div>
    </div>
);