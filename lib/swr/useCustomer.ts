import { urls } from "@/utils/constants/urls";
import { fetchClient } from "../fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { useApi } from "../useApi";
import { CustomerResponseType } from "@/types/responses/customer";
export function useCustomer() {
  const key = `/${urls.CUSTOMER}`;

  return useApi<BaseResponse<CustomerResponseType[]>>(key, {
    requireAuth: true,
    fetcher: () => fetchClient(key, { requireAuth: true }),
  });
}
