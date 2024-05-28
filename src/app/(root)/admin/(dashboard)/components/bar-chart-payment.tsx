"use client";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartPayment {
  data: { type: string; total?: number; length?: number }[];
}

export default function BarChartPayments({ data }: BarChartPayment) {
  console.log(data);
  return (
    <ResponsiveContainer width={700} height="100%">
      <BarChart data={data} className="text-sm">
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrencyToNPR(Number(value))} />
        <Legend />
        <Bar dataKey="total" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
