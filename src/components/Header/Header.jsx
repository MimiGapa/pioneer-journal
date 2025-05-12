import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import Feedback from "../Feedback/Feedback";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleFeedbackClick = () => {
    setFeedbackOpen(true);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className={`nav-overlay ${menuOpen ? "active" : ""}`} onClick={toggleMenu}></div>
      
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
            onClick={toggleMenu}>
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
              <button onClick={handleFeedbackClick} className="mobile-feedback-button">
                Give Feedback
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {feedbackOpen && <Feedback onClose={() => setFeedbackOpen(false)} />}
    </header>
  );
}

export default Header;
