import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import KycPage from "./pages/KycPage";
import StatusPage from "./pages/StatusPage";
import AdminPage from "./pages/AdminPage";
import WalletStatus from "./components/WalletStatus";
import { Toaster } from "sonner";
import ToastDisplay from "@/components/ToastDisplay";
import PaymentOptions from "./pages/PaymentSection";

function App() {
    return (
        <div className="relative">
            <Router>
                {/* <Toaster richColors position="bottom-center" /> */}
                <Toaster richColors offset={{top: '20px'}} mobileOffset={{ bottom: '16px' }} />
                <ToastDisplay mode="random" /> {/* Hiển thị thông báo KYC mới */}
                <WalletStatus />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/kyc" element={<KycPage />} />
                    <Route path="/status" element={<StatusPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/p" element={<PaymentOptions />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
