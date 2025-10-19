import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Register from "../../components/auth/register.tsx";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up | SmartEdu"
        description="Create an account to get started."
      />
      <AuthLayout>
        <Register />
      </AuthLayout>
    </>
  );
}
