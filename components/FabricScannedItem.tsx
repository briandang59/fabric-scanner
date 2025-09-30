import dayjs from "dayjs";

interface FabricScannedItemProps {
  id: string;
  customer_id: number;
  date: string;
  fabric: string;
  card_number: string;
  created_at: string;
}

function FabricScannedItem(props: FabricScannedItemProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-semibold text-gray-600">ID:</span>
        <span>{props.id}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-gray-600">Customer:</span>
        <span>{props.customer_id}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-gray-600">Date:</span>
        <span>{props.date}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-gray-600">Fabric:</span>
        <span>{props.fabric}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-gray-600">Card #:</span>
        <span>{props.card_number}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-gray-600">Created At:</span>
        <span>{dayjs(props.created_at).format("YYYY/MM/DD HH:mm")}</span>
      </div>
    </div>
  );
}

export default FabricScannedItem;
