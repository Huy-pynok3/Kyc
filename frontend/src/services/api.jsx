import axios from "axios";
import { clearToken } from "@/services/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginAdmin = async (password) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
};

// export const fetchKycList = async (token) => {
//   const res = await fetch(`${API_BASE_URL}/api/kyc/all`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// };
  export const fetchKycList = async (token) => {
      const res = await fetch(`${API_BASE_URL}/api/kyc/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 401) {
          window.location.reload(); 
          clearToken(); 
          // throw new Error("Invalid token");
        }
        throw new Error(errorText);
      }
      return res.json();
  };

export const updateKycStatus = async (token, wallet, status, reason = "") => {
  const res = await fetch(`${API_BASE_URL}/api/kyc/update-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ wallet, status, reason }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteKyc = async (token, wallet) => {
  const res = await fetch(`${API_BASE_URL}/api/kyc/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ wallet }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const manualApprove = async (token, wallet) => {
  const res = await fetch(`${API_BASE_URL}/api/manual-approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ wallet }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// export const fetchSessions = async ( token) => {
//   console.log("Token:", token);
//   const res = await axios.get(`${API_BASE_URL}/api/kyc/sessions`,{

//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   console.log("Data trả về:", res.data);
//   return res.data || [];
// };
// export const fetchSessions = async (token) => {
  
//   if (!token || typeof token !== 'string') {
//     console.error("Token không hợp lệ:", token);
//     throw new Error("Invalid token");
//   }
//   console.log("Token:", token);
//   const res = await axios.get(`${API_BASE_URL}/api/kyc/sessions`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   console.log("Data trả về:", res.data);
//   return res.data || [];
// };

export const fetchSessions = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token || typeof token !== "string") {
    // console.error("Token không hợp lệ:", token);
    throw new Error("Invalid token");
  }
  // console.log("Token:", token);
  const res = await axios.get(`${API_BASE_URL}/api/kyc/sessions`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log("Data trả về:", res.data);
  return res.data || [];
};


