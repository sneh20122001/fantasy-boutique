import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
    id: string;
    fromMe: boolean;
    text: string;
    ts: number;
}

interface Thread {
    id: string;
    sellerAlias: string;
    listingBrand: string;
    listingSize: string;
    preview: string;
    unread: number;
    messages: Message[];
}

// ---------------------------------------------------------------------------
// Mock thread data (localStorage-persisted)
// ---------------------------------------------------------------------------
const STORAGE_KEY = "velvetwhisper_messages";

const INITIAL_THREADS: Thread[] = [
    {
        id: "t1",
        sellerAlias: "User_8472",
        listingBrand: "La Perla",
        listingSize: "34B",
        preview: "Hi! Is this still available?",
        unread: 1,
        messages: [
            { id: "m1", fromMe: false, text: "Hi! Is this still available?", ts: Date.now() - 3600000 },
            { id: "m2", fromMe: true, text: "Yes, it is! Just listed it this morning.", ts: Date.now() - 3500000 },
        ],
    },
    {
        id: "t2",
        sellerAlias: "User_3391",
        listingBrand: "Agent Provocateur",
        listingSize: "36C",
        preview: "Can you describe the condition?",
        unread: 0,
        messages: [
            { id: "m3", fromMe: false, text: "Can you describe the condition?", ts: Date.now() - 86400000 },
            { id: "m4", fromMe: true, text: "Gently worn, washed once. Still has the original tag.", ts: Date.now() - 86000000 },
            { id: "m5", fromMe: false, text: "Perfect, I'll take it!", ts: Date.now() - 85000000 },
        ],
    },
];

const loadThreads = (): Thread[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : INITIAL_THREADS;
    } catch {
        return INITIAL_THREADS;
    }
};

const saveThreads = (threads: Thread[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
};

const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
        ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Messages = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [threads, setThreads] = useState<Thread[]>(loadThreads);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [text, setText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!authLoading && !user) navigate("/auth");
    }, [user, authLoading, navigate]);

    useEffect(() => {
        saveThreads(threads);
    }, [threads]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeId, threads]);

    const activeThread = threads.find((t) => t.id === activeId) ?? null;

    const sendMessage = () => {
        if (!text.trim() || !activeId) return;
        const newMsg: Message = { id: `m${Date.now()}`, fromMe: true, text: text.trim(), ts: Date.now() };
        setThreads((prev) =>
            prev.map((t) =>
                t.id === activeId
                    ? { ...t, messages: [...t.messages, newMsg], preview: newMsg.text, unread: 0 }
                    : t
            )
        );
        setText("");
    };

    const openThread = (id: string) => {
        setActiveId(id);
        setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    };

    return (
        <Layout>
            <section className="py-16">
                <div className="container mx-auto max-w-4xl px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="mb-8 font-display text-3xl font-semibold text-foreground">
                            <span className="italic text-primary">Messages</span>
                        </h1>

                        <div className="grid h-[600px] overflow-hidden rounded-lg border border-border gradient-card shadow-card md:grid-cols-[280px_1fr]">
                            {/* Thread list */}
                            <div className="border-b border-border md:border-b-0 md:border-r overflow-y-auto">
                                {threads.length === 0 ? (
                                    <div className="flex h-full items-center justify-center p-6 text-center">
                                        <p className="font-body text-sm text-muted-foreground">No conversations yet.</p>
                                    </div>
                                ) : (
                                    threads.map((t) => (
                                        <button key={t.id} onClick={() => openThread(t.id)}
                                            className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-colors border-b border-border/50 hover:bg-secondary/50 ${activeId === t.id ? "bg-secondary/70" : ""}`}>
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary">
                                                {t.sellerAlias.slice(-2)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-body text-xs font-semibold text-foreground">{t.sellerAlias}</span>
                                                    {t.unread > 0 && (
                                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{t.unread}</span>
                                                    )}
                                                </div>
                                                <p className="font-body text-xs text-muted-foreground">{t.listingBrand} · {t.listingSize}</p>
                                                <p className="mt-0.5 truncate font-body text-xs text-muted-foreground/70">{t.preview}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Chat panel */}
                            {activeThread ? (
                                <div className="flex flex-col">
                                    {/* Chat header */}
                                    <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary">
                                            {activeThread.sellerAlias.slice(-2)}
                                        </div>
                                        <div>
                                            <p className="font-body text-sm font-semibold text-foreground">{activeThread.sellerAlias}</p>
                                            <p className="font-body text-xs text-muted-foreground">{activeThread.listingBrand} · Size {activeThread.listingSize}</p>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                                        <AnimatePresence initial={false}>
                                            {activeThread.messages.map((msg) => (
                                                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.fromMe
                                                            ? "rounded-br-sm bg-primary text-primary-foreground"
                                                            : "rounded-bl-sm bg-secondary text-foreground"
                                                        }`}>
                                                        <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                                                        <p className={`mt-1 font-body text-[10px] ${msg.fromMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                                            {formatTime(msg.ts)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <div ref={bottomRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="border-t border-border px-4 py-3">
                                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-3">
                                            <input
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder="Type a message…"
                                                className="flex-1 rounded-full border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                                            />
                                            <button type="submit" disabled={!text.trim()}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-all hover:scale-105 disabled:opacity-40">
                                                <Send size={15} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center justify-center text-center p-8">
                                    <div>
                                        <MessageSquare size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                                        <p className="font-display text-sm text-muted-foreground">Select a conversation to start messaging</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Messages;
