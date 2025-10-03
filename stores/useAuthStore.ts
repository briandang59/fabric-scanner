"use client";

import { create } from "zustand";
import Cookies from "cookies-js";

interface AuthState {
  token: string | null;
  cardNumber: string | null;
  login: (token: string, cardNumber: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  cardNumber: null,
  login: (token, cardNumber) => {
    Cookies.set("token", token);
    Cookies.set("card_number", cardNumber);
    set({ token, cardNumber });
  },
  logout: () => {
    Cookies.expire("token");
    Cookies.expire("card_number");
    set({ token: null, cardNumber: null });
  },
}));

if (typeof window !== "undefined") {
  const token = Cookies.get("token") || null;
  const cardNumber = Cookies.get("card_number") || null;
  if (token && cardNumber) {
    useAuthStore.setState({ token, cardNumber });
  }
}
