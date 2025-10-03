export type InterestFabricRequestType = {
  cardNumber: string;
  fabric: string;
  customerId: string;
  date: string;
};

export type InterestGetRequestType = {
  fabric?: string;
  customer_id?: string;
  fromDate?: string;
  toDate?: string;
};
