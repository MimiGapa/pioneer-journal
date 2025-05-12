import React, { useState, useEffect } from 'react';
import './BackToTop.css';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && 
        <button 
          onClick={scrollToTop} 
          className="back-to-top"
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up" aria-hidden="true"></i>
          <span className="sr-only">Back to top</span>
        </button>
      }
    </>
  );
}

export default BackToTop;
