import { useNavigate } from "react-router-dom";
import { useQueryClient, useWallet, useSigningClient } from "@sei-js/react";
import Lottie from "react-lottie";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { setLeaderboard, setMyBalance } from "../../redux/slices/tetrisSlice";
import { apiCaller } from "../../utils/fetcher";
import styled from "styled-components";
import { SeiWalletContext } from "@sei-js/react";
import {
  setConnectionState,
  setConfLevel,
  setSkillLevel,
  setBeatScore,
} from "../../redux/slices/tetrisSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/wallet.css";
import { current } from "@reduxjs/toolkit";
import leftLines from "../../lines-left.json";
import rightLines from "../../lines-right.json";

const StartGame = () => {
  const YellowBtn = styled.div`
    margin: 40px;
    width: 236px;
    text-align: center;
    background-color: #fcd23c;
    border: 2px solid black;
    border-radius: 8px;
    font-size: 16px;
    font-family: BungeeSpice-Regular;
    padding: 12px;
    text-transform: uppercase;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    display: flex;
    cursor: pointer;
  `;

  const { supportedWallets, connect, disconnect, installedWallets } =
    useContext(SeiWalletContext);

  const { connectionState } = useSelector((state: any) => ({
    connectionState: state.tetris.connectionState,
  }));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [connected, setConnected] = useState(false);
  const [betAmount, setBetAmount] = useState("");
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [sending, setSending] = useState(false);
  const { signingClient } = useSigningClient();
  const { queryClient } = useQueryClient();

  const Card = ({ img, level, text }) => {
    const CardBox = styled.div`
      text-align: center;
      background-color: white;
      border: 2px solid black;
      border-radius: 8px;
      font-size: 16px;
      font-family: BungeeSpice-Regular;
      text-transform: uppercase;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0px 5px 0px;
      justify-content: center;
      align-items: center;
      ${(props) => {
        if (0.3 * window.innerWidth > 300) {
          return "width: 300px;";
        } else {
          return "width: 28vw;";
        }
      }}
    `;

    const CardValue = styled.div`
      font-size: 32px;
      margin-top: 20px;
      margin-bottom: 10px;
      @media only screen and (max-width: 768px) {
        font-size: 24px;
      }
    
      @media only screen and (max-width: 480px) {
        font-size: 20px;
    `;

    const leftOptions = {
      loop: true,
      autoplay: true,
      animationData: leftLines,
      // animationData: require("../../lines-left.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    const { currentLevel } = useSelector((state: any) => ({
      currentLevel: state.tetris.skillLevel,
    }));

    const rightOptions = {
      loop: true,
      autoplay: true,
      animationData: rightLines,
      // animationData: require("../../lines-left.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <CardBox
        className="flex flex-row"
        style={{
          margin: "10px",
          color: level === currentLevel ? "#6763B2" : "unset",
        }}
      >
        <div
          className="flex flex-col justify-center"
          onClick={() => {
            dispatch(setSkillLevel({ skill: level }));
          }}
        >
          <div
            className="flex justify-center"
            style={{
              fontFamily: "IBMPlexMono-regular",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "lighter",
              marginTop: "24px",
              marginBottom: "28px",
            }}
          >
            SKILL LEVEL
          </div>

          <div className="flex justify-center">
            <div className="mr-4">
              <Lottie
                options={leftOptions}
                height={20}
                width={20}
                isStopped={true}
                isPaused={true}
              />
            </div>
            <img src={img} style={{ width: "10vw" }} />
            <div className="ml-4 flex flex-col-reverse">
              <Lottie
                options={rightOptions}
                height={20}
                width={20}
                isStopped={true}
                isPaused={true}
              />
            </div>
          </div>
          <div
            style={{
              width: window.innerWidth * 0.3 < 300 ? "27vw" : "300px",
              height: "0px",
              color: "black",
              marginTop: "40px",
              border: "1px solid rgba(0,0,0,0.2",
            }}
          ></div>
          <CardValue>{text}</CardValue>
        </div>
      </CardBox>
    );
  };

  const Box = ({}) => {
    const [selected, setSelected] = useState(0);
    const { level } = useSelector((state: any) => ({
      level: state.tetris.skillLevel,
    }));

    const divs: JSX.Element[] = [];
    const seis: number[][] = [
      [0.001, 0.002, 0.003, 0.004, 0.005],
      [0.01, 0.02, 0.03, 0.04, 0.05],
      [0.05, 0.1, 0.15, 0.2, 0.25],
    ];
    for (let i = 0; i < 5; i++) {
      divs.push(
        <div key={i}>
          <div className="flex flex-row m-[1vw]">
            <div
              className={`small-box xl:w-[160px] lg:w-[160px] md:w-[160px] sm:w-[16vw] xs:w-[16vw]`}
              onClick={() => {
                setSelected(i);
                dispatch(setConfLevel({ confident: seis[level - 1][i] }));
              }}
              style={
                confLevel === seis[level - 1][i]
                  ? { background: "#6961B8", color: "white" }
                  : { background: "#EFF1FF", color: "black" }
              }
            >
              <div className="card-value">{seis[level - 1][i]}</div>
              <div className="confidence-level opacity-50">SEI</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div
          style={{
            border: "2px solid black",
            borderRadius: "8px",
            marginTop: "40px",
            alignItems: "center",
            textAlign: "center",
            padding: "8px",
            background: "white",
          }}
        >
          <div className="confidence-level">CONFIDENCE LEVEL:</div>
          <div className="flex flex-row " style={{}}>
            {divs}
          </div>
        </div>
      </div>
    );
  };

  const { balance } = useSelector((state: any) => ({
    balance: state.tetris.balance,
  }));

  const { level } = useSelector((state: any) => ({
    level: state.tetris.skillLevel,
  }));

  // useEffect(() => {
  //   localStorage.setItem("betAmount", confLevel);
  // }, [betAmount]);

  const { connectedWallet, offlineSigner, accounts } = useWallet();

  const getBalance = async () => {
    if (accounts.length > 0 && !!queryClient) {
      // console.log("connectedddd", connected);
      const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({
        address: accounts[0].address,
      });
      console.log("balanceskkkk", balances);
      const amount = balances.find((balance) => {
        return balance.denom === "usei";
      });
      console.log("amountsdfd", amount);
      if (amount) setCurrentAmount(Number(amount.amount) / 1e6);
      setConnected(true);
    } else {
      setConnected(false);
    }
  };

  const getMyInfo = async (wallet: string) => {
    console.log("here");
    if (accounts && accounts.length) {
      var result = await apiCaller.post("tetrises/getMyInfo", {
        wallet,
      });
      console.log("ssdfd", result.data.data.totalBalance);
      dispatch(setMyBalance({ balance: result.data.data.totalBalance }));
      // dispatch(
      //   setBeatScore({ beatScore: result.data.newTetris.goal.toString() })
      // );
    }
  };

  const sendToken = async (amount: number) => {
    // ***
    // if (!signingClient || !accounts) {
    //   console.log("Wallet is not connected");
    //   return;
    // }
    // if (amount > balance) {
    //   toast.warn("Check your balance");
    //   return;
    // }
    // ***
    if (!connected) toast.warn("Wait a few seconds ...");
    setSending(true);
    // const fee = calculateFee(150000, GasPrice.fromString("3750usei"));
    // const transferAmount = { amount: (amount * 1e6).toString(), denom: "usei" };
    // console.log("here");
    try {
      // const sendResponse = await signingClient.sendTokens(
      //   accounts[0].address,
      //   "sei10cs7ddu93ge6kwfllm24cm20h4j4vx00sfaqh7",
      //   [transferAmount],
      //   fee
      // );
      // if (sendResponse.transactionHash) {
      //   localStorage.setItem("txHash", sendResponse.transactionHash);

      //   try {
      //     const result = await apiCaller.post("tetrises/createTetris", {
      //       wallet: accounts[0].address,
      //       txHash: sendResponse.transactionHash,
      //       amount: amount,
      //       level,
      //     });
      //     console.log("sdfsadfsd", result.data);
      //     localStorage.setItem("tetrisId", result.data.newTetris._id);
      //     localStorage.setItem(
      //       "beatScore",
      //       result.data.newTetris.goal.toString()
      //     );
      //   } catch (err: any) {
      //     // if (err.response.data.message == "Rate limit") {
      //     //   alert("Rate limit");
      //     // }
      //     throw new Error();
      //   }
      // } else {
      //   throw new Error();
      // }
      console.log("Now creating Tetris", level);

      try {
        const result = await apiCaller.post("tetrises/createTetris", {
          // wallet: accounts[0].address,
          wallet: "sei1qu2vzlk4nj8vcu5zjczr4xmzdenu027fku4q4d",
          txHash: "useless",
          amount: amount,
          level,
        });
        console.log("❤️ Data", result.data.newTetris);
        localStorage.setItem("tetrisId", result.data.newTetris._id);

        // const { beatScore } = useSelector((state: any) => ({
        //   beatScore: result.data.newTetris.goal.toString(),
        // }));
        dispatch(
          setBeatScore({ beatScore: result.data.newTetris.goal.toString() })
        );
      } catch (err: any) {
        // if (err.response.data.message == "Rate limit") {
        //   alert("Rate limit");
        // }
        throw new Error();
      }
      console.log("game started");
      getMyInfo(accounts[0].address);
      setSending(false);
      return true;
    } catch (err) {
      console.log("Error occurred in sending token", err);
      localStorage.removeItem("tetrisId");
      setSending(false);
      return false;
    }
  };

  const fetchLeaderboard = async () => {
    var result = await apiCaller.get("tetrises/fetchLeaderboard");
    dispatch(setLeaderboard({ result: result.data.data }));
  };

  useEffect(() => {
    fetchLeaderboard();
    initSocket();
  }, []);

  // useEffect(() => {
  //   getBalance();
  // }, [queryClient, accounts]);

  const initSocket = () => {
    // This part is main for socket.
    if (!(window as any).socket) {
      setTimeout(() => {
        initSocket();
      }, 10);
      return;
    }

    if (!(window as any).listen) {
      (window as any).socket.on("send-leaderboard", (data) => {
        dispatch(setLeaderboard(data));
      });
      (window as any).listen = true;
    }
  };

  const { confLevel } = useSelector((state: any) => ({
    confLevel: state.tetris.confLevel,
  }));

  const startGameNow = async () => {
    console.log(confLevel);
    console.log("current", currentAmount);
    console.log("be amount is ", confLevel);
    console.log("==+==");

    if (sending) return;
    if (confLevel == 0) {
      toast.warn("Select the Confident Level!");
      return;
    }
    if (balance < confLevel) {
      toast.warn("You don't have enough balance!");
      return;
    }

    const payResult = await sendToken(confLevel);
    // console.log('pay=', payResult);

    if (!payResult) {
      toast.error("An error occurred in creating game");
      return;
    }

    (window as any).socket.emit("get-leaderboard", {});
    localStorage.setItem("gameLevel", level.toString());
    setBetAmount("");
    navigate("/tetris");
    console.log("beamount is ", confLevel);
  };

  const isSmallDevice = window.matchMedia(
    "(max-width: 600px) or (max-height:420px)"
  ).matches;

  return (
    <div
      style={{
        marginTop: isSmallDevice ? "60px" : "120px",
        backgroundImage: "url(/images/Group.svg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
      }}
    >
      <div className="flex flex-col justify-center">
        <div
          className="flex flex-row justify-center"
          style={{
            overflowX: "auto",
          }}
        >
          <Card img="/images/easyTile.svg" level={1} text="EASY" />
          <Card img="/images/mediumTile.svg" level={2} text="MEDIUM" />
          <Card img="/images/hardTile.svg" level={3} text="HARD" />
        </div>
        <div>
          <Box />
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <YellowBtn onClick={() => startGameNow()}>
            {!sending ? (
              <div className="flex">
                {" "}
                <img src="/images/powerIcon.svg"></img>
                <p>&nbsp;LET'S GO</p>
              </div>
            ) : (
              <div>SENDING NOW</div>
            )}
          </YellowBtn>
        </div>
      </div>
    </div>
  );
};
export default StartGame;
