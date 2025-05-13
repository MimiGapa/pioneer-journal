import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import "./Header.css";

function Header({ setFeedbackOpen }) { // Add prop
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleFeedbackClick = () => {
    setFeedbackOpen(true); // Trigger modal via App.jsx state
    setMenuOpen(false);    // Close menu
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="PioneerJournal Logo" className="logo-image" />
          <span className="logo-text">PioneerJournal</span>
        </Link>

        <SearchBar />

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <button 
            className="menu-toggle" 
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={menuOpen ? "true" : "false"}
            onClick={toggleMenu}
          >
            <span className={`icon-bars ${menuOpen ? "hidden" : "visible"}`}>
              <i className="fas fa-bars" aria-hidden="true"></i>
            </span>
            <span className={`icon-times ${menuOpen ? "visible" : "hidden"}`}>
              <i className="fas fa-times" aria-hidden="true"></i>
            </span>
          </button>

          <ul className="nav-links">
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/strands" onClick={() => setMenuOpen(false)}>Strands</Link>
            </li>
            <li>
              <Link to="/support-center" onClick={() => setMenuOpen(false)}>Support Center</Link>
            </li>
            <li className="mobile-only">
              <button 
                onClick={handleFeedbackClick} 
                className="mobile-feedback-button"
                aria-label="Give Feedback"
                aria-controls="feedback-modal"
              >
                Give Feedback
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;