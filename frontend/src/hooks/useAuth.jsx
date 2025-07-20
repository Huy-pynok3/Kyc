import { useState } from "react";
import { loginAdmin } from "@/services/api";
import { setToken, clearToken, getToken } from "@/services/auth";

export const useAuth = () => {
  const [token, setAuthToken] = useState(getToken());
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginAdmin(password);
      setToken(data.token);
      setAuthToken(data.token);
      return data.token;
    } catch (err) {
      alert(`Lỗi đăng nhập: ${err.message}`);
    }
  };

  const handleLogout = () => {
    clearToken();
    setAuthToken("");
    window.location.reload(); // hoặc navigate(0)
  };

  return { token, password, setPassword, handleLogin, handleLogout };
};