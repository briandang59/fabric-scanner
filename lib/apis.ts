import { urls } from "@/utils/constants/urls";
import { fetchClient } from "./fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { LoginResponseType } from "@/types/responses/auth";
import { LoginRequestType } from "@/types/requests/auth";

export const APIS = {
  auth: {
    login: (data: LoginRequestType) =>
      fetchClient<BaseResponse<LoginResponseType>>(
        `/${urls.ACCOUNT}/${urls.LOGIN}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          requireAuth: false,
        }
      ),
  },
  customer: {
    getAll: () =>
      fetchClient<BaseResponse<LoginResponseType>>(`/${urls.CUSTOMER}`, {
        method: "GET",
        requireAuth: true,
      }),
  },
};
