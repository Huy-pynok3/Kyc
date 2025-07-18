import { useState, useEffect } from "react";
import { fetchSessions } from "@/services/api";


// export const useSessions = (token) => {
//   const [sessions, setSessions] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!token) return; // tránh gọi nếu chưa có token
//       try {
//         const data = await fetchSessions(token);
//         setSessions(data);
//       } catch (err) {
//         console.error("Lỗi tải sessions:", err);
//       }
//     };
//     fetchData();
//   }, [token]);

//   return { sessions };
// };


export const useSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSessions();
        setSessions(data);
      } catch (err) {
        console.error("Lỗi tải sessions:", err);
      }
    };
    fetchData();
  }, []);

  return { sessions };
};
