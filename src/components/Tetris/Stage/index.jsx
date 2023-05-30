import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import crypto from "crypto-js";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import StatusRow from "../StatusRow";
import LoseGame from "../LoseGame";
import WinGame from "../WinGame";
import Color from "color";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import moreIcon from "/images/more.svg";
import plusIcon from "/images/plus.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { apiCaller } from "../../../utils/fetcher";
import {
  WalletConnectButton,
  SeiWalletContext,
  useWallet,
  useQueryClient,
  useSigningClient,
  setSkillLevel,
} from "@sei-js/react";
import { toast } from "react-toastify";

const progressbarStyles = {
  path: {
    stroke: "#5CC760",
    strokeWidth: "8px",
  },

  text: {
    fontFamily: "BungeeSpice-Regular",
    fontSize: "20px",
    fill: "#5CC760",
  },
};

const Game = styled.div`
  width: 100vw;
  height: ${(props) => (props.portrait ? "95vh" : "calc(90vh)")};
  display: flex;
  flex-direction: ${(props) => (props.portrait ? "column" : "row")};
  justify-content: center;
  align-items: self-end;
  background-size: cover;
  background-position: center;
  background-image: url(/images/Group.svg);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  @media only screen and (min-height: 550px) {
    margin-top: 50px;
  }

  @media only screen and (max-height: 550px) {
    margin-top: 10px;
  }
`;
// background-image: url(/images/tetris/background.jpg);

const LineBar = styled.div`
  width: ${(props) => "calc(100% + " + props.pixelSize * 2 + "px)"};
  height: 1px;
  background-color: #34305b;
  margin: 10px 0px 5px ${(props) => "calc(" + props.pixelSize * -1 + "px)"};
`;

const ContainerNext = styled.div`
  ${(props) => !props.portrait && `height: ${props.pixelSize * 20 + 24 * 1}px;`}
  ${(props) =>
    props.portrait && `width: ${props.pixelSize * 10 + (10 / 3) * 1}px;`}
	margin-right: ${(props) => (props.portrait ? 0 : props.pixelSize / 3)}px;
  margin-bottom: ${(props) => (props.portrait ? props.pixelSize / 3 : 0)}px;
  display: flex;
  flex-direction: ${(props) => (props.portrait ? "row" : "column")};
  justify-content: ${(props) =>
    props.portrait ? "space-between" : "flex-start"};
  align-items: center;
`;

const YellowBtn = styled.div`
  width: ${(props) => props.pixelSize * 7.2}px;
  text-align: center;
  background-color: #fcd23c;
  border: 2px solid black;
  border-radius: 8px;
  font-size: 16px;
  font-family: IBMPlexMono-Regular;
  text-transform: uppercase;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  display: flex;
  @media only screen and (max-height: 600px) {
    font-size: 14px;
  }

  @media only screen and (max-height: 400px) {
    font-size: 12px;
  }
`;

const Next = styled.div`
  width: ${(props) => props.pixelSize * 7.2}px;
  aspect-ratio: 1;
  background-color: ${(props) => (props.theme3d ? "#444" : "white")};
  transition: background-color 0.5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => (!props.portrait ? 0 : props.pixelSize / 3)}px;
  margin-top: ${(props) => (props.portrait ? 0 : props.pixelSize / 3)}px;
  border: 2px solid black;
  border-radius: 8px;
  box-shadow: 0px 3px 2px black;
`;

const StatsticBoard = styled.div`
  width: ${(props) => props.pixelSize * 7.2}px;
  height: 500px;
  background-color: ${(props) => (props.theme3d ? "#444" : "white")};
  transition: background-color 0.5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-top: ${(props) => (props.portrait ? 0 : props.pixelSize / 3)}px;
  margin-bottom: ${(props) => (props.portrait ? 0 : props.pixelSize / 3)}px;
  margin-right: ${(props) => (!props.portrait ? 0 : props.pixelSize / 3)}px;
  border: 2px solid black;
  border-radius: 8px;
  box-shadow: 0px 3px 2px black;
`;

const StyledStageWrapper = styled.div`
  border: 2px solid black;
  border-radius: 8px;
  background: #6961b8;
  box-shadow: 0px 3px 2px black;
  margin: 0px 50px 0px 50px;
  padding: ${(props) => props.pixelSize * 1}px
    ${(props) => props.pixelSize * 1}px ${(props) => props.pixelSize * 0.5}px
    ${(props) => props.pixelSize * 1}px;
`;

const OptBtnWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const StyledStage = styled.div`
  border: 3px solid white;
  box-shadow: 0 0 0 5px #34305b;
  border-radius: 8px;
  background-color: ${(props) => (props.theme3d ? "#444" : "white")};
  transition: background-color 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Center = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: ${(props) =>
    props.stage ? props.pixelSize : props.pixelSize / 1.6}px;
`;

const Pixel = React.memo(styled.div`
  width: ${(props) =>
    props.stage ? props.pixelSize : props.pixelSize / 1.6}px;
  height: ${(props) =>
    props.stage ? props.pixelSize : props.pixelSize / 1.6}px;
  background-color: ${(props) =>
    props.fill === 1 ? props.color : "inherited"};
  position: relative;
  z-index: ${(props) => props.zIndex};

  ${(props) =>
    props.paused &&
    `
		transition: all 1s;
	`};

  ${(props) =>
    props.fill &&
    props.theme3d &&
    `;
		box-shadow: ${props.pixelSize / 4.16}px ${props.pixelSize / 4.16}px ${
      props.pixelSize / 5.55
    }px #222${
      props.topBloco
        ? `, 0 ${-props.pixelSize / 4.16}px 0 ${Color(props.color).lighten(
            0.2
          )}`
        : ""
    } 
	`};

  ${(props) =>
    !props.theme3d &&
    `
		border-left: 3px solid white
    };
		border-top: 3px solid white
    };	
	`};

  ${(props) =>
    props.hint &&
    `
		border: 0px solid ${Color(props.playerColor).alpha(0.5)};
		background-color: rgba(255,255,255,0.1);
	`};
`);

const ContainerSwitch = styled.div`
  ${(props) =>
    props.portrait &&
    `
		height: 100%;
		width: 100%;
		display: flex;
		align-items: flex-end;
		flex-direction: column;
		justify-content: flex-end;
	`};
`;

const ContainerStatus = styled.div`
  width: ${(props) => props.pixelSize * 8}px;
  ${(props) => !props.portrait && `height: ${props.pixelSize * 20 + 24 * 1}px;`}
  ${(props) =>
    props.portrait && `width: ${props.pixelSize * 10 + (10 / 3) * 1}px;`}
  	margin-top: ${(props) => (props.portrait ? props.pixelSize / 3 : 0)}px;
  margin-right: -25px;
  display: flex;
  flex-direction: ${(props) => (props.portrait ? "row" : "column")};
  align-items: center;
  justify-content: ${(props) =>
    props.portrait ? "space-between" : "flex-start"};
  font-size: ${(props) => props.pixelSize}px;
`;

const getRenderizacaoBloco = (bloco) => {
  let trimRowBloco = [];
  let sumColumn = {};
  bloco.forEach((row, y) => {
    let rowSum = 0;
    row.forEach((pixel) => (rowSum = rowSum + pixel));
    if (rowSum > 0) trimRowBloco.push(row);
    row.forEach((pixel, x) => {
      sumColumn[x] = (sumColumn[x] ? sumColumn[x] : 0) + pixel;
    });
  });
  let trimBloco = [];
  trimRowBloco.forEach((row, y) => {
    let newRow = [];
    row.forEach((pixel, x) => {
      if (sumColumn[x] > 0) newRow.push(pixel);
    });
    trimBloco.push(newRow);
  });
  return trimBloco;
};

const Stage = ({
  lose,
  setLose,
  restartClick,
  map,
  player,
  hint,
  status,
  time,
  paused,
  ...others
}) => {
  const [pixelSize, setPixelSize] = useState(30);
  const [flag, setFlag] = useState(0);
  const [show, setShow] = useState(false);
  const [quest, setQuest] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const { width, height } = useWindowDimensions();
  const [theme3d, setTheme3d] = useState(false);
  const [nextRender, setNextRender] = useState();
  const stageRef = useRef(null);
  const navigate = useNavigate();
  const { skillLevel } = useSelector((state) => ({
    skillLevel: state.tetris.skillLevel,
  }));
  const { supportedWallets, connect, disconnect, installedWallets } =
    useContext(SeiWalletContext);
  const { connectedWallet, offlineSigner, accounts } = useWallet();
  const { beatScore } = useSelector((state) => ({
    beatScore: state.tetris.beatScore,
  }));

  // Orientation
  useEffect(() => {
    const setLandscape = () => {
      if (!beatScore) {
        navigate("/");
      }
      if (window.innerHeight > window.innerWidth) {
        document.documentElement.style.transform = "rotate(90deg)";
        document.documentElement.style.transformOrigin = "top left";
        document.documentElement.style.width = "100vh";
        document.documentElement.style.overflowX = "hidden";
        document.documentElement.style.position = "absolute";
        document.documentElement.style.top = "0";
        document.documentElement.style.left = "0";
      }
    };

    // console.log(width);

    setLandscape();

    window.addEventListener("resize", setLandscape);

    return () => {
      window.removeEventListener("resize", setLandscape);
    };
  }, []);
  // +++++++++

  useEffect(() => {
    if (lose && accounts && accounts.length) {
      const wallet = accounts[0].address;
      const key = "my_secret_key_for_questify";
      const json = JSON.stringify({
        score: status.score,
        result: status.score >= Number(beatScore),
        level: skillLevel,
        timestamp: new Date(),
      });

      const logCode = crypto.AES.encrypt(json, key).toString();
      // const logCode = {
      //   score: 4536,
      //   winStatus: true,
      //   level: 1,
      //   timestamp: new Date(),
      //   hours: 0.1,
      // };

      apiCaller
        .post("tetrises/updateMyFlag", {
          wallet,
          logCode,
        })
        .then((result) => {
          setFlag(result.data.existingUser.tetris.count);
          setShow(true);
          console.log("", result.data.existingUser);
          setQuest(
            result.data.existingUser.tetris.allQuests.length ===
              result.data.existingUser.tetris.receivedQuests.length &&
              result.data.existingUser.tetris.allQuests.every(
                (value, index) =>
                  value ===
                  result.data.existingUser.tetris.receivedQuests[index]
              )
              ? true
              : false
          );
          console.log(quest);
        });
    }
  }, [lose]);

  useEffect(() => {
    let pixelSizeHeight = (height * 0.8) / 20;
    let pixelSizeWidth = width / 32;
    if (portrait) {
      pixelSizeHeight = (height * 0.8) / 26;
      pixelSizeWidth = width / 12;
    }
    setPixelSize(
      pixelSizeWidth < pixelSizeHeight ? pixelSizeWidth : pixelSizeHeight
    );
    setPortrait(height > width);
  }, [width, height, portrait]);

  useEffect(() => {
    if (!player.next) return;
    setNextRender(getRenderizacaoBloco(player.next.bloco));
  }, [player.next]);

  useEffect(() => {
    if (!lose) {
      stageRef.current.focus();
    }
  }, [lose]);

  useEffect(() => {
    stageRef.current.focus();
  }, [theme3d]);

  return (
    <div>
      <Game portrait={portrait}>
        {status && (
          <ContainerStatus portrait={portrait} pixelSize={pixelSize}>
            <YellowBtn pixelSize={pixelSize} className="w-[20%] h-[10vh]">
              Statistic
            </YellowBtn>
            <StatsticBoard
              portrait={portrait}
              theme3d={theme3d}
              pixelSize={pixelSize}
            >
              {/* Score */}
              <StatusRow
                portrait={portrait}
                // borderSize={pixelSize / 10}
                // margin={pixelSize / 3}
                // padding={pixelSize / 2}
                title="SCORE"
                value={status.score.toLocaleString()}
                // value={beatScore}
              />

              {/* Score To Beat */}
              <StatusRow
                backgroundColor={theme3d ? "#444" : "black"}
                portrait={portrait}
                // borderSize={pixelSize / 10}
                // margin={pixelSize / 3}
                // padding={pixelSize / 2}
                title="Score To Beat"
                // value={localStorage.getItem("beatScore").toLocaleString()}
                value={beatScore.toLocaleString()}
              />
              {/* <div
                style={{
                  width: "300px",
                  height: "0px",
                  border: "1px solid black",
                  opacity: "0.1",
                  margin: "16px 0px 0px 0px",
                }}
              /> */}
              <StatusRow
                backgroundColor={theme3d ? "#444" : "black"}
                portrait={portrait}
                // borderSize={pixelSize / 10}
                // margin={pixelSize / 3}
                // padding={pixelSize / 2}
                title="LINES"
                value={status.lines.toLocaleString()}
              />
            </StatsticBoard>

            <YellowBtn pixelSize={pixelSize} className="w-[20%] h-[10vh]">
              Time
            </YellowBtn>
            <Next portrait={portrait} theme3d={theme3d} pixelSize={pixelSize}>
              {/* Timer */}
              <CircularProgressbar
                value={(time * 100) / 120}
                text={`${Math.floor(time / 60)}:${time % 60}`}
                styles={progressbarStyles}
              />
            </Next>
          </ContainerStatus>
        )}

        {map && (
          <StyledStageWrapper pixelSize={pixelSize}>
            <StyledStage
              ref={stageRef}
              {...others}
              theme3d={theme3d}
              pixelSize={pixelSize}
            >
              {map.map((row, y) => (
                <Row stage="true" pixelSize={pixelSize} key={`row-${y}`}>
                  {row.map((pixel, x) => {
                    let playerFill =
                      player.bloco.bloco[y - player.pos[0]] &&
                      player.bloco.bloco[y - player.pos[0]][x - player.pos[1]];
                    let playerHint =
                      hint.bloco.bloco[y - hint.pos[0]] &&
                      hint.bloco.bloco[y - hint.pos[0]][x - hint.pos[1]];
                    let topBloco =
                      (playerFill || pixel.fill) &&
                      (!player.bloco.bloco[y - player.pos[0] - 1] ||
                        !player.bloco.bloco[y - player.pos[0] - 1][
                          x - player.pos[1]
                        ]) &&
                      (!map[y - 1] || !map[y - 1][x].fill);
                    let zIndex =
                      !playerFill && !pixel.fill && playerHint ? 99 : y;
                    // console.log(pixel.color);
                    return (
                      <Pixel
                        paused={paused}
                        theme3d={theme3d}
                        hint={!pixel.fill && !playerFill && playerHint}
                        pixelSize={pixelSize}
                        stage="true"
                        key={`pixel-${x}`}
                        fill={pixel.fill || playerFill}
                        color={playerFill ? player.bloco.color : pixel.color}
                        playerColor={player.bloco.color}
                        topBloco={topBloco}
                        zIndex={zIndex}
                      ></Pixel>
                    );

                    // console.log("s");
                  })}
                </Row>
              ))}
            </StyledStage>
            <LineBar pixelSize={pixelSize} />
            <OptBtnWrapper>
              <img src={plusIcon} className="h-[3vh]" />
              <img src={moreIcon} className="h-[3vh]" />
              <img src={plusIcon} className="h-[3vh]" />
            </OptBtnWrapper>
          </StyledStageWrapper>
        )}

        {nextRender && (
          <ContainerNext portrait={portrait} pixelSize={pixelSize}>
            <YellowBtn pixelSize={pixelSize} className="w-[20%] h-[7vh]">
              Next
            </YellowBtn>
            <Next portrait={portrait} theme3d={theme3d} pixelSize={pixelSize}>
              {nextRender.map((row, y) => (
                <Row pixelSize={pixelSize} key={`row-${y}`}>
                  {row.map((pixel, x) => {
                    let topBloco =
                      pixel && (!nextRender[y - 1] || !nextRender[y - 1][x]);
                    return (
                      <Pixel
                        paused={paused}
                        theme3d={theme3d}
                        topBloco={topBloco}
                        zIndex={y}
                        pixelSize={pixelSize}
                        key={`pixel-${x}`}
                        fill={pixel}
                        color={player.next.color}
                      />
                    );
                  })}
                </Row>
              ))}
            </Next>
            <YellowBtn
              className="w-[20%] h-[7vh]"
              pixelSize={pixelSize}
              onClick={() => {
                setLose(true);
              }}
              style={{
                position: "absolute",
                bottom: "50px",
                border: "1px solid #EC5D42",
                background: "white",
                fontFamily: "BungeeSpice-Regular",
                color: "#F04902",
                marginBottom: "-25px",
                cursor: "pointer",
                padding: "10px",
                boxShadow: "0px 3px 2px #EC5D42",
              }}
            >
              <img src="/images/backIcon.svg" className="w-[20%]"></img>
              &nbsp;
              <p>QUIT</p>
            </YellowBtn>
          </ContainerNext>
        )}
      </Game>

      {/* Finish Game */}
      {/* <div className="absolute bottom-5 right-5">
				<PrimaryButton
					caption={"Finish a Game"}
					onClick={() => {
						setLose(true);
					}}
					styles="!px-[30px]"
				/>
			</div> */}
      {lose && show && status.score >= Number(beatScore) && (
        <WinGame
          flag={flag}
          portrait={portrait}
          restartClick={restartClick}
          status={status}
          pixelSize={pixelSize}
          theme3d={theme3d}
          wallet={accounts[0].address}
          isQuest={!quest}
        ></WinGame>
      )}

      {lose && show && Number(status.score) < Number(beatScore) && (
        <LoseGame
          flag={flag}
          portrait={portrait}
          restartClick={restartClick}
          status={status}
          pixelSize={pixelSize}
          theme3d={theme3d}
          wallet={accounts[0].address}
          isQuest={!quest}
        ></LoseGame>
      )}

      {/* {lose &&
        Number(status.score) < Number({ beatScore }) &&
        toast.info("hey!")} */}
    </div>
  );
};

export default Stage;
