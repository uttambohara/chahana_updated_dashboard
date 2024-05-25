"use client";

import { useRouter } from "next/navigation";
import queryString from "query-string";
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
} from "react";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { Search } from "lucide-react";

interface TableSearchInputProps extends ComponentPropsWithoutRef<"input"> {
  /**
   * Name to be shown in the search input
   * @default ""
   * @type string
   * @example user
   */
  filterBy: string;
  /**
   * Pathname where the query string will be attached
   * @default /
   * @type string
   * @example /admin/product
   */
  urlPathParam: string;
}

export default function TableSearchInput({
  filterBy,
  urlPathParam,
  ...other
}: TableSearchInputProps) {
  //...

  const router = useRouter();
  const { inputValue, setInputValue, searchResult } = useDebounce();
  const urlParam = urlPathParam;

  // Create query string
  const updateRoute = useMemo(() => {
    const qs = queryString.stringifyUrl(
      {
        url: `${urlParam}`,
        query: {
          title: searchResult,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    return qs;
  }, [searchResult, urlParam]);

  useEffect(() => {
    router.push(updateRoute);
  }, [updateRoute, router]);

  function handleInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return (
    <div className="relative w-[18rem]">
      <Input
        className="pl-8"
        {...other}
        placeholder={`Filter ${filterBy}...`}
        value={inputValue}
        onChange={handleInputValue}
      />
      <Search
        className="absolute left-2 top-2.5 text-muted-foreground"
        size={20}
      />
    </div>
  );
}
