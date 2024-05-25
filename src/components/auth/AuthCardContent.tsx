import { CardContent } from "@/components/ui/card";
import React from "react";

interface AuthCardContentProps {
  children: React.ReactNode;
}

export default function AuthCardContent({ children }: AuthCardContentProps) {
  return <CardContent>{children}</CardContent>;
}
