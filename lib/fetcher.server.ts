"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createAuthHeaders } from "./authHeaders";

type FetchOptions = RequestInit & {
  requireAuth?: boolean;
  skipAuthSign?: boolean;
};

export async function fetchServer<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = options.requireAuth
    ? cookieStore.get("token")?.value
    : undefined;

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // chỉ thêm authHeaders nếu không skip
  if (!options.skipAuthSign) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "";
    Object.assign(headers, createAuthHeaders(apiKey, secretKey));
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!res.ok) {
    if (res.status === 401 && options.requireAuth) {
      redirect("/log-in");
    }
    throw new Error(`Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}
