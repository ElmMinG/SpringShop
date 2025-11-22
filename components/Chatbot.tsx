import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { AiService } from '../services/aiService';
import { Chat } from "@google/genai";

interface ChatbotProps {
    products: Product[];
}

const Chatbot: React.FC<ChatbotProps> = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            text: "Hi! I'm your SpringShop AI assistant. I can help you find products, check prices, or give recommendations. What are you looking for today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Refs
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Chat Session when products are loaded
    useEffect(() => {
        if (products.length > 0 && !chatSessionRef.current) {
            chatSessionRef.current = AiService.createChatSession(products);
        }
    }, [products]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || !chatSessionRef.current) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const responseText = await AiService.sendMessage(chatSessionRef.current, userMsg.text);

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ease-in-out max-h-[600px] h-[500px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Sparkles size={18} className="text-yellow-300 fill-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">AI Assistant</h3>
                                <p className="text-xs text-blue-100">Powered by Gemini</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                    ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                  `}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-blue-600" />
                                    <span className="text-xs text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about products..."
                            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-2 rounded-full transition-colors shadow-sm flex items-center justify-center w-10 h-10"
                        >
                            <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110
          ${isOpen ? 'rotate-90 opacity-0 pointer-events-none scale-50' : 'rotate-0 opacity-100 scale-100'}
        `}
            >
                <MessageCircle size={28} />
            </button>

            {/* Close Button (when open, replaces FAB visual spot effectively) */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute bottom-0 right-0 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-4 shadow-lg transition-all duration-300 animate-in fade-in zoom-in"
                >
                    <X size={28} />
                </button>
            )}
        </div>
    );
};

export default Chatbot;