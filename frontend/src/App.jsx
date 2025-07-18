// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import KycPage from "./pages/KycPage";
// import StatusPage from "./pages/StatusPage";
// import AdminPage from "./pages/AdminPage";
// import WalletStatus from "./components/WalletStatus";
// import { Toaster } from "sonner";
// import ToastDisplay from "@/components/ToastDisplay";
// import KycReceivePage from "./pages/KycReceivePage";
// import KycAvailablePage from "./pages/KycAvailablePage";
// import { useLocation } from "react-router-dom";

// function App() {

//     const location = useLocation();
//     const hideWallet = ["/list", "/admin", "/payment"]; // danh sách cần ẩn
  
//     const shouldHideWallet = hideWallet.includes(location.pathname);
//     return (
//         <div className="relative">
//             <Router>
//                 {/* <Toaster richColors position="bottom-center" /> */}
//                 <Toaster richColors offset={{top: '20px'}} mobileOffset={{ bottom: '16px' }} />
//                 <ToastDisplay mode="random" /> {/* Hiển thị thông báo KYC mới */}
//                {    !shouldHideWallet && <WalletStatus />} {/* Hiển thị WalletStatus trừ các trang trong danh sách ẩn */}
//                 <Routes>
//                     <Route path="/" element={<HomePage />} />
//                     <Route path="/kyc" element={<KycPage />} />
//                     <Route path="/status" element={<StatusPage />} />
//                     <Route path="/admin" element={<AdminPage />} />
//                     <Route path="/kyc/:kycId" element={<KycReceivePage />} />
//                     <Route path="/list" element={<KycAvailablePage />} />
//                     {/* <Route path="/kyc-session/:kycId" element={<KycCountdownOverlay studentId="sinhvien123" />} /> */}

//                 </Routes>
//             </Router>
//         </div>
//     );
// }

// export default App;

import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import KycPage from "./pages/KycPage";
import StatusPage from "./pages/StatusPage";
import AdminPage from "./pages/AdminPage";
import WalletStatus from "./components/WalletStatus";
import { Toaster } from "sonner";
import ToastDisplay from "@/components/ToastDisplay";
// import KycReceivePage from "./pages/KycReceivePage";
// import KycAvailablePage from "./pages/KycAvailablePage";
// import KycCountdownOverlay from "./pages/KycCountdownOverlay";

function App() {
  const location = useLocation();
  const hideWallet = ["/admin"]; // List of paths where the wallet should be hidden

  const shouldHideWallet = hideWallet.includes(location.pathname);

  return (
    <div className="relative">
      <Toaster richColors offset={{ top: "20px" }} mobileOffset={{ bottom: "16px" }} />
      {!shouldHideWallet && <ToastDisplay mode="random" />}
      {!shouldHideWallet && <WalletStatus />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kyc" element={<KycPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* <Route path="/kyc/:kycId" element={<KycReceivePage />} /> */}
        {/* <Route path="/order" element={<KycAvailablePage />} /> */}
        {/* <Route path="/kyc-session/:kycId" element={<KycCountdownOverlay studentId="sinhvien123" />} /> */}
      </Routes>
    </div>
  );
}

export default App;

