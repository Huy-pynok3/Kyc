import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../contexts/WalletContext";
import { LogOut } from "lucide-react";
import img from "@/images";

export default function WalletStatus() {

    const { wallet, disconnectWallet } = useContext(WalletContext);
    const navigate = useNavigate();
    
    if (!wallet) return null; // Không hiển thị gì nếu chưa có ví

    const handleDisconnect = () => {
        disconnectWallet();
        navigate("/"); 
    };

    return (
        <div className="fixed top-4 right-4 bg-white border shadow-md rounded-full px-4 py-2 flex items-center space-x-3 text-sm z-50">
            <img
                src={img.metamask}
                alt="metamask"
                className="w-6 h-6 inline-block mr-2 hover:scale-110 transition-transform duration-200 ease-in-out"
                loading="lazy"
            />
            <span className="font-mono text-gray-800">
                {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>
            <button
                onClick={handleDisconnect}
                className="text-red-500 hover:underline font-semibold items-center flex space-x-1 cursor-grab"
            >
                <LogOut size={16} className="inline mr-1" />
                Ngắt
            </button>
        </div>
    );
}
