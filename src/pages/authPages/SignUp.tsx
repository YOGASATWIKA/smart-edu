import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up | SmartEdu"
        description="Create an account to get started."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
