import {
  CameraIcon,
  HomeIcon,
  ListOrdered,
  Package,
  PackageCheck,
  PackageIcon,
  Settings,
  Tag,
  User,
  UsersIcon,
} from "lucide-react";

export const AdminNavList = [
  {
    id: 1,
    item: "Home",
    link: "/",
    icon: <HomeIcon size={18} />,
    subList: [],
  },
  {
    id: 2,
    item: "Category",
    link: "/admin/category",
    icon: <PackageIcon size={18} />,
    subList: [],
  },
  {
    id: 3,
    item: "Sub Category",
    link: "/admin/sub_category",
    icon: <PackageCheck size={18} />,
    subList: [],
  },
  {
    id: 4,
    item: "Billboard",
    link: "/admin/billboard",
    icon: <CameraIcon size={18} />,
    subList: [],
  },
  {
    id: 5,
    item: "Users",
    link: "/admin/users",
    icon: <UsersIcon size={18} />,
    subList: [],
  },
  {
    id: 6,
    item: "Settings",
    link: "/admin/settings",
    icon: <Settings size={18} />,
    subList: [],
  },
  {
    id: 7,
    item: "Product list",
    link: "/admin/product_list",
    icon: <Tag size={18} />,
    subList: [],
  },
];

export const VendorNavList = [
  {
    id: 1,
    item: "Home",
    link: "/",
    icon: <HomeIcon size={18} />,
    subList: [],
  },
  {
    id: 2,
    item: "Product",
    link: "/vendor/product",
    icon: <Package size={18} />,
    subList: [],
  },
  {
    id: 3,
    item: "Order",
    link: "/vendor/order",
    icon: <ListOrdered size={18} />,
    subList: [],
  },
  {
    id: 4,
    item: "Customers",
    link: "/vendor/customers",
    icon: <User size={18} />,
    subList: [],
  },
];
