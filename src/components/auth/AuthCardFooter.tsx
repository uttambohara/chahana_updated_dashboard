import { CardFooter } from "@/components/ui/card";
import AuthCardSubmitButton from "./AuthCardSubmitButton";
import AuthCardFooterLink from "./AuthCardFooterLink";

interface AuthCardFooterProps {
  authType: "Sign up" | "Sign in";
  hasFooterLink: boolean;
  // Optional
  footerLinkMsg?: string;
  footerLink?: string;
  linkType?: "Sign up" | "Sign in";
  isPending: boolean;
}

export default function AuthCardFooter({
  authType,
  footerLinkMsg,
  footerLink,
  linkType,
  isPending,
  hasFooterLink,
}: AuthCardFooterProps) {
  return (
    <CardFooter className="flex-col p-0">
      <AuthCardSubmitButton authType={authType} isPending={isPending} />

      {hasFooterLink && (
        <AuthCardFooterLink
          message={footerLinkMsg!}
          link={footerLink!}
          reqAuthType={linkType!}
        />
      )}
    </CardFooter>
  );
}
