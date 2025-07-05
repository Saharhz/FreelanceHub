"use client";
import axios from "@/lib/lib.axios";

export const useProfile = () => {
  const getProfile = async () => {
    const res = await axios.get("/users/me");
    return res.data;
  };

  return { getProfile };
};
