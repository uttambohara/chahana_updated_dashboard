"use client";

import { updateOrderStatusByOrderId } from "@/actions/supabase/supabase-db";
import LoaderEl from "@/components/LoaderEl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/lib/constant";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface RefundCardProps {
  orderId: number;
  paidStatus: boolean;
  status: OrderStatusWithoutAll;
}

export type OrderStatusType = (typeof ORDER_STATUS)[number];
export type OrderStatusWithoutAll = Exclude<OrderStatusType, "ALL">;

export default function CreateFulfillment({
  orderId,
  paidStatus,
  status,
}: RefundCardProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleOrderFulfillment() {
    startTransition(async () => {
      await updateOrderStatusByOrderId(orderId, "COMPLETED");
      router.refresh();
      toast.success("Order fulfilled!");
    });
  }

  console.log(paidStatus);

  if (paidStatus)
    return (
      <Button
        onClick={handleOrderFulfillment}
        disabled={status === "COMPLETED"}
      >
        {status !== "COMPLETED" ? "Fulfill order" : "Already fulfilled"}
      </Button>
    );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          disabled={isPending || !paidStatus}
          className="gap-2 cursor-pointer"
        >
          {isPending && <LoaderEl />}
          Fulfill order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Payment pending. Confirm fulfilling order?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500"
            onClick={handleOrderFulfillment}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
