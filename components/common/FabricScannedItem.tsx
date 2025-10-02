import {ScannedItem} from "@/app/page";

export  default  function FabricScannedItem(props: ScannedItem) {
    return (
        <div className="p-3 border rounded-lg shadow-sm bg-white flex justify-between items-center">
            <div>
                <p className="font-semibold text-gray-800">#{props.id} - {props.fabric}</p>
                <p className="text-sm text-gray-600">
                    {props.customer_name} • {props.date}
                </p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
        OK
      </span>
        </div>
    );
}
