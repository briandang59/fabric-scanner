export type StatisticalTop10Fabric = {
  fabric: string;
  total: number;
};

export type StatisticalTop10Customer = {
  customer: {
    id: string;
    created_at: string;
    customer_name: string;
  };
  top10: StatisticalTop10Fabric[];
};

export type StatisticalFabricCompareResponse = {
  fabric: string;
  data: {
    period: string;
    total: number;
  }[];
};
