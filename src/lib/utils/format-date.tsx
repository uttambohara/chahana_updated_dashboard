import { format } from "date-fns";

export default function dayMonthYearFormat(date: string) {
  return format(date, "dd LLLL yyyy");
}
