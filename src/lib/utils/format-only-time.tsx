import { format } from "date-fns";

export default function onlyTimeFormat(date: string) {
  return format(date, "hh:mm a");
}
