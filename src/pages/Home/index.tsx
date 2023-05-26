import { useNavigate, Link } from "react-router-dom";
import { useQueryClient, useWallet, useSigningClient } from "@sei-js/react";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useDispatch, useSelector } from "react-redux";
import { WalletWindowKey } from "@sei-js/core";
import { useContext, useEffect, useState } from "react";
import { setLeaderboard, setMyBalance } from "../../redux/slices/tetrisSlice";
import RecentScore from "../../components/Home/RecentScore";
import LeaderBoard from "../../components/Home/LeaderBoard";
import { apiCaller } from "../../utils/fetcher";
import styled from "styled-components";
import { SeiWalletContext } from "@sei-js/react";
import {
  setConnectionState,
  setMyWalletAddress,
} from "../../redux/slices/tetrisSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const isSmallDevice = window.matchMedia('(max-width: 600px) or (max-height:420px)').matches;
  const [totalUser, setTotalUser] = useState(0);
  const { supportedWallets, connect, disconnect, installedWallets } =
    useContext(SeiWalletContext);
  const { connectedWallet, offlineSigner, accounts } = useWallet();
  const { connectionState } = useSelector((state: any) => ({
    connectionState: state.tetris.connectionState,
  }));

  const { myWalletAddress } = useSelector((state: any) => ({
    myWalletAddress: state.tetris.myWalletAddress,
  }));

  const { winners } = useSelector((state: any) => ({
    winners: state.tetris.winners,
  }));

  const fetchTotalUser = async () => {
    // console.log("kkkkk ");
    try {
      var result = await apiCaller.get("tetrises/fetchTotalUser");
      setTotalUser(result.data.data);
    } catch (err) {
      toast.warn("Wait. Backend error");
    }
  };


  // console.log("hello", winners);
  // console.log("hello", connectionState);
  // console.log("helloinfo", winners.showInfo);
  // console.log("hello", winners.showInfo.length);
  // const lenghtOfPeople = winners.showInfo.length;
  // console.log("hello people", lenghtOfPeople)
  // console.log("hello money", connectedWallet)

  const dispatch = useDispatch();

  const Message = styled.div`
    & {
      width: 60%;
      height: 100px;
      padding: 0.5em;
      background-color: transparent;
      margin: 0 auto;
      position: relative;
      @media screen and (min-width: 960px) {
        background-image: url(/images/messageBox.svg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      
      /* Style for small devices */
      @media screen and (max-width: 960px) {
        background-color: transparent;
      }
    }
  `;

  const YellowBtn = styled.div`
    text-align: center;
    background-color: #fcd23c;
    border: 2px solid black;
    border-radius: 8px;
    font-size: 16px;
    font-family: BungeeSpice-Regular;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    padding: 16px 32px 16px 32px;
    cursor: pointer;
    display: inline-block;
  `;

  const fetchLeaderboard = async () => {
    var result = await apiCaller.get("tetrises/fetchLeaderboard");
    dispatch(setLeaderboard({ result: result.data.data }));
  };

  // console.log(localStorage);

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const getMyInfo = async (wallet: string) => {
    if (accounts && accounts.length) {
      var result = await apiCaller.post("tetrises/getMyInfo", {
        wallet,
      });
      console.log("ssdfd", result.data.data.totalBalance);
      dispatch(setMyBalance({ balance: result.data.data.totalBalance }));
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    console.log(
      "ssssss",
      connectedWallet,
      "keplr" as WalletWindowKey,
      connectedWallet == ("keplr" as WalletWindowKey)
    );
    if (connectedWallet == ("keplr" as WalletWindowKey)) {
      connect("keplr");
    }
  }, []);

  useEffect(() => {
    fetchTotalUser();
  })

  useEffect(() => {
    console.log(
      "ssssss",
      connectedWallet,
      "keplr" as WalletWindowKey,
      connectedWallet == ("keplr" as WalletWindowKey)
    );
    if (connectedWallet === ("keplr" as WalletWindowKey)) {
      connect("keplr");
    }
  }, [connectedWallet]);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    if (accounts && accounts.length) {
      setMyAddress(accounts[0].address);
      getMyInfo(accounts[0].address);
      dispatch(setConnectionState({ state: !connectionState }));
      dispatch(setMyWalletAddress({ address: accounts[0].address }));
    }
  }, [accounts]);

  // wallet connection
  const [myAddress, setMyAddress] = useState("");

  return (
    <div style={{
      marginTop: isSmallDevice ? "60px" : "120px",
      backgroundImage: "url(/images/Group.svg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top",
    }}
  >
      {/* <ToastContainer
        style={{ fontSize: "14px" }}
        autoClose={2000}
        hideProgressBar={true}
      /> */}
      <Message>
        <div
          className="flex flex-row justify-center content-center lg:text-[32px] text-[24px]"
          style={{ fontFamily: "BungeeSpice-Regular" }}
        >
          {connectedWallet == ("keplr" as WalletWindowKey) ?
            (<div style={{ textAlign: "center" }}>
              Over&nbsp;<span style={{ color: "#6763B2" }}>
                {/* {winners.showInfo.length} */}
                {totalUser.toLocaleString('en-US')}
              </span>
              &nbsp;Players have risked IT
            </div>)
            : (<div style={{ textAlign: "center" }}>
              Over&nbsp;<span style={{ color: "#6763B2" }}>&nbsp;</span>
              &nbsp;Players have risked IT
            </div>
            )}

        </div>
      </Message>
      <div
        style={{
          height: "110px",
          backgroundImage: "url(/images/tile.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          alignItems: "center",
          marginTop: "24px",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          margin: "24px",
        }}
        className="flex flex-row"
      >
        {connectedWallet != ("keplr" as WalletWindowKey) ? (
          <YellowBtn
            style={{ alignItems: "center", boxShadow: "0px 5px 0px" }}
            onClick={async () => {
              if (!window.keplr) {
                alert("Please install keplr extension");
              } else {
                connect("keplr");
                // (window as any).keplr.enable('atlantic-2');
                // const address = await (window as any)
                //   .getOfflineSigner("atlantic-2")
                //   .getAccounts();
                // console.log(address[0].address);
                // setMyAddress(address[0].address);
                // dispatch(setConnectionState({ state: !connectionState }));
                // dispatch(setMyWalletAddress({ address: address[0].address }));
              }
              dispatch(setConnectionState({ state: !connectionState }));
            }}
          >
            Connect wallet
          </YellowBtn>
        ) : (
          <div className="flex flex-row">
            <Link to="/start">
              <YellowBtn
                className="flex flex-row"
                style={{ alignItems: "center", boxShadow: "0px 5px 0px" }}
                onClick={() => {
                  // console.log("play now");
                }}
              >
                <div className="flex flex-row">
                  <img src="/images/powerIcon.svg"></img>
                  <p> &nbsp; Play Now </p>
                </div>
              </YellowBtn>
            </Link>

            {/* <YellowBtn
              style={{
                alignItems: "center",
                boxShadow: "0px 5px 0px",
                backgroundColor: "white",
                marginLeft: "8px",
              }}
              onClick={() => {
                console.log("user ledger");
              }}
            >
              <div className="flex flex-row">
                <img src="/images/usbFlash.svg"></img>
                <p> &nbsp; Use Ledger </p>
              </div>
            </YellowBtn> */}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          margin: "24px",
        }}
      >
        {/* <YellowBtn
          style={{
            alignItems: "center",
            fontFamily: "IBMPlexMono-Regular",
            width: "60%",
            padding: "5px 0px",
          }}
        >
          Leaderboard
        </YellowBtn>
        <div
          style={{
            padding: "8px",
            borderRadius: "8px",
            width: `${screenSize.width * 0.6}px`,
          }}
        >
          <LeaderBoard level={1} simple={false} />
        </div> */}

        <YellowBtn
          style={{
            alignItems: "center",
            fontFamily: "IBMPlexMono-Regular",
            padding: "5px 0px",
          }}
          className="lg:w-[60vw] md:w-[60vw] w-[90vw]"
        >
          Recent Plays
        </YellowBtn>
        {/* Recent score */}
        <div className="flex content-center items-center">
          <div className="p-1 rounded-[8px] lg:w-[60vw] md:w-[100vw] sm:w-[100vw] xs:w-[100vw] w-[100vw] flex content-center items-center justify-center"
          // style={{
          //   padding: "4px",
          //   borderRadius: "8px",
          //   width: "100vw",
          //   alignContent: "center",
          //   alignItems: "center"
          // }}
          >
            <RecentScore level={1} simple={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

// console.log("RECENT: ", RecentScore);

export default Home;
