import React, {useState} from "react";
import {Button} from "./components/button";
import {Download, Plus, Send, Settings} from "lucide-react";
import {Chat, Message} from "./types/types";
import {ChatItem} from "./components/chat-item";
import {ChatContainer} from "./components/chat-container";
import {Input} from "./components/input";
import {SendMessage} from "../wailsjs/go/main/App";


const App: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([
        { id: 1, title: 'New Chat', messages: [] },
    ]);
    const [activeChat, setActiveChat] = useState<Chat>(chats[0]);
    const [input, setInput] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [model, setModel] = useState<string>('claude');
    const [useCaching, setUseCaching] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        if (input.trim() && !isLoading) {
            const newMessage: Message = { content: input, isUser: true };
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === activeChat.id
                        ? { ...chat, messages: [...chat.messages, newMessage] }
                        : chat
                )
            );
            setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
            setInput('');
            setIsLoading(true);
            setError(null);

            try {
                console.log(`Sending message to ${model} with caching ${useCaching}`);
                const response = await SendMessage(model, input, useCaching);
                console.log('Received response:', response);

                const aiResponse: Message = { content: response, isUser: false };
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat.id === activeChat.id
                            ? { ...chat, messages: [...chat.messages, aiResponse] }
                            : chat
                    )
                );
                setActiveChat(prev => ({ ...prev, messages: [...prev.messages, aiResponse] }));
            } catch (err: any) {
                console.error('Error sending message:', err);
                setError(`Failed to get response from AI: ${err.message || 'Unknown error'}. Please check the console for more details.`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const createNewChat = () => {
        const newChat: Chat = {
            id: chats.length + 1,
            title: `New Chat ${chats.length + 1}`,
            messages: []
        };
        setChats(prevChats => [...prevChats, newChat]);
        setActiveChat(newChat);
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col">
            <nav className="bg-gray-900 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    AI Chat
                </h1>
                <div className="flex space-x-4">
                    <Button icon={<Settings size={18} />} onClick={() => setShowSettings(!showSettings)}>
                        Settings
                    </Button>
                    <Button icon={<Download size={18} />}>
                        Export Chat
                    </Button>
                </div>
            </nav>

            <div className="flex-1 flex">
                {/* Side Panel */}
                <div className="w-64 bg-gray-900 p-4 flex flex-col">
                    <Button icon={<Plus size={18} />} onClick={createNewChat} className="mb-4">
                        New Chat
                    </Button>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {chats.map(chat => (
                            <ChatItem
                                key={chat.id}
                                title={chat.title}
                                isActive={chat.id === activeChat.id}
                                onClick={() => setActiveChat(chat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col p-4">
                    {showSettings && (
                        <div className="bg-gray-800 p-4 mb-4 rounded-lg">
                            <h2 className="text-xl mb-2">Settings</h2>
                            <div className="flex items-center mb-2">
                                <label className="mr-2">Model:</label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="bg-gray-700 text-white p-2 rounded"
                                >
                                    <option value="claude">Claude</option>
                                    <option value="chatgpt">ChatGPT</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="mr-2">Use Caching:</label>
                                <input
                                    type="checkbox"
                                    checked={useCaching}
                                    onChange={(e) => setUseCaching(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                            </div>
                        </div>
                    )}

                    <ChatContainer messages={activeChat.messages} />

                    {error && <div className="text-red-500 mb-2">{error}</div>}

                    <div className="mt-4 flex space-x-2">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <Button icon={<Send size={18} />} onClick={sendMessage}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;