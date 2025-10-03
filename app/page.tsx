"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import nextDynamic from "next/dynamic";
import dayjs from "dayjs";
import FabricScannedItem from "@/components/common/FabricScannedItem";
import toast from "react-hot-toast";
import { Select, Tabs } from "antd";
import type { TabsProps } from "antd";
import { ClipboardList, ScanLine } from "lucide-react";
import {
  useDevices,
  outline,
  boundingBox,
  centerText,
  type IDetectedBarcode,
  type TrackFunction,
} from "@yudiel/react-qr-scanner";

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

export default function Home() {
  const [deviceId, setDeviceId] = useState<string>();
  const [tracker, setTracker] = useState<string>("centerText");
  const [pause] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);

  const devices = useDevices();

  const getTracker: TrackFunction | undefined = useMemo(() => {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }, [tracker]);

  const handleScan = (data: string) => {
    const normalizedData = data.trim().toUpperCase();

    setScannedData((prev) => {
      if (prev.some((item) => item.fabric === normalizedData)) {
        toast(`Code "${normalizedData}" already exists. Skipping.`, {
          icon: "⚠️",
        });
        return prev;
      }
      return [
        ...prev,
        {
          id: prev.length + 1,
          customer_id: "2",
          customer_name: "Quang",
          date: dayjs().format("YYYY-MM-DD"),
          fabric: normalizedData,
          card_number: "B25098",
          created_at: new Date().toISOString(),
        },
      ];
    });
    toast.success("Scanned successfully!");
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
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Select
              placeholder="Select a device"
              style={{ width: 180 }}
              value={deviceId}
              onChange={(value) => setDeviceId(value)}
              options={devices.map((d) => ({
                value: d.deviceId,
                label: d.label,
              }))}
            />

            <Select
              placeholder="Select tracker"
              style={{ width: 180 }}
              value={tracker}
              onChange={(value) => setTracker(value)}
              options={[
                { value: "centerText", label: "Center Text" },
                { value: "outline", label: "Outline" },
                { value: "boundingBox", label: "Bounding Box" },
                { value: "none", label: "No Tracker" },
              ]}
            />
          </div>

          <div className="flex justify-center">
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
              onError={(error) => console.error("Scanner error:", error)}
              styles={{ container: { height: "400px", width: "350px" } }}
              components={{
                onOff: true,
                torch: true,
                zoom: true,
                finder: true,
                tracker: getTracker,
              }}
              allowMultiple
              scanDelay={5000}
              paused={pause}
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
          <span>Results</span>
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
