import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">PioneerJournal</span>
        </Link>

        <SearchBar />
        
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <button className="menu-toggle" onClick={toggleMenu}>
            <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>
          
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/strands" onClick={() => setMenuOpen(false)}>Strands</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
