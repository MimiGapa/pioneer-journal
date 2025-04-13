// src/pages/HomePage/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to Pioneer Journal</h1>
      <p>Explore research papers from various academic strands:</p>
      
      <div className="strand-links">
        <Link to="/strand/stem" className="strand-link">
          <div className="strand-card">
            <h2>STEM</h2>
            <p>Science, Technology, Engineering, and Mathematics</p>
          </div>
        </Link>
        
        <Link to="/strand/humss" className="strand-link">
          <div className="strand-card">
            <h2>HUMSS</h2>
            <p>Humanities and Social Sciences</p>
          </div>
        </Link>
        
        <Link to="/strand/abm" className="strand-link">
          <div className="strand-card">
            <h2>ABM</h2>
            <p>Accountancy, Business, and Management</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
