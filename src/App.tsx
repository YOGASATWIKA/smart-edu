import { BrowserRouter as Router, Routes, Route } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';

import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";
import Home from "./pages/dashboard/Dashboard";
import Ebook from "./pages/ebook/Ebook";
import Document from "./pages/ebook/Document";
import Modul from "./pages/modul/Write";
import Model from "./pages/model/model"
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UpdateProfilePage from "./pages/authPages/UpdateProfile.tsx";
import ResetPasswordPage from "./pages/authPages/ResetPassword.tsx";
import ForgotPasswordPage from "./pages/authPages/ForgotPassword.tsx";

export default function App() {
  const googleClientId = "607532609795-lv0s840lkh5agfbplralb9t88bbkrtud.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route index path="/profile" element={<UpdateProfilePage />} />
                <Route path="/model" element={<Model />} />
                <Route path="/write" element={<Modul />} />
                <Route path="/document" element={<Document />} />
              <Route path="/ebook" element={<Ebook />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
