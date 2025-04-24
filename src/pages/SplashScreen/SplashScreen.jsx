import React, { useEffect } from "react";
import Lottie from 'react-lottie';
import animationData from '../../../public/assets/animations/splashAnimation.json';
import "./SplashScreen.css";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Adjust the timeout to match your desired splash duration (milliseconds)
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 seconds splash duration (adjust as needed)
    
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* Replace the below with your logo and text per your Figma design */}
        <img src="/assets/logos/PJ_research.png" alt="Site Logo" className="splash-logo" />
        <h1 className="splash-title">The Pioneer Journal</h1>
      </div>
    </div>
  );
}

export default SplashScreen;
