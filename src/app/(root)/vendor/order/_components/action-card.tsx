"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useState, useTransition } from "react";
import { toast } from "sonner";

export type OrderStatusType = (typeof ORDER_STATUS)[number];
export type OrderStatusWithoutAll = Exclude<OrderStatusType, "ALL">;

interface ActionCardProps {
  orderId: number;
  status: OrderStatusWithoutAll;
}

const formSchema = z.object({
  refundReason: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ActionCard({ orderId, status }: ActionCardProps) {
  const router = useRouter();
  const [cancelOrRefund, setCancelOrRefund] =
    useState<OrderStatusWithoutAll | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refundReason: "",
    },
  });

  function handleOrderAction(type: "PENDING" | "CANCELED") {
    setCancelOrRefund(type);
    startTransition(async () => {
      await updateOrderStatusByOrderId(orderId, type);
      form.reset();
      router.refresh();
      toast.success(`Order status has been ${type}!`);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"outline"}
            className="hover:text-red-300 hover:bg-transparent text-red-500"
            type="button"
            disabled={isPending && cancelOrRefund === "CANCELED"}
          >
            {isPending && cancelOrRefund === "CANCELED" && <LoaderEl />}
            Cancel order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This action will cancel the order of
              the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={status === "CANCELED"}
              className="bg-red-500"
              onClick={() => handleOrderAction("CANCELED")}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        disabled={
          (isPending && cancelOrRefund === "PENDING") || status === "PENDING"
        }
        onClick={() => handleOrderAction("PENDING")}
      >
        {isPending && cancelOrRefund === "PENDING" && <LoaderEl />}
        Revert
      </Button>
    </div>
  );
}
