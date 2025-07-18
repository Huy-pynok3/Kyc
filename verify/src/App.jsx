import { Routes, Route } from "react-router-dom";
import {
    KycReceivePage,
    KycAvailablePage,
    KycCountdownOverlay,
    HomePage,
    UploadPage,
    KycStatusPage,
} from "./pages"; 

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<KycAvailablePage />} />
            <Route path="/kyc/:kycId" element={<KycReceivePage />} />
            <Route path="/kyc-session/:kycId" element={<KycCountdownOverlay studentId="sinhvien123" />} />
            <Route path="/upload/:kycId" element={<UploadPage />} />
            <Route path="/kyc-status/:kycId" element={<KycStatusPage />} />
        </Routes>
    );
}

export default App;
