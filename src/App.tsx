import { BrowserRouter as Router, Routes, Route } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Page Imports
import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";
import Home from "./pages/dashboard/Dashboard";
import Materi from "./pages/materi/Materi";
import Ebook from "./pages/ebook/Ebook";
import Modul from "./pages/modul/Modul";
// Layout & Component Imports
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  const googleClientId = "607532609795-lv0s840lkh5agfbplralb9t88bbkrtud.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
                <Route path="/modul" element={<Modul />} />
                <Route path="/document" element={<Materi />} />
              <Route path="/ebook" element={<Ebook />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
