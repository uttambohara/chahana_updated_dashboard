import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/form/RegisterForm";

export default function LoginPage() {
  return (
    <AuthCard
      cardTitle={"Create an account"}
      cardDescription={"Enter your information below to sign up."}
      form={<RegisterForm hasSocialLink={true} hasFooterLink={true} />}
    />
  );
}
