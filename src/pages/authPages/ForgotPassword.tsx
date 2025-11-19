import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgotPassword from "../../components/auth/ForgotPassword.tsx";

export default function ForgotPasswordPage() {
    return (
        <>
            <PageMeta
                title="Forgot Password | SmartEdu"
                description="Forgot Passwrd"
            />
            <AuthLayout>
                <ForgotPassword />
            </AuthLayout>
        </>
    );
}