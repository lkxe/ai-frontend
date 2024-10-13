export type Message = {
    content: string;
    isUser: boolean;
};

export type Chat = {
    id: number;
    title: string;
    messages: Message[];
};