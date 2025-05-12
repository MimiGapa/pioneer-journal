import React, { useEffect } from "react";
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
        <picture>
          <source srcSet="/assets/logos/PJ_research.webp" type="image/webp" />
          <img src="/assets/logos/PJ_research.png" alt="PioneerJournal Logo" className="splash-logo" />
        </picture>
        <h1 className="splash-title">The Pioneer Journal</h1>
      </div>
    </div>
  );
}

export default SplashScreen;
