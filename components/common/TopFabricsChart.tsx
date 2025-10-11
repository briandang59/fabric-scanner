"use client";

import { useState, useMemo } from "react";
import dynamicComponent from "next/dynamic";
import { useGetTop10Fabric } from "@/lib/swr/useStatistical";
import { Card, Spin, Empty, DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { ApexOptions } from "apexcharts";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";

const { RangePicker } = DatePicker;
const Chart = dynamicComponent(() => import("react-apexcharts"), {
  ssr: false,
});

type RangeValue = [Dayjs | null, Dayjs | null] | null;

function TopFabricsChart() {
  const { t } = useTranslationCustom();

  // SỬA Ở ĐÂY: Mặc định là tháng hiện tại
  const [dates, setDates] = useState<RangeValue>([
    dayjs().startOf("month"), // Ngày đầu của tháng này
    dayjs().endOf("month"), // Ngày cuối của tháng này
  ]);

  const { data: top10DataFabric, isLoading: isLoadingTop10Fabric } =
    useGetTop10Fabric({
      fromDate: dates?.[0]?.format("YYYY-MM-DD") || "",
      toDate: dates?.[1]?.format("YYYY-MM-DD") || "",
    });

  const chartData = useMemo(() => {
    const labels = top10DataFabric?.data?.map((item) => item.fabric) || [];
    const seriesData = top10DataFabric?.data?.map((item) => item.total) || [];

    const options: ApexOptions = {
      chart: { type: "bar", toolbar: { show: true } },
      plotOptions: {
        bar: { borderRadius: 4, horizontal: true, barHeight: "60%" },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: labels,
        title: { text: t.statistical.quantity },
      },
      tooltip: { y: { formatter: (val) => `${val}` } },
      grid: { borderColor: "#f1f1f1" },
    };

    const series = [{ name: t.statistical.quantity, data: seriesData }];

    return { options, series };
  }, [top10DataFabric, t]);

  return (
    <Card
      title={t.statistical.top_sell_fabric}
      bordered={false}
      extra={<RangePicker value={dates} onChange={setDates} />}
    >
      <Spin spinning={isLoadingTop10Fabric}>
        {top10DataFabric?.data && top10DataFabric.data.length > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
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
      </Spin>
    </Card>
  );
}

export default TopFabricsChart;
