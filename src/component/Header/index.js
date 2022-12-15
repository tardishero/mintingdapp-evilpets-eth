import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../hooks/connect";
import { switchSongbirdNetwork } from "../../hooks/switch-network";

import Button from "../common/button";

import { FaWallet } from "react-icons/fa";
import "./header.css";

export default function Header() {
  const { account, chainId, activate, deactivate } = useWeb3React();

  async function connect() {
    if (chainId !== 16 || chainId === undefined) {
      switchSongbirdNetwork();
    }
    try {
      console.log("clicked");
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header id="header" className="fixed flex justify-end p-3 w-full z-50">
      {/* <h5 className="bg-gradient-to-r border-2 font-bold from-purple-700 p-1 rounded-lg sm:text-2xl text-white text-xl to-pink-600 uppercase">
        PETS NFTs
      </h5> */}
      {!account ? (
        <Button
          variant="hovered"
          className="connect_btn"
          onClick={() => connect()}>
          <FaWallet /> Connect Wallet
        </Button>
      ) : (
        <Button
          variant="hovered"
          className="connect_btn"
          onClick={() => disconnect()}>
          <FaWallet />
          {account.toString().slice(0, 4)} .... {account.toString().slice(-4)}
        </Button>
      )}
    </header>
  );
}
