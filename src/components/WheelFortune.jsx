import "./styles.css";
import { Button } from "@mui/material";
import BackImg from "../assets/back.png";
import Flame from "../assets/flame.png"
import Bonus1 from "../assets/bonus1.png";
import Bonus2 from "../assets/bonus2.png";
import Leagure from "../assets/league.png";
import React, { useRef, useState, useEffect } from 'react';
import './Wheel.css';


Number.prototype.format = function (n) {
  const r = new RegExp('\\d(?=(\\d{3})+' + (n > 0 ? '\\.' : '$') + ')', 'g');
  return this.toFixed(Math.max(0, Math.floor(n))).replace(r, '$&,');
};

export default function WheelFortune() {
  const [showResult, setShowResult] = useState(false);
  const [showButton, setShowButton] = useState(0);
  const [showFlame, setShowFlame] = useState(false);

  const [moveText, setMoveText] = useState(false);
  const [moveText1, setMoveText1] = useState(false);

  const [tempResult1, setTempResult1] = useState(false);
  const [tempResult2, setTempResult2] = useState(false);

  const [platinum, setPlatinum] = useState(4);
  const [logInDays, setLogInDays] = useState(10);
  const [showLeague, setShowLeague] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [countSpin, setCountSpin] = useState(0);
  const [sectors, setSectors] = useState([
    { color: "#3986E2", label: "1" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "2" },
    { color: "#3986E2", label: "3" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "5" },
    { color: "#3986E2", label: "10" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "x2 ref" },
    { color: "#3986E2", label: "x5 ref" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "x10 ref" },
  ]);

  const [currentValues, setCurrentValues] = useState([
    { color: "#3986E2", label: "1" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "2" },
    { color: "#3986E2", label: "3" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "5" },
    { color: "#3986E2", label: "10" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "x2 ref" },
    { color: "#3986E2", label: "x5 ref" },
    { color: ["#1C3994", "#1A3791", "#173394", "#173394", "#112B6B", "#092127", "#0921a7"], label: "x10 ref" },
  ]);
  const [isRendered, setIsRendered] = useState(false);
  const [duration, setDuration] = useState(20000);
  const [originalSize, setOriginalSize] = useState(false);
  const [isVibration, setIsVibration] = useState(false);

  useEffect(() => {
    if (!isRendered) {
      setIsRendered(true)
      return;
    }
    const startTime = Date.now();
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const updateCounters = () => {
      const elapsed = (Date.now() - startTime) / duration;
      const progress = easeOutExpo(Math.min(elapsed, 1));

      setCurrentValues(sectors.map((sector, index) => {
        if (index >= 5) {
          return sector;
        } else {
          const endValue = Number(sector.label);
          return { label: Math.floor(progress * endValue), color: sector.color };
        }
      }));

      if (elapsed < 1) {
        requestAnimationFrame(updateCounters);
      } else {
        setCurrentValues(sectors);
      }
    };

    updateCounters();
  }, [sectors]);

  const TAU = 2 * Math.PI;
  const arc = TAU / sectors.length;
  // const friction = 0.998;
  const friction = 0.997;
  const angVelMin = 0.002;
  const angVelMaxRef = useRef(0);
  const angVelRef = useRef(0); // Current angular velocity
  const angRef = useRef(0); // Angle rotation in radians
  const isAcceleratingRef = useRef(false);

  const rand = (min, max) => Math.random() * (max - min) + min;

  const getIndex = () => Math.floor(sectors.length - (angRef.current / TAU) * sectors.length) % sectors.length;

  const convertNumber = (number) => {
    if (String(number).includes(" "))
      return number;
    if (number >= 1000000) {
      return `${number / 1000000}B`;
    } else if (number >= 1000) {
      return `${number / 1000}M`;
    }
    return `${number}K`;
  }

  const drawSector = (ctx, sector, i, rad) => {
    const ang = arc * i;
    ctx.save();
    ctx.beginPath();
    if (typeof (sector.color) === "string") {
      // If the color is a single color (less than 10 characters), use it as fill style
      ctx.fillStyle = sector.color;
    } else {
      //   // Create a radial gradient with the provided color array
      const gradient = ctx.createRadialGradient(
        rad, rad, 0,         // Start circle at the center with radius 0
        rad, rad, rad       // End circle at the center with the radius of the sector
      );

      // Distribute the color stops evenly
      const colorStops = sector.color;
      gradient.addColorStop(0.52, colorStops[0]);
      gradient.addColorStop(0.60, colorStops[1]);
      gradient.addColorStop(0.70, colorStops[2]);
      gradient.addColorStop(0.80, colorStops[3]);
      gradient.addColorStop(0.89, colorStops[4]);
      gradient.addColorStop(0.93, colorStops[5]);

      ctx.fillStyle = gradient;
    }

    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    const textWidth = ctx.measureText(sector.label).width;
    const x = textWidth;
    ctx.fillText(convertNumber(sector.label), (250 - x) / 2, 10);
    ctx.restore();
  };

  const rotate = (ctx, rad) => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${angRef.current - Math.PI / 2}rad)`;

    if (!angVelRef.current && countSpin !== 0) {
      console.log('Bingo $' + sector.label);
    }
  };

  const frame = (ctx, rad) => {
    if (!isSpinning) return;
    if (angVelRef.current >= angVelMaxRef.current) {
      isAcceleratingRef.current = false;
    }

    if (isAcceleratingRef.current) {
      // Accelerate
      angVelRef.current = angVelRef.current || angVelMin; // Initial velocity kick
      angVelRef.current *= 1.06; // Accelerate
    } else {
      // Decelerate
      isAcceleratingRef.current = false;
      angVelRef.current *= friction; // Decelerate by fricti

      // Stop spinning
      if (angVelRef.current < angVelMin) {
        console.log(angVelRef.current, angVelMin);
        setIsSpinning(false);
        angVelRef.current = 0;
      }
    }

    angRef.current += angVelRef.current; // Update angle
    angRef.current %= TAU; // Normalize angle
    rotate(ctx, rad);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const dia = ctx.canvas.width;
    const rad = dia / 2;

    currentValues.forEach((sector, i) => drawSector(ctx, sector, i, rad));
    rotate(ctx, rad);

    const engine = () => {
      frame(ctx, rad);
      requestRef.current = requestAnimationFrame(engine);
    };

    engine();

    return () => cancelAnimationFrame(requestRef.current);
  }, [isSpinning, currentValues]);

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
      setShowFlame(true);
    }

    displayItems();

    setTimeout(() => {
      setMoveText(1);
    }, 2300); // Show result

    setTimeout(() => {
      setMoveText1(1);
    }, 2500); // Show result

    setTimeout(() => {
      setMoveText(2);
      setMoveText1(2);
    }, 3800); // Show result

    setTimeout(() => {
      setTempResult1(true);
    }, (3300));

    setTimeout(() => {
      setTempResult2(true);
    }, (3400));

    setTimeout(() => {
      setTempResult1(false);
      setTempResult2(false);
    }, 4400);

    setTimeout(() => {
      setShowResult(true);
    }, 4100);

    // setTimeout(() => {
    //   setShowResult(true);
    // }, 3300); // Show result

    setTimeout(() => {
      setIsVibration(true);
    }, 4800)

    const duration = 4000 * platinum * logInDays / 40;
    setTimeout(() => {
      const multipliedSectors = sectors.map((item) => {
        const value = parseInt(item.label); // Try to convert the option to a number
        if (!isNaN(value)) {
          return { label: (value * platinum * logInDays).toString(), color: item.color }; // Multiply by 10 if it's a number
        }
        return item; // Return the item unchanged if it's not a number
      });

      setSectors(multipliedSectors);
      setDuration(duration);
    }, 5000);

    setTimeout(() => {
      setOriginalSize(true);
    }, 5000)


    setTimeout(() => {
      setShowButton(1);
    }, 4500 + duration);

  }, []);

  const handleSpinClick = () => {
    if (showResult) {
      if (isSpinning) return;
      setIsSpinning(true);
      setCountSpin((prev) => prev + 1);

      isAcceleratingRef.current = true;
      angVelMaxRef.current = rand(0.25, 0.4);

      console.log("handleSpin:", isAcceleratingRef.current, angVelMaxRef.current)
      setShowButton(2);
    }
  };



  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 16;
  const displayDuration = 2000;
  const intervalDuration = displayDuration / totalImages;

  const customStyle1 = {
    '--i': 1,
  }

  const customStyle2 = {
    '--i': 2,
  }

  const customStyle3 = {
    '--i': 3,
  }

  const resultStyles = [
    customStyle1,
    customStyle2,
    customStyle3
  ]

  return (
    <div className={`wheel-fortune-container ${isVibration ? "wheel-vibration" : ""}`}>
      <div className="bonus-section">
        <div className={`bonus-league ${showLeague ? "fade-in-league" : ""}`}>
          <span>League</span>
          <div style={{ position: "relative" }}>
            <div>
              <img src={Bonus1} />
            </div>
            <span className="text-league">{platinum}x</span>
            <div className={`${moveText == 1 ? "movable-text-league" : moveText == 2 ? "movable-text-streak2" : ""} text-league`}>
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
            <div className={`${moveText1 == 1 ? "movable-text-streak" : moveText1 == 2 ? "moveable-text-streak2" : ""} text-streak`}>
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
            {/* <WheelOfFortune /> */}
            <canvas ref={canvasRef} id="wheel" width="330" height="330"></canvas>
          </div>
          <div className="border-img">
            <img src={BackImg} alt="Wheel Background" />
          </div>
          {
            // showResult && <div className={`flame-effect ${showFlame ? "show-flame" : ""}`}>
            //   <img
            //     src={`/img/${imageUrls[currentImageIndex]}`}
            //     alt="Slideshow"
            //     style={{ maxWidth: '', display: 'block', margin: '0 auto' }}
            //   />
            // </div>
          }

          {/* <div className={`result-text ${(showResult && !originalSize) ? "show" : ""} ${originalSize ? "original" : ""}`}> */}
          {/* <div style={{ width: "100%", position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", top: "62px" }}>
            <span className={`temp-result ${tempResult1 ? "show-temp" : ""}`}>{platinum}x</span>
            <span className={`temp-result1 ${tempResult2 ? "show-temp" : ""}`}>{logInDays}x</span>
          </div> */}

          {/* <div style={{ width: "100%", position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", top: "62px" }}>
            <span className={`result ${showResult ? "show-result" : ""}`}>{platinum * logInDays}x</span>
          </div> */}
          {/* <div className="temp-result">
            <span className="result-logindays">{logInDays}x</span>
          </div> */}
          <div className={`result-text ${showResult ? "show" : ""}`}>
            <div>
              <span style={customStyle1}>x</span>
              {
                (platinum * logInDays).toString().split('').map((char, index) => <span key={index} style={resultStyles[index % 3]}>{char}</span>)
              }
            </div>
          </div>
          {/* <div className={`result-text ${showResult ? "show" : ""}`}>
            <div>
              <span style={customStyle1}>x</span>
              {
                (platinum * logInDays).toString().split('').map((char, index) => <span key={index} style={resultStyles[index % 3]}>{char}</span>)
              }
            </div>
          </div> */}

        </div>

        <Button
          variant="contained"
          className={`spin-btn ${showButton === 1 ? "show-btn" : ""}`}
          onClick={handleSpinClick}
        >
          Вращать
        </Button>

      </div>
    </div>
  );
}
