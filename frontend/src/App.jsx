import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import CreateShop from "./pages/CreateShop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Dashboard from "./pages/Dashboard";
import ShopOrders from "./pages/ShopOrders";
import ProductDetail from "./pages/ProductDetail";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import Community from "./pages/Community";
import { Toaster } from "react-hot-toast";
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: "#FFFBF5" }}>
        <Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 3000,
    style: {
      background: "#fff",
      color: "#333",
      borderRadius: "14px",
      padding: "14px",
      fontWeight: "500",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    success: {
      iconTheme: {
        primary: "#10b981",
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
        <Navbar />
        <Chatbot />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/create-shop" element={<CreateShop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shop-orders" element={<ShopOrders />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/community" element={<Community />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
