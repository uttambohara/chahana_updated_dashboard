"use client";

import { createPayment } from "@/actions/supabase/supabase-db";
import CustomModal from "@/components/CustomModal";
import LoaderEl from "@/components/LoaderEl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHOD } from "@/lib/constant";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { coerce, z } from "zod";

const formSchema = z.object({
  payment: coerce.number().positive({
    message: "Price must be greater than 0",
  }),
  mode: z.enum(PAYMENT_METHOD),
});

type FormSchema = z.infer<typeof formSchema>;

interface DropDownActionProps {
  invoice_id?: number | null;
  customer_id: number | null;
  order_id: number;
  totalAmount: number;
  paid: number;
}

export default function DropDownAction({
  invoice_id,
  customer_id,
  order_id,
  totalAmount,
  paid,
}: DropDownActionProps) {
  const { setOpen, setClose } = useModal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  console.log(totalAmount, paid);
  const remainingAmount = totalAmount - paid;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment: 0,
      mode: "CASH",
    },
  });

  function onSubmit(values: FormSchema) {
    if (remainingAmount === 0)
      return toast.error("Entire amount has already been paid!");
    if (remainingAmount < values.payment)
      return toast.error(
        `The payment amount exceeds ${formatCurrencyToNPR(
          remainingAmount
        )} remaining amount!`
      );

    startTransition(async () => {
      const paymentObj = {
        amount: values.payment!,
        customer_id,
        invoice_id,
        paid_at: new Date().toISOString(),
        method: values.mode,
        order_id,
      };

      const paymentJSON = await createPayment(paymentObj);

      const { payment, error } = JSON.parse(paymentJSON);
      if (error) {
        toast.error(JSON.stringify(error));
      }
      router.refresh();
      toast.success("Payment created!");
      setClose();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="gap-2"
          disabled={Math.floor(remainingAmount) <= 0}
          onClick={() =>
            setOpen(
              <CustomModal title={"Update payment"}>
                <h2 className="text-xl mb-4 text-zinc-400">
                  Remaining amount {formatCurrencyToNPR(remainingAmount)}
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="payment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Payment..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Update the received payment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Payment mode"
                                  className="!text-zinc-400"
                                />
                              </SelectTrigger>
                              <SelectContent className="text-zinc-400">
                                {PAYMENT_METHOD.map((pymt) => (
                                  <SelectItem value={pymt} key={pymt}>
                                    {pymt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="gap-2 mt-4 ml-auto"
                      >
                        {" "}
                        {isPending && <LoaderEl />}Update payment
                      </Button>
                    </div>
                  </form>
                </Form>
              </CustomModal>
            )
          }
        >
          <Coins size={18} />
          Receive payment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
