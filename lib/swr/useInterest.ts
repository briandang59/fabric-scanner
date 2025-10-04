import { urls } from "@/utils/constants/urls";
import { fetchClient } from "../fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { useApi } from "../useApi";
import { InterestResponseType } from "@/types/responses/interest";
import { InterestGetRequestType } from "@/types/requests/interest";

export function useInterest(data: InterestGetRequestType) {
  const key = data ? [`/${urls.INTEREST}/${urls.GET_ALL}`, data] : null;

  return useApi<BaseResponse<InterestResponseType[]>>(
    key ? JSON.stringify(key) : null,
    {
      requireAuth: true,
      fetcher: () =>
        fetchClient<BaseResponse<InterestResponseType[]>>(
          `/${urls.INTEREST}/${urls.GET_ALL}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            requireAuth: true,
          }
        ),
    }
  );
}
