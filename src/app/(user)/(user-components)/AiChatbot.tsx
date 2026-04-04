"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, ChevronDown, Loader2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
    "What courses are available?",
    "How do I enroll in a course?",
    "Tips for online learning?",
    "How to register as a course provider?",
];

export default function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "👋 Hi! I'm **EduBot**, your AI learning assistant. I can help you find courses, answer questions about Eduverse, or give you study tips.\n\nWhat would you like to know?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [hasUnread, setHasUnread] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setHasUnread(false);
        }
    }, [isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messages
                .filter((m) => m.id !== "welcome")
                .map((m) => ({ role: m.role, content: m.content }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text.trim(), history }),
            });

            const data = await res.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply || data.error || "Sorry, I couldn't respond. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            if (!isOpen) setHasUnread(true);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "⚠️ I'm having trouble connecting right now. Please check your internet and try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    // Simple markdown-like renderer for bold and line breaks
    const renderContent = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const formatMessage = (content: string) => {
        const lines = content.split("\n");
        return lines.map((line, i) => {
            if (line.startsWith("- ") || line.startsWith("• ")) {
                return (
                    <li key={i} className="ml-3 list-disc">
                        {renderContent(line.slice(2))}
                    </li>
                );
            }
            if (/^\d+\.\s/.test(line)) {
                return (
                    <li key={i} className="ml-3 list-decimal">
                        {renderContent(line.replace(/^\d+\.\s/, ""))}
                    </li>
                );
            }
            if (line.trim() === "") return <br key={i} />;
            return <p key={i}>{renderContent(line)}</p>;
        });
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                {/* Tooltip nudge (first visit) */}
                {!isOpen && hasUnread && (
                    <div className="bg-white border border-purple-100 rounded-2xl shadow-lg px-4 py-2 text-sm text-gray-700 flex items-center gap-2 animate-bounce">
                        <Bot size={16} className="text-purple-600" />
                        Ask EduBot anything!
                    </div>
                )}

                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setIsMinimized(false);
                    }}
                    className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full shadow-2xl shadow-purple-900/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                >
                    {isOpen ? <X size={22} /> : <Bot size={22} />}
                    {/* Unread dot */}
                    {!isOpen && hasUnread && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold">
                            1
                        </span>
                    )}
                    {/* Pulse ring */}
                    {!isOpen && (
                        <span className="absolute inset-0 rounded-full bg-purple-500 opacity-30 animate-ping" />
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed bottom-24 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${isMinimized ? "h-14 w-80" : "w-96 h-[560px]"
                        }`}
                    style={{ maxWidth: "calc(100vw - 48px)" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm leading-none">EduBot</h3>
                                <p className="text-purple-200 text-[11px] mt-0.5">AI Learning Assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Online indicator */}
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition"
                                title={isMinimized ? "Expand" : "Minimize"}
                            >
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${isMinimized ? "rotate-180" : ""}`}
                                />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            }`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === "assistant"
                                                    ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                                                    : "bg-gray-200"
                                                }`}
                                        >
                                            {msg.role === "assistant" ? (
                                                <Bot size={14} className="text-white" />
                                            ) : (
                                                <User size={14} className="text-gray-600" />
                                            )}
                                        </div>

                                        {/* Bubble */}
                                        <div
                                            className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"
                                                } flex flex-col gap-1`}
                                        >
                                            <div
                                                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                                        ? "bg-purple-600 text-white rounded-br-sm"
                                                        : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
                                                    }`}
                                            >
                                                <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 px-1">
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading indicator */}
                                {isLoading && (
                                    <div className="flex items-end gap-2">
                                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                            <Bot size={14} className="text-white" />
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggested questions (show only with welcome message) */}
                            {messages.length === 1 && (
                                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                                    {SUGGESTED_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1.5 hover:bg-purple-100 transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="border-t border-gray-100 p-3">
                                <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask EduBot anything..."
                                        rows={1}
                                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-28 min-h-[24px]"
                                        style={{ height: "auto" }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = Math.min(target.scrollHeight, 112) + "px";
                                        }}
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={() => sendMessage(input)}
                                        disabled={!input.trim() || isLoading}
                                        className="w-8 h-8 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center flex-shrink-0 transition"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={15} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center mt-1.5">
                                    Press Enter to send · Shift+Enter for new line
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
