import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/form/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard
      cardTitle={"Sign in to your account"}
      cardDescription={
        "Enter your email and password below to access your account."
      }
      form={<LoginForm hasFooterLink={true} />}
    />
  );
}
