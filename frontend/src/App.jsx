
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import KycPage from "./pages/KycPage";
import StatusPage from "./pages/StatusPage";
import AdminPage from "./pages/AdminPage";
import WalletStatus from "./components/WalletStatus";
import { Toaster } from "sonner";
import ToastDisplay from "@/components/ToastDisplay";
import ChooseKycPage from "@/components/ChooseKycPage";
import GuidePage from "./pages/GuidePage";
import PageNotFound from "./components/PageNotFound";

function App() {

  const location = useLocation();
  const hideWallet = ["/panel", "/guide", "/"]; // List of paths where the wallet should be hidden

  const shouldHideWallet = hideWallet.includes(location.pathname);

  return (
    <div className="relative">
      <Toaster richColors offset={{ top: "20px" }} mobileOffset={{ bottom: "16px" }} />
      {!shouldHideWallet && <ToastDisplay mode="random" />}
      {!shouldHideWallet && <WalletStatus />}

      <Routes>
        <Route path="/maplestory" element={<HomePage />} />
        {/* <Route path="/choose-kyc" element={<ChooseKycPage />} /> */}
        <Route path="/" element={<ChooseKycPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/kyc" element={<KycPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/panel" element={<AdminPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;

