import { urls } from "@/utils/constants/urls";
import { fetchClient } from "../fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { useApi } from "../useApi";
import { InterestResponseType } from "@/types/responses/interest";
import { InterestGetRequestType } from "@/types/requests/interest";

export function useInterest(data: InterestGetRequestType) {
  const key = `/${urls.INTEREST}/${urls.GET_ALL}`;

  return useApi<BaseResponse<InterestResponseType[]>>(key, {
    requireAuth: true,
    fetcher: (_url: string) =>
      fetchClient<BaseResponse<InterestResponseType[]>>(key, {
        method: "POST",
        body: JSON.stringify(data),
        requireAuth: true,
      }),
  });
}
