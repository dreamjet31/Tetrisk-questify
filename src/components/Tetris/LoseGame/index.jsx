import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProgressBar from "../Game/ProgressBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiCaller } from "../../../utils/fetcher";

const isSmallDevice = window.matchMedia(
  "(max-width: 600px) or (max-height:420px)"
).matches;

const CenterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContainerWrapper = styled.div`
  border: 2px solid black;
  border-radius: 8px;
  background: #6961b8;
  box-shadow: 0px 3px 2px black;
  margin: 0px 50px 0px 50px;
  padding: 25px 25px 25px 25px;
`;

const ContainerLose = styled.div`
  border: 3px solid white;
  box-shadow: 0 0 0 5px #34305b;
  border-radius: 8px;
  background-color: ${(props) => (props.theme3d ? "#444" : "white")};
  transition: background-color 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 360px;
  height: ${() => (isSmallDevice ? 240 : 400)}px;
`;

// console.log("lose game");

const LoseGame = ({
  flag,
  status,
  portrait,
  pixelSize,
  theme3d,
  restartClick,
  wallet,
}) => {
  const navigate = useNavigate();
  const { confLevel } = useSelector((state) => ({
    confLevel: state.tetris.confLevel,
  }));

  const quitGame = () => {
    navigate("/");
  };

  const resetMyFlag = async () => {
    // console.log("resetmyflag is called!");
    var result = await apiCaller.post("tetrises/resetMyFlag", {
      wallet,
    });
    // console.log("🪙", result.data);
    if (result.data.boost)
      toast.info(`You got ${result.data.boost} balance for reward!`);
    else toast.info("You are unlucky at this time. No reward!");
    navigate("/");
  };

  useEffect(() => {
    // console.log(confLevel);
  }, [confLevel]);

  return (
    <CenterOverlay className="flex flex-col">
      <div
        style={{ alignContent: "center", marginBottom: "-60px", zIndex: "2" }}
      >
        <img src="/images/loseRibbon.svg"></img>
      </div>
      <ContainerWrapper>
        <ContainerLose
          portrait={portrait}
          pixelSize={pixelSize}
          theme3d={theme3d}
        >
          <div
            style={
              isSmallDevice ? { marginLeft: "-160px", marginTop: "20px" } : {}
            }
          >
            <img src="/images/Dead.svg"></img>
          </div>
          <div
            style={
              isSmallDevice
                ? {
                    fontSize: "14px",
                    marginTop: "-160px",
                    marginLeft: "140px",
                    fontWeight: "bold",
                  }
                : { fontSize: "14px", marginTop: "-20px", fontWeight: "bold" }
            }
          >
            You Lost
          </div>
          <div
            style={
              isSmallDevice
                ? {
                    color: "#F04902",
                    marginLeft: "140px",
                    fontFamily: "BungeeSpice-Regular",
                  }
                : { color: "#F04902", fontFamily: "BungeeSpice-Regular" }
            }
            className="flex items-center"
          >
            {confLevel}
            <img
              src="/images/logo2.png"
              className="mx-[6px] w-[20px] h-[20px]"
            />
          </div>
          <div
            className="yellow-button mt-3 mb-6 w-[120px]"
            style={isSmallDevice ? { marginLeft: "140px" } : {}}
            onClick={() => quitGame()}
          >
            OK
          </div>
          <div className="flex mt-3 mb-6 w-[300px]">
            <ProgressBar currentStep={flag} myfunc={resetMyFlag} />
          </div>
        </ContainerLose>
      </ContainerWrapper>
    </CenterOverlay>
  );
};

export default LoseGame;
