import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm LocalFinder's AI assistant 👋 How can I help you discover local products?" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await API.post("/chat", { message: input });
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "AI service unavailable 🤖 Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* CLOSED — floating button */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white text-2xl flex items-center justify-center shadow-2xl shadow-orange-300 hover:scale-110 transition-transform"
        title="Open AI Assistant"
      >
        🤖
      </button>
    );
  }

  /* OPEN — chat window */
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] max-h-[520px] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-orange-200 border border-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <div className="text-white font-bold text-sm font-['Sora']">
              AI Assistant
            </div>
            <div className="text-orange-100 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block pulse-dot" />
              Online
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm transition"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-orange-50/40">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {m.sender === "bot" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-[11px] flex-shrink-0 shadow-md">
                🤖
              </div>
            )}
            <div
  className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
    m.sender === "user" ? "bubble-user" : "bubble-bot"
  }`}
>
  <ReactMarkdown
    components={{
      strong: ({ children }) => (
        <strong className="font-bold text-stone-900">
          {children}
        </strong>
      ),
      p: ({ children }) => (
        <p className="mb-2 last:mb-0">{children}</p>
      ),
      li: ({ children }) => (
        <li className="ml-4 list-disc">{children}</li>
      ),
    }}
  >
    {m.text}
  </ReactMarkdown>
</div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-[11px] flex-shrink-0">
              🤖
            </div>
            <div className="bubble-bot px-4 py-3">
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((delay, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex border-t border-orange-100 bg-white">
        <input
          className="flex-1 px-4 py-3 outline-none text-sm text-stone-700 placeholder:text-stone-300 font-['Nunito'] bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="btn-primary px-4 text-sm font-['Sora'] disabled:opacity-40 rounded-none"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
