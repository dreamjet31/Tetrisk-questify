import { Link } from "react-router-dom";
import { useWallet } from "@sei-js/react";
import { useDispatch, useSelector } from "react-redux";
import { WalletWindowKey } from "@sei-js/core";
import { useContext, useEffect, useState } from "react";
import { setLeaderboard, setMyBalance } from "../../redux/slices/tetrisSlice";
import RecentScore from "../../components/Home/RecentScore";
import { apiCaller } from "../../utils/fetcher";
import { SeiWalletContext } from "@sei-js/react";
import {
  setConnectionState,
  setMyWalletAddress,
} from "../../redux/slices/tetrisSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const isSmallDevice = window.matchMedia(
    "(max-width: 600px) or (max-height:420px)"
  ).matches;
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
    try {
      var result = await apiCaller.get("tetrises/fetchTotalUser");
      setTotalUser(result.data.data);
    } catch (err) {
      toast.warn("Wait. Backend error");
    }
  };

  const dispatch = useDispatch();

  const fetchLeaderboard = async () => {
    var result = await apiCaller.get("users/fetchLeaderboard");
    dispatch(setLeaderboard({ result: result.data.data }));
  };

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const getMyInfo = async (wallet: string) => {
    if (accounts && accounts.length) {
      var result = await apiCaller.post("users/getMyInfo", {
        wallet,
      });
      dispatch(setMyBalance({ balance: result.data.data.totalBalance }));
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    if (connectedWallet == ("keplr" as WalletWindowKey)) {
      connect("keplr");
    }
  }, []);

  useEffect(() => {
    fetchTotalUser();
  });

  useEffect(() => {
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
    <div
      style={{
        marginTop: isSmallDevice ? "60px" : "120px",
        backgroundImage: "url(/images/Group.svg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
      }}
    >
      <div className="message">
        <div className="flex flex-row justify-center content-center lg:text-[32px] text-[24px] font-[BungeeSpice-Regular]">
          {connectedWallet == ("keplr" as WalletWindowKey) ? (
            <div style={{ textAlign: "center" }}>
              Over&nbsp;
              <span style={{ color: "#6763B2" }}>
                {/* {winners.showInfo.length} */}
                {totalUser.toLocaleString("en-US")}
              </span>
              &nbsp;Players have risked IT
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              Over&nbsp;<span style={{ color: "#6763B2" }}>&nbsp;</span>
              &nbsp;Players have risked IT
            </div>
          )}
        </div>
      </div>
      <div
        className="h-[110px] bg-no-repeat items-center mt-[24px] bg-contain"
        style={{
          backgroundImage: "url(/images/tile.svg)",
          backgroundSize: "100% 100%",
          alignItems: "center",
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
          <div
            className="yellow-btn items-center"
            style={{ boxShadow: "0px 5px 0px" }}
            onClick={async () => {
              if (!window.keplr) {
                alert("Please install keplr extension");
              } else {
                connect("keplr");
              }
              dispatch(setConnectionState({ state: !connectionState }));
            }}
          >
            Connect wallet
          </div>
        ) : (
          <div className="flex flex-row">
            <Link to="/start">
              <div
                className="yellow-btn flex flex-row items-center"
                style={{ boxShadow: "0px 5px 0px" }}
              >
                <div className="flex flex-row">
                  <img src="/images/powerIcon.svg"></img>
                  <p> &nbsp; Play Now </p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-between m-6">
        <div className="yellow-btn g:w-[60vw] md:w-[60vw] w-[90vw] items-center font-[IBMPlexMono-Regular] px-0 py-[5px]">
          Recent Plays
        </div>
        <div className="flex content-center items-center">
          <div className="p-1 rounded-[8px] lg:w-[60vw] md:w-[100vw] sm:w-[100vw] xs:w-[100vw] w-[100vw] flex content-center items-center justify-center">
            <RecentScore level={1} simple={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
