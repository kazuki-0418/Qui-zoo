import axios from "axios";

// axiosインスタンスの作成（設定を一箇所で管理）
const api = axios.create({
  // biome-ignore lint/style/useNamingConvention: <explanation>
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
