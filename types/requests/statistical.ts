export type StatisticalTop10Request = {
  fromDate: string;
  toDate: string;
};
export type StatisticalTop10CustomerRequest = StatisticalTop10Request & {
  customerId: string;
};

export type FabricCompareRequestType = {
  fabricIds: string[];
  fromDate: string;
  toDate: string;
  unit: string;
};
