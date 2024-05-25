import clsx from "clsx";

export default function FullfillmentIcon({ status }: { status: string }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 w-[6rem] rounded-full font-bold p-1 text-xs pl-2.5",
        {
          "text-yellow-700 bg-yellow-50": status === "PENDING",
          "text-orange-700 bg-orange-50": status === "REFUNDED",
          "text-red-700 bg-red-50": status === "CANCELED",
          "text-green-700 bg-green-50": status === "COMPLETED",
        }
      )}
    >
      {status}
    </div>
  );
}
