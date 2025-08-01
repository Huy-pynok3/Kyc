import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import KycHistoryPage from "./KycHistoryPage";

export default function AvatarMenu() {
    const [studentId, setStudentId] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef();

    useEffect(() => {
        const id = localStorage.getItem("studentId");
        if (id) setStudentId(id);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("studentId");
        window.location.reload(); // hoặc navigate(0)
    };

    if (!studentId) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:opacity-80"
            >
                {studentId.slice(-2).toUpperCase()}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <button className="block w-full px-4 py-2 text-left text-blue-600 text-xs font-medium italic bg-blue-50 border-l-4 border-blue-400 whitespace-nowrap truncate hover:bg-blue-100">
                        {/* 💬 Tele ib: @minelx57 */}
                        <a 
                            href="https://t.me/minelx57"
                            target="_blank"
                            rel="noopener noreferrer"
                            // className="text-blue-600 hover:text-blue-800 font-medium underline"
                        
                        >
                            💬 Tele ib: @minelx57
                        </a>
                    </button>

                    <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        🗝️ {studentId}
                    </button>

                    <button
                        onClick={() => {
                            navigate(`/history/${studentId}/kycs`);
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                        👀 Xem lịch sử
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
}
