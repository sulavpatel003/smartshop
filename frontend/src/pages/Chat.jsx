import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import API from "../services/api";

const socket = io(import.meta.env.VITE_SOCKET_URL);

function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socket.emit("joinRoom", id);

    API.get(`/chat/${id}/messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setMessages(res.data));

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const sendMessage = () => {
  //   if (!text.trim()) return;
  //   socket.emit("sendMessage", {
  //     conversation_id: id,
  //     sender_id: user.id,
  //     message: text,
  //   });
  //   setText("");
  // };

  const sendMessage = async () => {
  if (!text.trim() && !image) return;

  let imageUrl = null;

  // upload image
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

  socket.emit("sendMessage", {
    conversation_id: id,
    sender_id: user.id,
    message: text,
    image_url: imageUrl,
  });

  setText("");
  setImage(null);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-6 pt-4 flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-xl shadow-md">
          💬
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-stone-800 font-['Sora']">
            Shop Chat
          </h2>
          <p className="text-xs text-stone-400">
            <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full mr-1 pulse-dot align-middle" />
            Live conversation
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl border border-orange-100 shadow-sm overflow-y-auto p-4 space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-stone-400 font-semibold font-['Sora'] text-sm">
              Start the conversation!
            </p>
          </div>
        )}

        {messages.map((m) => {
          const isMe = m.sender_id === user.id;
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold font-['Sora'] flex-shrink-0 shadow-md">
                  {m.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div className={`max-w-xs flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && (
                  <span className="text-[10px] font-bold text-stone-400 mb-1 ml-1 font-['Sora']">
                    {m.name}
                  </span>
                )}
                <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${isMe ? "bubble-user" : "bubble-bot"}`}>
                  {m.message}
                  {m.image_url && (
                   <img
                  src={m.image_url}
                  alt="chat"
                className="mt-2 rounded-xl max-w-[220px] border border-orange-100 shadow-sm"
                />
                )}
                </div>
                <span className="text-[10px] text-stone-300 mt-1 mx-1">
                  {new Date(m.created_at).toLocaleTimeString([], {
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

      {/* REMOVE IMAGE BUTTON */}
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
      value={text}
      onChange={(e) => setText(e.target.value)}
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
      disabled={!text.trim() && !image}
      className="btn-primary px-5 py-2.5 text-sm rounded-xl text-white font-['Sora'] disabled:opacity-40"
    >
      Send →
    </button>
  </div>
</div>
      {/* Input
      <div className="flex gap-3 bg-white rounded-2xl border border-orange-200 shadow-md p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
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
          disabled={!text.trim()}
          className="btn-primary px-5 py-2.5 text-sm rounded-xl text-white font-['Sora'] disabled:opacity-40"
        >
          Send →
        </button>
      </div> */}
    </div>
  );
}

export default Chat;
