import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ResetPassword from "../../components/auth/ResetPassword.tsx";

export default function ResetPasswordPage() {
    return (
        <>
            <PageMeta
                title="Reset Password | SmartEdu"
                description="Reset Password"
            />
            <AuthLayout>
                <ResetPassword />
            </AuthLayout>
        </>
    );
}