import { Card } from "@/components/ui/card";
import AuthCardContent from "./AuthCardContent";
import AuthCardHeader from "./AuthCardHeader";

interface AuthCardProps {
  cardTitle: string;
  cardDescription: string;
  form: React.ReactNode;
}

export default function AuthCard({
  cardTitle,
  cardDescription,
  form,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <AuthCardHeader title={cardTitle} description={cardDescription} />
      <AuthCardContent>{form}</AuthCardContent>
    </Card>
  );
}
