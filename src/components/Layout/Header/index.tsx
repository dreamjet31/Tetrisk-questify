import React, { useContext, useEffect, useState } from "react";
import { WalletWindowKey } from "@sei-js/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setConnectionState,
  setMyWalletAddress,
  setMyBalance,
} from "../../../redux/slices/tetrisSlice";
import { apiCaller } from "../../../utils/fetcher";
import { SeiWalletContext, useWallet } from "@sei-js/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  fontFamily: "IBMPlexMono-Regular",
  p: 4,
};

const Header = () => {
  const dispatch = useDispatch();
  const { supportedWallets, connect, disconnect, installedWallets } =
    useContext(SeiWalletContext);
  const { connectedWallet, offlineSigner, accounts } = useWallet();

  const [active, setActive] = useState(0);
  const { connectionState } = useSelector((state: any) => ({
    connectionState: state.tetris.connectionState,
  }));

  const { myWalletAddress } = useSelector((state: any) => ({
    myWalletAddress: state.tetris.myWalletAddress,
  }));

  const { balance } = useSelector((state: any) => ({
    balance: state.tetris.balance,
  }));

  const [myAddress, setMyAddress] = useState("");

  const getMyInfo = async (wallet: string) => {
    if (accounts && accounts.length) {
      var result = await apiCaller.post("tetrises/getMyInfo", {
        wallet,
      });
      dispatch(setMyBalance({ balance: result.data.data.totalBalance }));
    }
  };

  useEffect(() => {
    const connected = localStorage.getItem(
      "connectedWallet"
    ) as WalletWindowKey;
    if (connected) {
      connect(connected);
    }
  }, []);

  useEffect(() => {
    if (connectedWallet) {
      localStorage.setItem("connectedWallet", connectedWallet);
    } else {
      localStorage.removeItem("connectedWallet");
    }
  }, [connectedWallet]);

  useEffect(() => {
    if (accounts && accounts.length) {
      setMyAddress(accounts[0].address);
      getMyInfo(accounts[0].address);
      dispatch(setConnectionState({ state: !connectionState }));
      dispatch(setMyWalletAddress({ address: accounts[0].address }));
    }
  }, [accounts]);

  // Dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [betAmount, setBetAmount] = useState(0);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [collapse, setCollapse] = React.useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <ToastContainer
        style={{ fontSize: "14px", zIndex: "1000" }}
        autoClose={2000}
        hideProgressBar={true}
      />
      <div className="flex">
        <div
          className="flex flex-row h-full
                      lg:justify-between md:justify-around sm:justify-between xs:justify-between"
        ></div>
      </div>
      <div className="flex flex-row justify-end">
        {collapse && (
          <div className="flex flex-row justify-end">
            {connectedWallet == ("keplr" as WalletWindowKey) && (
              <div
                className="wallet-adapter-button flex justify-end items-center my-[15px] "
                onClick={() => {}}
              >
                <div className="flex flex-row">
                  <p>&nbsp;{Math.floor(Number(balance) * 10000) / 10000}</p>
                  <img
                    src="/images/logo2.png"
                    className="mx-[6px] w-[18px] h-[18px]"
                  ></img>
                </div>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={modalStyle}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      sx={{ textAlign: "center" }}
                    >
                      Deposite
                    </Typography>
                    <div className="flex flex-row mt-3">
                      <TextField
                        id="outlined-number"
                        label="Deposite amount"
                        type="number"
                        size="small"
                        value={betAmount}
                        onChange={(e) => {
                          try {
                            setBetAmount(Number(e.target.value));
                          } catch (err) {
                            toast.warn("Input correct amount");
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <div className="wallet-adapter-button flex justify-end ml-3 bg-[#fcd23c]">
                        Deposite
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
            )}

            <div className="wallet-adapter-button flex justify-end items-center my-[15px]  mx-[25px]">
              {connectedWallet != ("keplr" as WalletWindowKey) ? (
                <div
                  className="flex flex-row"
                  onClick={async () => {
                    if (!window.keplr) {
                      toast.warn("Please install keplr extension");
                    } else {
                      connect("keplr");
                    }
                  }}
                >
                  <img src="/images/SEI.svg"></img>
                  <p>&nbsp;Connect Wallet</p>
                </div>
              ) : (
                <div
                  className="flex flex-row"
                  onClick={() => {
                    disconnect();
                    dispatch(setConnectionState({ state: !connectionState }));
                  }}
                >
                  <img src="/images/SEI.svg"></img>
                  <p>
                    &nbsp;{" "}
                    {myWalletAddress.substring(0, 6) +
                      "..." +
                      myAddress.substring(myAddress.length - 3)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {
          <div className="flex justify-end">
            <div
              className="wallet-adapter-button flex justify-end  my-[15px]  mr-[25px]"
              onClick={() => setCollapse(!collapse)}
            >
              <img src="images/threeDots.png" className="w-[25px]" />
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Header;
