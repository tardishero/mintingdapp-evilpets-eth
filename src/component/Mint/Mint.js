import { useState, useEffect } from "react";
import Countdown from "react-countdown";

import Button from "../common/button";
import SliderNFT from "./Slider";

import MintStyleWrapper from "./Mint.style";

import checkIcon from "../../assets/images/icon/mint-right-text-icon.svg";
import discordIcon from "../../assets/images/icon/dis_logo.svg";
import twitterIcon from "../../assets/images/icon/Twitter.svg";
import { GooSpinner } from "react-spinners-kit";

import config from "../../config/config";
import ROYALPETSABI from "../../assets/abis/royalPetsABI.json";
import CARETOKENABI from "../../assets/abis/careTokenABI.json";
import { useWeb3React } from "@web3-react/core";
import { useAlert } from "react-alert";
const ethers = require("ethers");

const Mint = () => {
  const { account } = useWeb3React();
  const alert = useAlert();

  const [whiteListState, setWhiteListState] = useState(true);
  const [loadingState, setLoadingState] = useState(false);
  const [mintCount, setMintCount] = useState(0);
  const [mintState, setMintState] = useState(true);

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

  const mintStateFunc = async () => {
    let balance = 0;
    if (account !== undefined) {
      balance = await royalPetsContract.totalSupply();
      const count = Number(balance.toString());
      setMintCount(count);
      if (count >= config.MaxMintCount) {
        setMintState(false);
      }
    }
  };

  useEffect(() => {
    if (account) {
      mintStateFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const mint = async () => {
    setLoadingState(true);
    if (whiteListState) {
      await careTokenContrat
        .approve(
          config.RoyalPetsContractAddr,
          ethers.utils.parseEther(config.BurnCareAmout.toString()),
          {
            gasLimit: 300000,
          }
        )
        .then((tx) => {
          tx.wait().then(() => {
            royalPetsContract
              .mintWhiteList(config.mintCount, {
                gasLimit: config.totalGas,
                value: ethers.utils.parseEther(config.mintCost.toString()),
              })
              .then((tx) => {
                tx.wait().then(() => {
                  setLoadingState(false);
                  alert.success("Minted Successful", { timeout: 3000 });
                  window.location.reload();
                });
              });
          });
        });
    } else {
      await careTokenContrat
        .approve(
          config.RoyalPetsContractAddr,
          ethers.utils.parseEther(config.BurnCareAmout.toString()),
          {
            gasLimit: 300000,
          }
        )
        .then((tx) => {
          tx.wait().then(() => {
            royalPetsContract
              .mint(config.mintCost, {
                gasLimit: config.totalGas,
                value: ethers.utils.parseEther(config.mintCost.toString()),
              })
              .then((tx) => {
                tx.wait().then(() => {
                  setLoadingState(false);
                  alert.success("Minted Successful", { timeout: 3000 });
                  window.location.reload();
                });
              });
          });
        });
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <h1 className="font-bold mt-3 text-4xl text-white">0h : 0m : 0s</h1>
      );
    } else {
      // Render a countdown
      return (
        <h1 className="font-bold mt-3 text-4xl text-white">
          {days}d : {hours}h : {minutes}m : {seconds}s
        </h1>
      );
    }
  };

  return (
    <MintStyleWrapper>
      <div className="container my-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="mint_left_content">
            <div className="mint_left_inner">
              <div className="mint_slider">
                <SliderNFT />
              </div>
              <ul className="mint_count_list z-50">
                <li>
                  <h3 className="font-extrabold text-white">Remaining</h3>
                  <h3 className="font-extrabold text-white">
                    {mintCount} / {config.MaxMintCount}
                  </h3>
                </li>
                <li>
                  <h3 className="font-extrabold text-white">Price</h3>
                  <h3 className="font-extrabold text-white">1250 SGB</h3>
                </li>
              </ul>
              {mintState && (
                <Button lg onClick={() => mint()} variant="outline">
                  {" "}
                  Mint now
                  {loadingState && (
                    <span className="mx-3">
                      <GooSpinner size={27} />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="mint_right_content">
            {mintState ? (
              <>
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
                      date={"2022-12-22 09:00:00"}
                      intervalDelay={0}
                      precision={3}
                      onComplete={() => setWhiteListState(false)}
                      renderer={renderer}
                    />
                  </div>
                )}
                <div className="content_footer">
                  <h1 className="font-bold">Price 1250 SGB</h1>
                </div>
              </>
            ) : (
              <h1 className="flex font-bold tex text-5xl">
                MINT END{" "}
                <span className="">
                  <img src={checkIcon} alt="icon" />
                </span>
              </h1>
            )}

            <div className="flex gap-3 mt-3">
              <Button lg variant="outline">
                <img src={discordIcon} alt="icon" />
                <a
                  href="https://discord.gg/gUYSw7ZB7R"
                  target="_blank"
                  rel="noreferrer">
                  join discord
                </a>
              </Button>
              <Button lg variant="outline">
                <img src={twitterIcon} alt="icon" />
                <a
                  href="https://twitter.com/SpaceCatsSGB"
                  target="_blank"
                  rel="noreferrer">
                  join twitter
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MintStyleWrapper>
  );
};

export default Mint;
