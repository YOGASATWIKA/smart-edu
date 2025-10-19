import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Login from "../../components/auth/login.tsx";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | SmartEdu"
        description="Sign in to access your dashboard."
      />
      <AuthLayout>
        <Login />
      </AuthLayout>
    </>
  );
}