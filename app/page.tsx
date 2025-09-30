"use client";

import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import { DatePicker, DatePickerProps, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import FabricScannedItem from "@/components/FabricScannedItem";
import toast from "react-hot-toast";

const styles = {
  controls: {
    marginBottom: 8,
    display: "flex",
    gap: 8,
  },
};

interface Customer {
  id: number;
  name: string;
}

interface ScannedItem {
  id: string;
  customer_id: number;
  customer_name: string;
  date: string;
  fabric: string;
  card_number: string;
  created_at: string;
}

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    number | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);

  const customers: Customer[] = [
    { id: 1, name: "Sang" },
    { id: 2, name: "Quang" },
    { id: 3, name: "Tâm" },
    { id: 4, name: "Jeffery" },
    { id: 5, name: "Ming" },
    { id: 6, name: "Nguyên" },
    { id: 7, name: "Huy" },
    { id: 8, name: "Chung" },
  ];

  const devices = useDevices();

  function getTracker() {
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
  }

  const handleScan = async (data: string) => {
    if (selectedCustomer === undefined) {
      toast.error("Please select a customer before scanning.");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date before scanning.");
      return;
    }

    setPause(true);
    try {
      const customer = customers.find((c) => c.id === selectedCustomer);

      const isExist = scannedData.some((item) => item.fabric === data);
      if (isExist) {
        toast(`Code "${data}" already exists. Skipping.`, {
          icon: "⚠️",
        });
        return;
      }

      const newItem: ScannedItem = {
        id: String(scannedData.length + 1),
        customer_id: selectedCustomer,
        customer_name: customer?.name ?? "Unknown",
        date: selectedDate.format("YYYY-MM-DD"),
        fabric: data ?? "N/A",
        card_number: "B25098",
        created_at: new Date().toISOString(),
      };

      setScannedData((prev) => [...prev, newItem]);
      toast.success("Scanned successfully!");
    } catch (error) {
      toast.error("An error occurred while scanning.");
      console.error(error);
    } finally {
      setPause(false);
    }
  };

  const onChange: DatePickerProps["onChange"] = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      {/* Controls */}
      <div
        style={styles.controls}
        className="flex flex-wrap items-center gap-2"
      >
        <Select
          placeholder="Select a device"
          style={{ width: 180 }}
          value={deviceId}
          onChange={(value) => setDeviceId(value)}
          options={devices.map((device) => ({
            value: device.deviceId,
            label: device.label,
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
            { value: undefined, label: "No Tracker" },
          ]}
        />

        <Select<number>
          placeholder="Select a customer"
          style={{ width: 180 }}
          value={selectedCustomer}
          onChange={(value) => setSelectedCustomer(value)}
          options={customers.map((cus) => ({
            value: cus.id,
            label: cus.name,
          }))}
        />

        <DatePicker
          value={selectedDate}
          onChange={onChange}
          maxDate={dayjs()}
          format={"YYYY-MM-DD"}
        />
      </div>

      {/* Scanner */}
      <div className="flex items-center justify-center">
        <Scanner
          formats={[
            "qr_code",
            "micro_qr_code",
            "rm_qr_code",
            "maxi_code",
            "pdf417",
            "aztec",
            "data_matrix",
            "matrix_codes",
            "dx_film_edge",
            "databar",
            "databar_expanded",
            "codabar",
            "code_39",
            "code_93",
            "code_128",
            "ean_8",
            "ean_13",
            "itf",
            "linear_codes",
            "upc_a",
            "upc_e",
          ]}
          constraints={{ deviceId }}
          onScan={(detectedCodes) => {
            if (detectedCodes.length > 0) {
              handleScan(detectedCodes[0].rawValue);
            }
          }}
          onError={(error) => {
            console.log(`onError: ${error}`);
          }}
          styles={{ container: { height: "400px", width: "350px" } }}
          components={{
            onOff: true,
            torch: true,
            zoom: true,
            finder: true,
            tracker: getTracker(),
          }}
          allowMultiple={true}
          scanDelay={2000}
          paused={pause || selectedCustomer === undefined || !selectedDate}
        />
      </div>

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
    </div>
  );
}
