import { urls } from "@/utils/constants/urls";
import { fetchClient } from "../fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { useApi } from "../useApi";
import { FabricResponseType } from "@/types/responses/fabric";

export function useFabrics() {
  const key = `/${urls.INTEREST}/${urls.LIST_FABRIC}`;

  return useApi<BaseResponse<FabricResponseType[]>>(key, {
    requireAuth: true,
    fetcher: () =>
      fetchClient<BaseResponse<FabricResponseType[]>>(key, {
        method: "GET",
        requireAuth: true,
      }),
  });
}
