import { urls } from "@/utils/constants/urls";
import { fetchClient } from "../fetcher.client";
import { BaseResponse } from "@/types/responses/base";
import { useApi } from "../useApi";
import {
  StatisticalFabricCompareResponse,
  StatisticalTop10Customer,
  StatisticalTop10Fabric,
} from "@/types/responses/statistical";
import {
  FabricCompareRequestType,
  StatisticalTop10CustomerRequest,
  StatisticalTop10Request,
} from "@/types/requests/statistical";

export function useGetTop10Fabric(data: StatisticalTop10Request) {
  const key = data ? [`/${urls.INTEREST}/${urls.TOP}`, data] : null;

  return useApi<BaseResponse<StatisticalTop10Fabric[]>>(
    key ? JSON.stringify(key) : null,
    {
      requireAuth: true,
      fetcher: () =>
        fetchClient<BaseResponse<StatisticalTop10Fabric[]>>(
          `/${urls.INTEREST}/${urls.TOP}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            requireAuth: true,
          }
        ),
    }
  );
}

export function useGetTop10Customer(data: StatisticalTop10CustomerRequest) {
  const key = data ? [`/${urls.INTEREST}/${urls.CUSTOMER_TOP}`, data] : null;

  return useApi<BaseResponse<StatisticalTop10Customer[]>>(
    key ? JSON.stringify(key) : null,
    {
      requireAuth: true,
      fetcher: () =>
        fetchClient<BaseResponse<StatisticalTop10Customer[]>>(
          `/${urls.INTEREST}/${urls.CUSTOMER_TOP}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            requireAuth: true,
          }
        ),
    }
  );
}

export function useGetFabricCompare(data: FabricCompareRequestType) {
  const key = data ? [`/${urls.INTEREST}/${urls.FABRIC_CHART}`, data] : null;

  return useApi<BaseResponse<StatisticalFabricCompareResponse[]>>(
    key ? JSON.stringify(key) : null,
    {
      requireAuth: true,
      fetcher: () =>
        fetchClient<BaseResponse<StatisticalFabricCompareResponse[]>>(
          `/${urls.INTEREST}/${urls.FABRIC_CHART}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            requireAuth: true,
          }
        ),
    }
  );
}
