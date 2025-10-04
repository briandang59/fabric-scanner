"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { fetchClient } from "./fetcher.client";

export function useApi<TResponse = unknown>(
  key: string | null,
  options?: SWRConfiguration<TResponse> & {
    requireAuth?: boolean;
    fetcher?: (url: string) => Promise<TResponse>;
  }
): SWRResponse<TResponse> {
  return useSWR<TResponse>(
    key,
    options?.fetcher
      ? options.fetcher
      : key
      ? (url) =>
          fetchClient<TResponse>(url, { requireAuth: options?.requireAuth })
      : null,
    options
  );
}
