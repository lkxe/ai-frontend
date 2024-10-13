import React from "react";

export const ChatMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => (
    <div className={`my-2 p-3 rounded-lg ${isUser ? 'bg-blue-600 ml-auto' : 'bg-gray-700'} max-w-[70%]`}>
        <p className="text-white">{content}</p>
    </div>
);