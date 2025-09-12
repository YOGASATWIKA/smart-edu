import { BrowserRouter as Router, Routes, Route } from "react-router"; // Direkomendasikan dari 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Page Imports
import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";
import Generate from "./pages/generate/Generate";
import Home from "./pages/dashboard/Dashboard";
import Materi from "./pages/materi/Materi";

// Layout & Component Imports
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute"; // 1. Import ProtectedRoute

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
              <Route path="/generate" element={<Generate />} />
              <Route path="/materi" element={<Materi />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
