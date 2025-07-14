import axios from "axios";
import { getSession } from "next-auth/react";

const instance = axios.create({
  baseURL: "http://localhost:5001",
});

instance.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = (session as any)?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
