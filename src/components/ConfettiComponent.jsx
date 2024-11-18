import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./ConfettiComponent.css";

const ConfettiComponent = ({ showConfetti }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!showConfetti) return null;

  return (
    <div className="confetti-wrapper">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false} // Confetti will only appear once
        numberOfPieces={200} // Adjust number of pieces for desired effect
      />
    </div>
  );
};

export default ConfettiComponent;
