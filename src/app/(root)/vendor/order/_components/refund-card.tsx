"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatusByOrderId } from "@/actions/supabase/supabase-db";
import LoaderEl from "@/components/LoaderEl";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ORDER_STATUS } from "@/lib/constant";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { MoreHorizontal, MoreVertical, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import firstLetterCapital from "@/lib/utils/first-letter-capital";

export type OrderStatusType = (typeof ORDER_STATUS)[number];
export type OrderStatusWithoutAll = Exclude<OrderStatusType, "ALL">;

interface RefundCardProps {
  orderId: number;
  status: OrderStatusWithoutAll;
}

const formSchema = z.object({
  refundReason: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function RefundCard({ orderId, status }: RefundCardProps) {
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

  function onSubmit(values: FormSchema) {
    setCancelOrRefund("REFUNDED");
    startTransition(async () => {
      await updateOrderStatusByOrderId(
        orderId,
        "REFUNDED",
        values.refundReason
      );
      form.reset();
      router.refresh();
      toast.success("Order status changed to refunded!");
    });
  }

  function handleOrderAction(type: "PENDING" | "CANCELED") {
    setCancelOrRefund(type);
    startTransition(async () => {
      await updateOrderStatusByOrderId(orderId, type);
      form.reset();
      router.refresh();
      toast.success(
        `Order status has been ${
          type === "PENDING" ? "reverted" : type.toLocaleLowerCase()
        }.`
      );
    });
  }

  return (
    <Card>
      <CardHeader className="justify-between flex-row">
        <CardTitle>Refund</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={isPending && cancelOrRefund === "CANCELED"}
              onClick={() => handleOrderAction("CANCELED")}
            >
              Cancel Order
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                (isPending && cancelOrRefund === "PENDING") ||
                status === "PENDING"
              }
              onClick={() => handleOrderAction("PENDING")}
            >
              {isPending && cancelOrRefund === "PENDING" && <LoaderEl />}
              Revert
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="refundReason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Reason (optional)..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="gap-2"
              disabled={
                (isPending && cancelOrRefund === "REFUNDED") ||
                status === "REFUNDED"
              }
            >
              {isPending && cancelOrRefund === "REFUNDED" && <LoaderEl />}
              <PaperPlaneIcon /> Refund
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
