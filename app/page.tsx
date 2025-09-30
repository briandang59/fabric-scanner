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



interface ScannedItem {
  id: number;
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

  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);



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


    setPause(true);
    try {

      const isExist = scannedData.find((item) => item.fabric === data);
      if (isExist) {
        toast(`Code "${data}" already exists. Skipping.`, {
          icon: "⚠️",
        });
        return;
      }

      const newItem: ScannedItem = {
        id: scannedData.length + 1,
        customer_id: 2,
        customer_name:  "Quang",
        date: dayjs().format("YYYY-MM-DD"),
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


  return (
    <div>
      <div
        style={styles.controls}
        className="flex flex-wrap items-center gap-2"
      >
        <Select
          placeholder="Select a device"
          style={{ width: 150 }}
          value={deviceId}
          onChange={(value) => setDeviceId(value)}
          options={devices.map((device) => ({
            value: device.deviceId,
            label: device.label,
          }))}
        />

        <Select
          placeholder="Select tracker"
          style={{ width: 150 }}
          value={tracker}
          onChange={(value) => setTracker(value)}
          options={[
            { value: "centerText", label: "Center Text" },
            { value: "outline", label: "Outline" },
            { value: "boundingBox", label: "Bounding Box" },
            { value: undefined, label: "No Tracker" },
          ]}
        />

      </div>

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
          paused={pause}
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
