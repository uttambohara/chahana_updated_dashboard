import { GLOBAL_DISCOUNT, SHIPPING_CHARGE, TAXES } from "@/lib/constant";

export const calculateRevenueTotal = (orderProducts: any[]) =>
  orderProducts.reduce((acc, orderProduct) => {
    const totalPrice =
      orderProduct.quantity * orderProduct.product?.salesPrice!;
    const discountPercent = orderProduct.product?.discount! / 100;
    const totalPriceAfterDiscountsAdj =
      totalPrice - discountPercent * totalPrice;
    return acc + totalPriceAfterDiscountsAdj;
  }, 0);

export const calculateSummary = (revenueTotal: number) => {
  const taxableAmount = revenueTotal;
  const tax = Number(((TAXES / 100) * taxableAmount).toFixed(2));
  const totalAmount = revenueTotal + SHIPPING_CHARGE - GLOBAL_DISCOUNT + tax;

  return {
    shippingCharge: SHIPPING_CHARGE,
    GLOBAL_DISCOUNT,
    tax,
    totalAmount,
  };
};
