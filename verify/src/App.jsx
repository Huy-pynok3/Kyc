import { Routes, Route } from "react-router-dom";
import {
    KycReceivePage,
    KycAvailablePage,
    KycCountdownOverlay,
    HomePage,
    UploadPage,
    KycStatusPage,
} from "./pages"; 
import KycHistoryPage from "./components/KycHistoryPage";
// import LoginScreen from "./components/LoginScreen";

function App() {
    return (
        <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<KycAvailablePage />} />
            <Route path="/kyc/:kycId" element={<KycReceivePage />} />
            <Route path="/kyc-session/:kycId" element={<KycCountdownOverlay/>} />
            <Route path="/upload/:kycId" element={<UploadPage />} />
            <Route path="/kyc-status/:kycId" element={<KycStatusPage />} />
            <Route path="/history/:studentId/kycs" element={<KycHistoryPage />} />
        </Routes>
    );
}

export default App;
