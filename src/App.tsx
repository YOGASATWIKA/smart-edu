// import { BrowserRouter as Router, Routes, Route } from "react-router";
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
// import Generate from "./pages/Generate/Generate";
// import AppLayout from "./layout/AppLayout";
// import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Dashboard";

// export default function App() {
//   const googleClientId = "607532609795-lv0s840lkh5agfbplralb9t88bbkrtud.apps.googleusercontent.com";

//   return (
//     <GoogleOAuthProvider clientId={googleClientId}>
//       <Router>
//         <ScrollToTop />
//         <Routes>
//           <Route element={<AppLayout />}>
//             <Route index path="/" element={<Home />} />
//             <Route path="/generate" element={<Generate />} />
//           </Route>
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/signup" element={<SignUp />} />
//         </Routes>
//       </Router>
//     </GoogleOAuthProvider>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from "react-router"; // Direkomendasikan dari 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Page Imports
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Generate from "./pages/Generate/Generate";
import Home from "./pages/Dashboard/Dashboard";

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
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
