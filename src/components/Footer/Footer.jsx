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
              <picture>
                <source srcSet="/assets/logos/SINHS_logo.webp" type="image/webp" />
                <img src="/assets/logos/SINHS_logo.png" alt="SINHS Logo" />
              </picture>
            </div>
            <div className="footer-content">
              <h3 className="old-english">
                Siniloan Integrated National <span style={{ whiteSpace: 'nowrap' }}>High School</span>
              </h3>
              <p>
                The Pioneer Journal of Multidisciplinary Research, Innovation and Educational Practices
              </p>
            </div>
          </div>
          <div className="footer-contact">
            <h4>School Contact</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://www.facebook.com/DepedTayoSINHS301273"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <i className="fab fa-facebook-f" aria-hidden="true"></i>Deped Tayo Siniloan INHS - Laguna
                </a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt" aria-hidden="true"></i> L. de Leon St., Siniloan, Laguna
              </li>
              <li>
                <i className="fas fa-phone" aria-hidden="true"></i> (049) 591-0182
              </li>
              <li>
                <i className="fas fa-envelope" aria-hidden="true"></i>{" "}
                <a className="social-link" href="mailto:301273@deped.gov.ph">Email</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-legal">
        <div className="container">
          <p className="copyright">
            &copy; {currentYear} The Pioneer Journal of Multidisciplinary Research, Innovation and Educational Practices<br />
            Siniloan Integrated National High School. <span style={{ whiteSpace: 'nowrap' }}>All Rights Reserved.</span>
          </p>
          <p className="legal-text">
            All materials, including research papers, images, and other content on this website, are the intellectual property of
            Siniloan Integrated National High School or their respective authors. Unauthorized reproduction, distribution, or use of any content is strictly prohibited without written permission.
          </p>
          <p className="disclaimer">
            This website is provided for academic and educational purposes only. The views expressed in the research papers
            are those of the original authors and do not necessarily reflect the official policy or position of
            Siniloan Integrated National High School.
          </p>
          <p className="repo-link">
            <a href="https://github.com/MimiGapa/pioneer-journal.git" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" aria-hidden="true"></i> View GitHub Repository
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
