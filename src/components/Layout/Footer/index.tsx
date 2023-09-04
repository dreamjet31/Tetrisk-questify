import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const isSmallDevice = window.matchMedia(
    "(max-width: 600px) or (max-height:420px)"
  ).matches;

  function muteOption(option) {
    option ? toast.info("Volumen On") : toast.info("Volume Off");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 ">
      <a href="https://app.questify.gg" target={"_blank"}>
        <div
          className="wallet-adapter-button fixed left-4 bottom-4 align-text-center flex flex-row"
          // onClick={() => window.open(" https://app.questify.gg")}
        >
          {" "}
          <img src="images/Backward.png" style={{ width: "25px" }}></img>
        </div>
      </a>
      {!isSmallDevice && (
        <div className=" fixed right-4 bottom-4 flex cursor-pointer flex-col">
          <img src="images/logo-wrapper.svg"></img>
          <div className="mt-[5px] flex justify-end items-center text-[14px]">
            POWERED BY
            <a href="https://questify.gg" target={"_blank"}>
              <img
                src="images/logo2.png"
                className="mx-[6px] w-[18px] h-[18px]"
              />
            </a>
            +
            <a href="https://www.tatami.games" target={"_blank"}>
              <img src="images/logo1.svg" className="ml-[6px]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
