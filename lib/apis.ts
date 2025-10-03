import { urls } from "@/utils/constants/urls";
import { fetchClient } from "./fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { LoginResponseType } from "@/types/responses/auth";
import { LoginRequestType } from "@/types/requests/auth";
import { CustomerResponseType } from "@/types/responses/customer";
import { InterestFabricRequestType } from "@/types/requests/interest";
import { CustomerRequestType } from "@/types/requests/customer";
import { InterestResponseType } from "@/types/responses/interest";

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
      fetchClient<BaseResponse<CustomerResponseType[]>>(`/${urls.CUSTOMER}`, {
        method: "GET",
        requireAuth: true,
      }),
    interest: (data: InterestFabricRequestType) =>
      fetchClient<BaseResponse<InterestFabricRequestType[]>>(
        `/${urls.INTEREST}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          requireAuth: true,
        }
      ),
    create: (data: CustomerRequestType) =>
      fetchClient<BaseResponse<CustomerResponseType[]>>(`/${urls.CUSTOMER}`, {
        method: "POST",
        body: JSON.stringify(data),
        requireAuth: true,
      }),
    getAllInterest: () =>
      fetchClient<BaseResponse<InterestResponseType[]>>(`/${urls.INTEREST}`, {
        method: "GET",
        requireAuth: true,
      }),
    deleteInterest: (data: { id: string }) =>
      fetchClient<BaseResponse<InterestResponseType[]>>(`/${urls.INTEREST}`, {
        method: "DELETE",
        body: JSON.stringify(data),
        requireAuth: true,
      }),
  },
};
