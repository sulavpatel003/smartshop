import { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:5000");

function Community() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await API.get("/community", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.emit("joinCommunity");
    socket.on("receiveCommunityMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receiveCommunityMessage");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const sendMessage = () => {
  //   if (!input.trim()) return;
  //   socket.emit("sendCommunityMessage", {
  //     user_id: user.id,
  //     message: input,
  //   });
  //   setInput("");
  // };
  const sendMessage = async () => {
  if (!input.trim() && !image) return;

  let imageUrl = null;

  if (image) {
    const formData = new FormData();
    formData.append("image", image);

    const uploadRes = await API.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    imageUrl = uploadRes.data.imageUrl;
  }

  socket.emit("sendCommunityMessage", {
    user_id: user.id,
    message: input,
    image_url: imageUrl,
  });

  setInput("");
  setImage(null);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";
  const colorPool = [
    "from-orange-400 to-amber-400",
    "from-teal-500 to-emerald-400",
    "from-violet-500 to-purple-400",
    "from-pink-400 to-rose-400",
    "from-blue-500 to-indigo-400",
  ];
  const getColor = (name) => colorPool[(name?.charCodeAt(0) || 0) % colorPool.length];

  return (
    <div className="max-w-3xl mx-auto pb-6 pt-4 flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xl shadow-md">
          🌐
        </div>
        <div>
          <h2
            className="text-lg font-extrabold text-stone-800 font-['Sora']"
          >
            Community Chat
          </h2>
          <p className="text-xs text-stone-400">
            <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full mr-1 pulse-dot align-middle" />
            {messages.length} messages • Open to all
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl border border-orange-100 shadow-sm overflow-y-auto p-4 space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-stone-400 font-semibold font-['Sora'] text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.user_id === user?.id || msg.name === user?.name;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {!isMe && (
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(msg.name)} flex items-center justify-center text-white text-xs font-bold font-['Sora'] flex-shrink-0 shadow-md`}
                >
                  {getInitial(msg.name)}
                </div>
              )}

              <div className={`max-w-xs ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                {!isMe && (
                  <span className="text-[10px] font-bold text-stone-400 mb-1 ml-1 font-['Sora']">
                    {msg.name}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isMe ? "bubble-user" : "bubble-bot"
                  }`}
                >
                  {msg.message}
                  {msg.image_url && (
                  <img
                  src={msg.image_url}
                  alt="community"
                 className="mt-2 rounded-xl max-w-[250px] border border-orange-100 shadow-sm"
                     />
                  )}
                </div>
                <span className="text-[10px] text-stone-300 mt-1 mx-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

    {/* INPUT AREA */}
<div className="bg-white rounded-2xl border border-orange-200 shadow-md p-3">

  {/* IMAGE PREVIEW */}
  {image && (
    <div className="relative mb-3 w-fit">
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        className="w-32 h-32 object-cover rounded-2xl border border-orange-100 shadow-sm"
      />

      {/* REMOVE BUTTON */}
      <button
        onClick={() => setImage(null)}
        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs shadow-md"
      >
        ✕
      </button>
    </div>
  )}

  {/* INPUT ROW */}
  <div className="flex gap-3">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-stone-700 placeholder:text-stone-300 font-['Nunito']"
      placeholder="Type a message... (Enter to send)"
    />

    {/* IMAGE PICKER */}
    <label className="cursor-pointer flex items-center px-3 text-xl hover:scale-110 transition">
      📷
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </label>

    <button
      onClick={sendMessage}
      disabled={!input.trim() && !image}
      className="btn-primary px-5 py-2.5 text-sm rounded-xl text-white font-['Sora'] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Send →
    </button>
  </div>
</div>
      {/* Input
      <div className="flex gap-3 bg-white rounded-2xl border border-orange-200 shadow-md p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-stone-700 placeholder:text-stone-300 font-['Nunito']"
          placeholder="Type a message... (Enter to send)"
        />
        <label className="cursor-pointer flex items-center px-3 text-xl">
  📷
  <input
    type="file"
    hidden
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
  />
</label>
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="btn-primary px-5 py-2.5 text-sm rounded-xl text-white font-['Sora'] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send →
        </button>
      </div> */}
    </div>
  );
}

export default Community;
