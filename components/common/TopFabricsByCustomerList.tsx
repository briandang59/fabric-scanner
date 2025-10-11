"use client";

import { useState } from "react";
import { useGetTop10Customer } from "@/lib/swr/useStatistical";
import { Card, Spin, Empty, DatePicker, List, Avatar, Typography } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";

const { RangePicker } = DatePicker;
const { Text } = Typography;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

function TopFabricsByCustomerList() {
  const { t } = useTranslationCustom();

  // SỬA Ở ĐÂY: Mặc định là tháng hiện tại
  const [dates, setDates] = useState<RangeValue>([
    dayjs().startOf("month"), // Ngày đầu của tháng này
    dayjs().endOf("month"), // Ngày cuối của tháng này
  ]);

  const { data: top10DataCustomer, isLoading: isLoadingTop10Customer } =
    useGetTop10Customer({
      fromDate: dates?.[0]?.format("YYYY-MM-DD") || "",
      toDate: dates?.[1]?.format("YYYY-MM-DD") || "",
      customerId: "",
    });

  return (
    <Card
      title={t.statistical.top_sell_fabric_by_customer}
      bordered={false}
      extra={<RangePicker value={dates} onChange={setDates} />}
    >
      <Spin spinning={isLoadingTop10Customer}>
        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
          {top10DataCustomer?.data && top10DataCustomer.data.length > 0 ? (
            top10DataCustomer.data.map((customerData) => (
              <List
                key={customerData.customer.id}
                header={
                  <Text strong> {customerData.customer.customer_name}</Text>
                }
                dataSource={customerData.top10}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: "#1890ff" }}>
                          {index + 1}
                        </Avatar>
                      }
                      title={item.fabric}
                      description={`${t.statistical.quantity}: ${item.total}`}
                    />
                  </List.Item>
                )}
                style={{ marginBottom: "16px" }}
              />
            ))
          ) : (
            <Empty
              description={t.statistical.no_data}
              style={{
                height: 350,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          )}
        </div>
      </Spin>
    </Card>
  );
}

export default TopFabricsByCustomerList;
