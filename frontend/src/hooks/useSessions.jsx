import { useState, useEffect } from "react";
import { fetchSessions } from "@/services/api";

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

