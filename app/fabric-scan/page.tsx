"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import nextDynamic from "next/dynamic";
import dayjs, { Dayjs } from "dayjs";
import FabricScannedItem from "@/components/common/FabricScannedItem";
import toast from "react-hot-toast";
import { Select, Tabs, DatePicker } from "antd";
import type { TabsProps } from "antd";
import { ClipboardList, ScanLine } from "lucide-react";
import {
  useDevices,
  centerText,
  type IDetectedBarcode,
  type TrackFunction,
} from "@yudiel/react-qr-scanner";
import { useCustomer } from "@/lib/swr/useCustomer";
import { CustomerResponseType } from "@/types/responses/customer";

const Scanner = nextDynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false }
);

export interface ScannedItem {
  id: number;
  customer_id: string;
  customer_name: string;
  date: string;
  fabric: string;
  card_number: string;
  created_at: string;
}

export default function FabricScan() {
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);
  const { data: customerData, isLoading: isLoadingCustomer } = useCustomer();

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResponseType | null>(null);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const devices = useDevices();
  const deviceId = devices[0]?.deviceId;
  const tracker: TrackFunction = centerText;

  const handleScan = (data: string) => {
    if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng trước khi quét!");
      return;
    }

    const normalizedData = data.trim().toUpperCase();

    setScannedData((prev: ScannedItem[]) => {
      if (prev.some((item) => item.fabric === normalizedData)) {
        toast(`Code "${normalizedData}" đã tồn tại, bỏ qua.`, { icon: "⚠️" });
        return prev;
      }

      return [
        ...prev,
        {
          id: prev.length + 1,
          customer_id: selectedCustomer.id,
          customer_name: selectedCustomer.customer_name,
          date: selectedDate.format("YYYY-MM-DD"),
          fabric: normalizedData,
          card_number: "B25098",
          created_at: new Date().toISOString(),
        },
      ];
    });

    toast.success("Quét thành công!");
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <ScanLine size={16} />
          <span>Scan</span>
        </span>
      ),
      children: (
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Select
              placeholder="Chọn khách hàng"
              loading={isLoadingCustomer}
              style={{ width: 200 }}
              onChange={(value) => {
                const customer = customerData?.data?.find(
                  (c: CustomerResponseType) => c.id === value
                );
                if (customer) setSelectedCustomer(customer);
              }}
              options={customerData?.data?.map((c: CustomerResponseType) => ({
                value: c.id,
                label: c.customer_name,
              }))}
            />

            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              format="YYYY-MM-DD"
            />
          </div>

          <div className="flex items-center justify-center">
            <Scanner
              formats={[
                "qr_code",
                "code_39",
                "code_93",
                "code_128",
                "ean_8",
                "ean_13",
                "upc_a",
                "upc_e",
              ]}
              constraints={{ deviceId }}
              onScan={(detectedCodes: IDetectedBarcode[]) => {
                if (detectedCodes.length > 0) {
                  handleScan(detectedCodes[0].rawValue);
                }
              }}
              onError={(error: unknown) => {
                console.error("onError:", error);
              }}
              styles={{ container: { height: "400px", width: "350px" } }}
              components={{
                onOff: true,
                torch: true,
                zoom: true,
                finder: true,
                tracker,
              }}
              allowMultiple
              scanDelay={5000}
              paused={false}
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <ClipboardList size={16} />
          <span>Kết quả</span>
        </span>
      ),
      children: (
        <div className="mt-6 flex flex-col gap-4">
          {[...scannedData]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((item) => (
              <FabricScannedItem key={item.id} {...item} />
            ))}
        </div>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}
