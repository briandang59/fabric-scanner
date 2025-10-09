"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import nextDynamic from "next/dynamic";
import dayjs, { Dayjs } from "dayjs";
import FabricScannedItem from "@/components/common/FabricScannedItem";
import toast from "react-hot-toast";
import { Select, Tabs, DatePicker, Spin, Modal, Button } from "antd";
import type { TabsProps } from "antd";
import { ClipboardList, ScanLine, Plus } from "lucide-react";
import {
  useDevices,
  centerText,
  type IDetectedBarcode,
  type TrackFunction,
} from "@yudiel/react-qr-scanner";
import { useCustomer } from "@/lib/swr/useCustomer";
import { CustomerResponseType } from "@/types/responses/customer";
import { useInterest } from "@/lib/swr/useInterest";
import { APIS } from "@/lib/apis";
import { InterestFabricRequestType } from "@/types/requests/interest";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import CustomerForm from "@/components/forms/CustomerForm";

const Scanner = nextDynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false }
);

export default function FabricScan() {
  const { cardNumber } = useAuthStore();
  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    mutate: mutateCustomer,
  } = useCustomer();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    customerData?.data?.[0]?.id ? customerData.data[0].id : null
  );
  const { t } = useTranslationCustom();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const [isModalOpen, setIsModalOpen] = useState(false);

  const devices = useDevices();
  const deviceId = devices[0]?.deviceId;
  const tracker: TrackFunction = centerText;
  const {
    data: interestData,
    isLoading: isLoadingInterest,
    mutate: mutateInterest,
  } = useInterest({
    customer_id: "",
    fabric: "",
    fromDate: selectedDate.format("YYYY-MM-DD"),
    toDate: selectedDate.format("YYYY-MM-DD"),
  });

  const selectedCustomerIdRef = useRef<string | null>(null);
  const selectedDateRef = useRef<Dayjs>(selectedDate);
  useEffect(() => {
    selectedCustomerIdRef.current = selectedCustomerId;
    selectedDateRef.current = selectedDate;
  }, [selectedCustomerId, selectedDate]);

  const handleScan = useCallback(
    async (data: string) => {
      const customerId = selectedCustomerIdRef.current;
      const date = selectedDateRef.current;
      if (!customerId) {
        toast.error(t.toast.selected_cus);
        return;
      }
      if (!date) {
        toast.error(t.toast.selected_date);
        return;
      }
      if (!cardNumber) {
        toast.error(t.toast.card_number);
        return;
      }

      const normalizedData = data.trim().toUpperCase();

      const isDuplicated = interestData?.data?.some(
        (item) =>
          item.customer_id === customerId &&
          dayjs(item.date).isSame(date, "day") &&
          item.fabric.toUpperCase() === normalizedData
      );

      if (isDuplicated) {
        toast.error(t.toast.duplicate_fabric);
        return;
      }

      const payload: InterestFabricRequestType = {
        cardNumber,
        customerId: customerId,
        date: dayjs(date).format("YYYY-MM-DD"),
        fabric: normalizedData,
      };

      await toast.promise(APIS.customer.interest(payload), {
        loading: t.toast.loading,
        success: () => t.toast.successed,
        error: (err) =>
          err instanceof Error
            ? `${t.toast.err} ${err.message}`
            : t.toast.failed,
      });
    },
    [cardNumber, interestData, t]
  );

  const handleDelete = async (id: string) => {
    await toast.promise(APIS.customer.deleteInterest({ id }), {
      loading: t.toast.loading,
      success: (res) => {
        if (res) mutateInterest();
        return t.toast.successed;
      },
      error: (err) =>
        err instanceof Error ? `${t.toast.err} ${err.message}` : t.toast.failed,
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <ScanLine size={16} />
          <span>{t.fabric_scan.scan}</span>
        </span>
      ),
      children: (
        <div>
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
          <span>{t.fabric_scan.result}</span>
        </span>
      ),
      children: (
        <div className="mt-6 flex flex-col gap-4">
          {isLoadingInterest ? (
            <div className="flex justify-center items-center py-6">
              <Spin size="large" />
            </div>
          ) : (
            interestData &&
            [...interestData?.data]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((item) => (
                <FabricScannedItem
                  key={item.id}
                  {...item}
                  onDelete={handleDelete}
                />
              ))
          )}
        </div>
      ),
    },
  ];
  //

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Select
          placeholder={t.fabric_scan.choose_cus}
          loading={isLoadingCustomer}
          style={{ width: 200 }}
          value={selectedCustomerId}
          onChange={(value) => {
            setSelectedCustomerId(value);
          }}
          options={customerData?.data?.map((c: CustomerResponseType) => ({
            value: c.id,
            label: c.customer_name,
          }))}
        />

        <Button
          type="dashed"
          icon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        ></Button>

        <DatePicker
          value={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          disabledDate={(current) => current && current > dayjs().endOf("day")}
          format="YYYY-MM-DD"
          style={{ width: 200 }}
        />
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={(key) => {
          if (key === "2") {
            mutateInterest();
          }
        }}
      />

      <Modal
        title={t.fabric_scan.create_cus}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <CustomerForm
          refetch={() => {
            mutateCustomer();
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
