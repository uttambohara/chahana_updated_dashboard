export const userRole = ["CUSTOMER", "CUSTOMER"];
export const DEBOUNCE_DELAY = 300;
export const USERS_PARAM_BASIC = "/admin/users";
export const PER_PAGE = 10;
export const VENDOR_PRODUCT_PARAM = "/vendor/product";
export const ADMIN_PRODUCT_PARAM = "/admin/product_list";
export const VENDOR_ORDER_PARAM = "/vendor/order";
export const VENDOR_CUSTOMERS_PARAM = "/vendor/customers";
export const SHIPPING_CHARGE = 100;
export const TAXES = 10;
export const GLOBAL_DISCOUNT = 0;
export const ORDER_STATUS = [
  "ALL",
  "PENDING",
  "REFUNDED",
  "CANCELED",
  "COMPLETED",
] as const;

export const PAYMENT_METHOD = [
  "CASH",
  "CARD",
  "ESEWA",
  "CONNECT_IPS",
  "CASH ON DELIVERY",
] as const;
