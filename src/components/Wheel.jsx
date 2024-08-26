import React, { useRef, useState, useEffect } from 'react';
import './Wheel.css';

// List of sectors
const sectors = [
  { color: "red", label: "100" },
  { color: "#fff", label: "10" },
  { color: "red", label: "200" },
  { color: "#fff", label: "50" },
  { color: "red", label: "100" },
  { color: "#fff", label: "5" },
  { color: "red", label: "500" },
  { color: "#fff", label: "5" },
  { color: "red", label: "100" },
  { color: "#fff", label: "10" },
  { color: "red", label: "200" },
  { color: "#fff", label: "50" },
  { color: "red", label: "100" },
  { color: "#fff", label: "5" },
  { color: "red", label: "500" },
  { color: "#fff", label: "5" },
  { color: "red", label: "100" },
  { color: "#fff", label: "10" },
  { color: "red", label: "200" },
  { color: "#fff", label: "50" },
  { color: "red", label: "100" },
  { color: "#fff", label: "5" },
  { color: "red", label: "500" },
  { color: "#fff", label: "5" },
  { color: "red", label: "100" },
  { color: "#fff", label: "10" },
  { color: "red", label: "200" },
  { color: "#fff", label: "50" },
  { color: "red", label: "100" },
  { color: "#fff", label: "5" },
  { color: "red", label: "500" },
  { color: "#fff", label: "5" }
];

// Generate random float in range min-max
const rand = (m, M) => Math.random() * (M - m) + m;

const WheelOfFortune = () => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angVel, setAngVel] = useState(0);
  const [ang, setAng] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [angVelMax, setAngVelMax] = useState(0);
  const [countSpin, setCountSpin] = useState(0);

  const tot = sectors.length;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;
  const friction = 0.995; // Slightly higher for smoother deceleration
  const angVelMin = 0.001; // Lower threshold for smoother stopping

  const drawSector = (sector, i, ctx, rad) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText('$' + Number(sector.label) * 100, rad - 10, 10);
    //
    ctx.restore();
  };

  const rotate = (ctx, rad) => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    if (!angVel) {
      document.querySelector("#spin").textContent = "SPIN";
    } else {
      document.querySelector("#spin").textContent = sector.label;
    }
    if (!angVel && countSpin !== 0) {
      // alert('Bingo $' + Number(sector.label) * 100);
    }
  };

  const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rad = canvas.width / 2;

    // Draw sectors initially
    sectors.forEach((sector, i) => drawSector(sector, i, ctx, rad));
  }, []); // Empty dependency array means this runs only once on mount

  let requestId;
  const startEngine = () => {
    frame();
    requestId = requestAnimationFrame(startEngine);
  };

  const stopEngine = () => {
    cancelAnimationFrame(requestId);
  }

  useEffect(() => {
    if (isSpinning) {
      startEngine();
    } else {
      stopEngine();
    }
  }, [isSpinning])

  const frame = () => {
    if (!isSpinning) return;

    let currentAngVel = angVel;

    if (currentAngVel >= angVelMax) setIsAccelerating(false);

    // Accelerate
    if (isAccelerating) {
      currentAngVel = currentAngVel || angVelMin; // Initial velocity kick
      currentAngVel *= 1.05; // Slightly less aggressive acceleration

    }

    // Decelerate
    else {
      setIsAccelerating(false);
      currentAngVel *= friction; // Decelerate by friction

      // SPIN END
      if (currentAngVel < angVelMin) {
        setIsSpinning(false);
        currentAngVel = 0;
      }
    }

    setAng(prevAng => (prevAng + currentAngVel) % TAU); // Update angle
    console.log(ang)

    setAngVel(currentAngVel);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rad = canvas.width / 2;

    console.log(currentAngVel, rad)
    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw sectors
    sectors.forEach((sector, i) => drawSector(sector, i, ctx, rad));
    rotate(ctx, rad);
  };


  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsAccelerating(true);
    setAngVelMax(rand(0.25, 0.4));
    setCountSpin(prevCount => prevCount + 1);
  };

  return (
    <div id="wheelOfFortune">
      <canvas ref={canvasRef} width="500" height="500"></canvas>
      <div id="spin" onClick={handleSpinClick}>SPIN</div>
    </div>
  );
};

export default WheelOfFortune;
