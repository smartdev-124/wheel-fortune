import "./styles.css";
import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Button } from "@mui/material";
import BackImg from "../assets/back.png";
import Flame from "../assets/flame.png"
import Bonus1 from "../assets/bonus1.png";
import Bonus2 from "../assets/bonus2.png";
import Leagure from "../assets/league.png";

export default function WheelFortune() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showButton, setShowButton] = useState(0);
  const [showFlame, setShowFlame] = useState(false);
  const [moveText, setMoveText] = useState(false);

  const [platinum, setPlatinum] = useState(4);
  const [logInDays, setLogInDays] = useState(10);

  const [data, setData] = useState([
    { option: "1000" },
    { option: "2000" },
    { option: "3000" },
    { option: "5000" },
    { option: "10000" },
    { option: "x2 ref" },
    { option: "x5 ref" },
    { option: "x10 ref" },
  ]);

  const bgs = [
    "#3986E2",
    "#FFF0",
  ];

  const [showLeague, setShowLeague] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  useEffect(() => {
    const displayItems = () => {
      setTimeout(() => {
        setShowLeague(true);
      }, 500); // Delay for bonus-league

      setTimeout(() => {
        setShowStreak(true);
      }, 700); // Delay for bonus-streak

      setTimeout(() => {
        setShowWheel(true);
      }, 1000); // Delay for wheel-fortune
    }

    displayItems();

    setTimeout(() => {
      setMoveText(true);
    }, 2300); // Show result
    
    setTimeout(() => {
      setShowResult(true);

    }, 3300); // Show result

    setTimeout(() => {
      const multipliedData = data.map((item) => {
        const value = parseInt(item.option); // Try to convert the option to a number
        if (!isNaN(value)) {
          return { option: (value * platinum * logInDays).toString() }; // Multiply by 10 if it's a number
        }
        return item; // Return the item unchanged if it's not a number
      });

      setData(multipliedData);
    }, 4000);

    setTimeout(() => {
      setShowFlame(true);
    }, 2400);

    setTimeout(() => {
      setShowButton(1);
    }, 5000); // Show button

  }, []);

  const handleSpinClick = () => {
    if (showResult) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      console.log(data[newPrizeNumber].option);
      setMustSpin(true);
      setShowButton(2);
    }
  };

  return (
    <div className="wheel-fortune-container">
      <div className="bonus-section">
        <div className={`bonus-league ${showLeague ? "fade-in-league" : ""}`}>
          <span>League</span>
          <div style={{ position: "relative" }}>
            <div>
              <img src={Bonus1} />
            </div>
            <span className="text-league">{platinum}x</span>
            <div className={`${moveText ? "movable-text-league" : ""} text-league`}>
              <span>{platinum}x</span>
            </div>
          </div>
          <div className="bottom">
            <span>Платина</span>
            <img src={Leagure} width={20} />
          </div>
        </div>
        <div className={`bonus-streak ${showStreak ? "fade-in-streak" : ""}`}>
          <span>Streak</span>
          <div style={{ position: "relative" }}>
            <div>
              <img src={Bonus2} />
            </div>
            <span className="text-streak">{logInDays}x</span>
            <div className={`${moveText ? "movable-text-streak" : ""} text-streak`}>
              <span>{logInDays}x</span>
            </div>
          </div>
          <div className="bottom">
            <span>Дней входа</span>
            <span className="login-days">{logInDays}</span>
          </div>
        </div>
      </div>
      <div>
        <div className={`wheel-fortune ${showWheel ? "fade-in-wheel" : ""}`}>
          <div className="wheel">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              outerBorderWidth={1}
              outerBorderColor="none"
              pointerProps={{
                style: {
                  position: "absolute",
                  top: "0px",
                  left: "215px",
                  width: "0.0001px",
                },
              }}
              radiusLineWidth={0}
              textColors={["#AED5FF"]}
              backgroundColors={bgs}
              onStopSpinning={() => {
                setMustSpin(false);
                // setShowFlame(true);
              }}
              spinDuration={0.3}
              fontSize={20}
              fontFamily="Manrope"
            />
          </div>
          <div className="border-img">
            <img src={BackImg} alt="Wheel Background" />
          </div>
          <div className={`flame-effect ${showFlame ? "show-flame" : ""}`}>
            <img src={Flame} alt="Flame" height="530px" />
          </div>
          <div className={`result-text ${showResult ? "show" : ""}`}>
            <span>x{platinum * logInDays}</span>
          </div>
        </div>

        <Button
          variant="contained"
          // className={`spin-btn ${showButton === 1 ? "show-btn" : ""}`}
          onClick={handleSpinClick}
        >
          Вращать
        </Button>
      </div>
    </div>
  );
}
