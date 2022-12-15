import { useState } from "react";
import Countdown from "react-countdown";

import Button from "../common/button";
import SliderNFT from "./Slider";

import MintStyleWrapper from "./Mint.style";

import checkIcon from "../../assets/images/icon/mint-right-text-icon.svg";
import discordIcon from "../../assets/images/icon/dis_logo.svg";
import twitterIcon from "../../assets/images/icon/Twitter.svg";

import config from "../../config/config";
import ROYALPETSABI from "../../assets/abis/royalPetsABI.json";
import CARETOKENABI from "../../assets/abis/careTokenABI.json";

const ethers = require("ethers");

const Mint = (account, connect, disconnect) => {
  const [whiteListState, setWhiteListState] = useState(true);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = provider.getSigner();

  const royalPetsContract = new ethers.Contract(
    config.RoyalPetsContractAddr,
    ROYALPETSABI,
    Signer
  );

  const careTokenContrat = new ethers.Contract(
    config.CareTokenAddr,
    CARETOKENABI,
    Signer
  );

  const mint = async () => {
    console.log("=>", whiteListState);
    if (whiteListState) {
      await careTokenContrat
        .approve(config.RoyalPetsContractAddr, config.BurnCareAmout, {
          gasLimit: 3000000,
        })
        .then((tx) => {
          tx.wait().then(() => {
            royalPetsContract
              .mintWhiteList(config.mintCount, config.mintCost, {
                gasLimit: 3000000,
                value: ethers.utils.parseEther(config.mintCost.toString()),
              })
              .then((tx) => {
                tx.wait().then(() => {});
              });
          });
        });
    } else {
      await careTokenContrat
        .approve(config.RoyalPetsContractAddr, config.BurnCareAmout, {
          gasLimit: 3000000,
        })
        .then((tx) => {
          tx.wait().then(() => {
            royalPetsContract
              .mint(config.mintCount, config.mintCost, {
                gasLimit: 3000000,
                value: ethers.utils.parseEther(config.mintCost.toString()),
              })
              .then((tx) => {
                tx.wait().then(() => {});
              });
          });
        });
    }
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <h1 className="font-bold mt-3 text-4xl text-white">0h : 0m : 0s</h1>
      );
    } else {
      // Render a countdown
      return (
        <h1 className="font-bold mt-3 text-4xl text-white">
          {hours}h : {minutes}m : {seconds}s
        </h1>
      );
    }
  };

  // const counterSettings = {
  //   count: 3600 * 24,
  //   showTitle: true,
  //   size: 40,
  //   labelSize: 34,
  //   backgroundColor: "transparent",
  //   color: "#fff",
  //   fontWeight: 700,
  //   dayTitle: "D",
  //   hourTitle: "H",
  //   minuteTitle: "M",
  //   secondTitle: "S",
  //   id: "countdownwrap",
  // };

  return (
    <MintStyleWrapper>
      <div className="container my-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="mint_left_content">
            <div className="mint_left_inner">
              <div className="mint_slider">
                <SliderNFT />
              </div>
              <ul className="mint_count_list">
                <li>
                  <h3 className="font-extrabold text-white">Remaining</h3>
                  <h3 className="font-extrabold text-white">0 / 300</h3>
                </li>
                <li>
                  <h3 className="font-extrabold text-white">Price</h3>
                  <h3 className="font-extrabold text-white">1250 SGB</h3>
                </li>
              </ul>
              <Button lg variant="mint" onClick={() => mint()}>
                {" "}
                Mint now
              </Button>
            </div>
          </div>
          <div className="mint_right_content">
            <div className="content_header">
              {!whiteListState && (
                <h4 className="flex font-extrabold">
                  WHITELIST : SOLDOUT
                  <span className="">
                    <img src={checkIcon} alt="icon" />
                  </span>
                </h4>
              )}

              <h1 className="font-bold">
                {whiteListState ? "WhiteList" : "Public"} MINT LIVE
              </h1>
            </div>
            {whiteListState && (
              <div className="mint_timer">
                <h3 className="font-extrabold text-lg text-white">
                  Whitelist Mint End in
                </h3>
                <Countdown
                  date={Date.now() + 1000 * 600}
                  intervalDelay={0}
                  precision={3}
                  onComplete={() => setWhiteListState(false)}
                  renderer={renderer}
                />
              </div>
            )}
            <div className="content_footer">
              <h5 className="font-bold">Price 1250 SGB</h5>
            </div>
            <div className="flex gap-3 mt-3">
              <Button lg variant="outline">
                <img src={discordIcon} alt="icon" />
                join discord
              </Button>
              <Button lg variant="outline">
                <img src={twitterIcon} alt="icon" />
                join twitter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MintStyleWrapper>
  );
};

export default Mint;
