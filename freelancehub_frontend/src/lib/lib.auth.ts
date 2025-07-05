import React from "react";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  }
};
