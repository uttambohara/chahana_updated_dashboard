"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PER_PAGE } from "@/lib/constant";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../button";

interface TableFooterPaginationProps {
  totalLength: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  urlPathParam: string;
}

export function TableFooterPagination({
  totalLength,
  hasPreviousPage,
  hasNextPage,
  urlPathParam,
}: TableFooterPaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const limit = searchParams.get("per_page") ?? PER_PAGE;
  const page = searchParams.get("page") ?? 1;

  function handleLimitSelection(e: string) {
    router.push(`${urlPathParam}/?per_page=${Number(e)}`);
  }

  function handlePreviousPage() {
    router.push(
      `${urlPathParam}/?page=${Number(page) - 1}&per_page=${Number(limit)}`
    );
  }
  function handleNextPage() {
    router.push(
      `${urlPathParam}/?page=${Number(page) + 1}&per_page=${Number(limit)}`
    );
  }
  return (
    <div className="flex items-center space-x-6 lg:space-x-8">
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select onValueChange={handleLimitSelection} defaultValue={"10"}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={!hasPreviousPage}
            onClick={handlePreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {page} of {Math.ceil(totalLength / Number(limit))}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPage}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
