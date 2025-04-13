import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-container">
          <div className="footer-info">
            <div className="footer-logo">
              <img src="/assets/logos/SINHS_logo.png" alt="SINHS Logo" />
            </div>
            <div className="footer-content">
              <h3>Siniloan Integrated National High School</h3>
              <p>The Pioneer Journal of Multidisciplinary Research</p>
            </div>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul className="footer-links">
              <li><i className="fas fa-map-marker-alt"></i> L. de Leon St., Siniloan, Laguna</li>
              <li><i className="fas fa-phone"></i> (049) 591-0182</li>
              <li><i className="fas fa-envelope"></i> 301273@deped.gov.ph</li>
              <li>
                <a href="https://www.facebook.com/BEdakasaSINHS" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-facebook-f"></i> BEdakasaSINHS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-legal">
        <div className="container">
          <p className="copyright">
            &copy; {currentYear} The Pioneer Journal of Multidisciplinary Research, Innovation and Educational Practices<br />
            Siniloan Integrated National High School. All Rights Reserved.
          </p>
          <p className="legal-text">
            All materials, including research papers, images, and other content on this website, are the intellectual property of 
            Siniloan Integrated National High School or their respective authors. Unauthorized reproduction, distribution, or use 
            of any content is strictly prohibited without written permission.
          </p>
          <p className="disclaimer">
            This website is provided for academic and educational purposes only. The views expressed in the research papers 
            are those of the original authors and do not necessarily reflect the official policy or position of 
            Siniloan Integrated National High School.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
