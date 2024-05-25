import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormHeaderProps {
  title: string;
  description: string;
}

export default function AuthCardHeader({
  title,
  description,
}: FormHeaderProps) {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
