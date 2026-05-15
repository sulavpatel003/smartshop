import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Chats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/chat", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setChats(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto pb-16 pt-4">
      <div className="mb-8">
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          💬 My Chats
        </h2>
        <p className="text-stone-400 text-sm">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""} with shops
        </p>
      </div>

      {chats.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-orange-100">
          <div className="text-7xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-stone-700 mb-2 font-['Sora']">
            No chats yet
          </h3>
          <p className="text-stone-400 text-sm">
            Start a conversation by visiting a product and clicking "Chat with Shop"
          </p>
        </div>
      )}

      <div className="space-y-3">
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/chat/${c.id}`)}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:border-orange-300 hover:shadow-md hover:bg-orange-50/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
              🏪
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-stone-800 font-['Sora'] truncate">
                {c.shop_name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Tap to continue conversation
              </p>
            </div>
            <div className="text-stone-300 group-hover:text-orange-400 transition-colors">
              →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chats;
