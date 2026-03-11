import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const QUICK_ACTIONS = [
  { label: 'Show me products', message: 'What products do you have? Show me your latest items with prices' },
  { label: 'Help me order', message: 'How do I place an order on your website?' },
  { label: 'Track my order', message: 'I want to track my order' },
  { label: 'Return policy', message: 'What is your return policy?' },
  { label: 'Delivery info', message: 'What are your delivery timelines and shipping costs?' },
  { label: 'Contact support', message: 'How can I contact customer support?' },
];

// Render message content with clickable links and images
function renderMessageContent(text) {
  if (!text) return text;

  // Split by markdown links: [text](url) and plain URLs
  const parts = [];
  let remaining = text;
  let key = 0;

  // Match markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }

    const linkText = match[1];
    const url = match[2];

    // Check if it's an image URL
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || url.includes('cloudinary') || url.includes('res.cloudinary')) {
      parts.push(
        <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="block my-1.5">
          <img src={url} alt={linkText} className="max-w-full w-40 h-40 object-cover rounded-lg border border-zinc-700" />
        </a>
      );
    } else {
      parts.push(
        <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline underline-offset-2 hover:text-yellow-300">
          {linkText}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! Welcome to FAX Collections. I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setShowQuickActions(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "I'm sorry, I'm having trouble right now. Please try again or contact us at support@faxcollections.com." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I couldn't connect to the server. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (msg) => {
    sendMessage(msg);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full shadow-lg shadow-yellow-400/20 flex items-center justify-center z-50 cursor-pointer"
          >
            <FaComments className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(600px,calc(100vh-3rem))] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zinc-900 px-4 py-3 flex items-center gap-3 border-b border-zinc-800 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <FaRobot className="text-yellow-400 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">FAX Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-[11px]">Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-yellow-400' : 'bg-zinc-800'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <FaUser className="text-black text-[10px]" />
                    ) : (
                      <FaRobot className="text-yellow-400 text-[10px]" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-yellow-400 text-black rounded-br-md'
                        : 'bg-zinc-800/80 text-zinc-200 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-yellow-400 text-[10px]" />
                  </div>
                  <div className="bg-zinc-800/80 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQuickActions && messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.message)}
                    className="text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-zinc-700/50 transition-colors cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-3 py-3 border-t border-zinc-800 flex gap-2 flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-yellow-400 hover:bg-yellow-300 text-black w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer flex-shrink-0"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
