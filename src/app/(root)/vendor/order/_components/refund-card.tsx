"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { X } from "lucide-react";
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

  function handleCancelOrder(type: "PENDING" | "CANCELED") {
    setCancelOrRefund(type);
    startTransition(async () => {
      await updateOrderStatusByOrderId(orderId, type);
      form.reset();
      router.refresh();
      toast.success("Order status has been canceled!");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund</CardTitle>
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
