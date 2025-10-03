import { InterestResponseType } from "@/types/responses/interest";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { Button, Popconfirm } from "antd";
import { Trash } from "lucide-react";

interface Props extends InterestResponseType {
  onDelete?: (id: string) => void;
}

export default function FabricScannedItem({ onDelete, ...props }: Props) {
  const { t } = useTranslationCustom();
  return (
    <div className="p-3 border rounded-lg shadow-sm bg-white flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-800">
          #{props.id.slice(0, 6)} - {props.fabric}
        </p>
        <p className="text-sm text-gray-600">
          {props.customer_name} • {props.card_number}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(props.created_at).toLocaleString()} | {props.date}
        </p>
      </div>

      <Popconfirm
        title={t.fabric_scan.title_confirm}
        description={t.fabric_scan.des_confirm}
        okText={t.fabric_scan.delete}
        cancelText={t.fabric_scan.cancel}
        okButtonProps={{ danger: true }}
        onConfirm={() => onDelete?.(props.id)}
      >
        <Button type="text" danger icon={<Trash />} />
      </Popconfirm>
    </div>
  );
}
