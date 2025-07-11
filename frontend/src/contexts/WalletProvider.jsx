import React, { useState, useEffect } from "react";

import { WalletContext } from "./WalletContext";

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Bạn cần cài Metamask!");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0].toLowerCase();
    setWallet(account);
    localStorage.setItem("wallet_connected", "true");
  };

  const disconnectWallet = () => {
    setWallet("");
    localStorage.removeItem("wallet_connected");
  };

  useEffect(() => {
    const connected = localStorage.getItem("wallet_connected");
    if (connected && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0].toLowerCase());
        }
      });
    }
  }, []);



  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
