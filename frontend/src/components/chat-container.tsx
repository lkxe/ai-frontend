import React from "react";
import {Message} from "../types/types";
import {ChatMessage} from "./chatMessage";

export const ChatContainer: React.FC<{ messages: Message[] }> = ({ messages }) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
            <ChatMessage key={index} content={message.content} isUser={message.isUser} />
        ))}
    </div>
);