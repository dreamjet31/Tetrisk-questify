import React, { useState, useEffect, useRef, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/wallet.css";

const ProgressBar = (props) => {
  const { currentStep, myfunc } = props;

  return (
    <div
      style={{
        width: "100%",
        height: 30,
        backgroundColor: "#E0E0E0",
        borderRadius: 12,
        border: "2px solid black",
      }}
    >
      <div
        style={{
          width: `${(currentStep / 4) * 100 + 3}%`,
          height: "100%",
          backgroundColor: "#A5E599",
          borderRadius: 8,
          borderRight: "2px solid black",
        }}
      />
      <div
        style={{
          marginTop: "-26px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flexBasis: "25%",
            boxSizing: "border-box",
            borderRight: "2px solid gray",
          }}
        ></div>
        <div
          style={{
            flexBasis: "25%",
            boxSizing: "border-box",
            borderRight: "2px solid gray",
          }}
        ></div>
        <div
          style={{
            flexBasis: "25%",
            boxSizing: "border-box",
            borderRight: "2px solid gray",
          }}
        ></div>
      </div>
      <img
        src="./images/logo2.png"
        style={{
          width: "22px",
          height: "22px",
          marginTop: "-24px",
          marginLeft: "2px",
        }}
      />
      <div
        style={{
          marginTop: "-25px",
          marginLeft: "30px",
          fontSize: "14pt",
          fontWeight: "bold",
          fontFamily: "BungeeSpice-Regular",
        }}
      >
        {currentStep}/4
      </div>
      <img
        src={
          currentStep === 4
            ? "./images/treasure1.png"
            : "./images/treasure0.png"
        }
        className={currentStep === 4 ? "bouncing-ball" : "normal-ball"}
        onClick={() => {
          currentStep === 4 ? myfunc() : void 0;
        }}
      />
    </div>
  );
};

export default ProgressBar;
