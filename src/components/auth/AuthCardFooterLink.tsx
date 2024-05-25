import Link from "next/link";
import React from "react";

interface AuthCardFooterLinkProps {
  message: string;
  link: string;
  reqAuthType: "Sign in" | "Sign up";
}

export default function AuthCardFooterLink({
  message,
  link,
  reqAuthType,
}: AuthCardFooterLinkProps) {
  return (
    <div className="mt-4 text-center text-sm">
      {message}{" "}
      <Link className="underline" href={link}>
        {reqAuthType}
      </Link>
    </div>
  );
}
