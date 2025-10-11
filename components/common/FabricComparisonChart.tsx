"use client";

import { useState, useMemo } from "react";
import dynamicComponent from "next/dynamic";
import { useFabrics } from "@/lib/swr/useFabric";
import { useGetFabricCompare } from "@/lib/swr/useStatistical";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Empty,
  Select,
  Space,
  DatePicker, // << THÊM: Import DatePicker
} from "antd";
import toast from "react-hot-toast";
import type { ApexOptions } from "apexcharts";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import dayjs from "dayjs"; // << THÊM: Import dayjs
import type { Dayjs } from "dayjs"; // << THÊM: Import kiểu Dayjs

const { Text } = Typography;
const { RangePicker } = DatePicker; // << THÊM: Destructure RangePicker
const Chart = dynamicComponent(() => import("react-apexcharts"), {
  ssr: false,
});

type Unit = "day" | "month" | "year" | "quarter"; // << SỬA: Thêm 'quarter' vào kiểu
type RangeValue = [Dayjs | null, Dayjs | null] | null; // << THÊM: Kiểu cho date range

function FabricComparisonChart() {
  const { t } = useTranslationCustom();
  const [compareUnit, setCompareUnit] = useState<Unit>("year");
  const [compareFabricIds, setCompareFabricIds] = useState<string[]>([
    "W219005",
  ]);

  // THÊM: State để quản lý khoảng ngày, mặc định là năm nay
  const [dateRange, setDateRange] = useState<RangeValue>([
    dayjs().startOf("year"), // Ngày đầu tiên của năm nay
    dayjs().endOf("year"), // Ngày cuối cùng của năm nay
  ]);

  const { data: fabricCompareData, isLoading: isLoadingFabricCompareData } =
    useGetFabricCompare({
      // SỬA: Sử dụng dateRange từ state thay vì hardcode
      fromDate: dateRange?.[0]?.format("YYYY-MM-DD") || "",
      toDate: dateRange?.[1]?.format("YYYY-MM-DD") || "",
      unit: compareUnit,
      fabricIds: compareFabricIds,
    });

  const { data: fabricData, isLoading: isLoadingFabricList } = useFabrics();

  const chartData = useMemo(() => {
    if (!fabricCompareData?.data || fabricCompareData.data.length === 0) {
      return { options: {}, series: [] };
    }
    const series = fabricCompareData.data.map((fab) => ({
      name: fab.fabric,
      data: fab.data.map((d) => d.total),
    }));
    const categories =
      fabricCompareData.data[0]?.data.map((d) => d.period) || [];
    const options: ApexOptions = {
      chart: {
        type: "area",
        stacked: false,
        zoom: { type: "x", enabled: true, autoScaleYaxis: true },
        toolbar: { autoSelected: "zoom" },
      },
      dataLabels: { enabled: false },
      markers: { size: 5 },
      title: { text: t.statistical.change_by_time, align: "left" },
      yaxis: {
        title: { text: t.statistical.quantity },
        labels: { formatter: (val) => val.toFixed(0) },
      },
      xaxis: {
        categories,
        title: { text: `${t.statistical.time}` },
      },
      tooltip: { shared: true },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
    };
    return { options, series };
  }, [fabricCompareData, t]);

  const handleCompareFabricChange = (newValue: string[]) => {
    if (newValue.length > 10) {
      // Lưu ý: nên dịch cả chuỗi thông báo này
      toast.error(`${t.toast.warning_choose_fanric}`);
    } else {
      setCompareFabricIds(newValue);
    }
  };

  return (
    <Card title={t.statistical.compare_quantity_fabric} variant="outlined">
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} md={12} lg={8}>
            <Text>{t.statistical.limit_fabric_selected}:</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              value={compareFabricIds}
              onChange={handleCompareFabricChange}
              loading={isLoadingFabricList}
              options={fabricData?.data?.map((fab) => ({
                label: fab.fabric,
                value: fab.fabric,
              }))}
            />
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Text>{t.statistical.unit_time}</Text>
            <Select
              value={compareUnit}
              style={{ width: "100%" }}
              onChange={(value: Unit) => setCompareUnit(value)}
              options={[
                { value: "month", label: t.statistical.month },
                { value: "quarter", label: t.statistical.quarter },
                { value: "year", label: t.statistical.year },
              ]}
            />
          </Col>
          {/* THÊM: Bộ chọn khoảng ngày */}
          <Col xs={24} md={24} lg={10}>
            <Text>{t.statistical.time}:</Text>
            <RangePicker
              style={{ width: "100%" }}
              value={dateRange}
              onChange={(values) => setDateRange(values)}
            />
          </Col>
        </Row>
      </Space>
      <Spin spinning={isLoadingFabricCompareData}>
        {fabricCompareData?.data && fabricCompareData.data.length > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={400}
          />
        ) : (
          <Empty
            description={t.statistical.no_data}
            style={{
              height: 400,
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

export default FabricComparisonChart;
