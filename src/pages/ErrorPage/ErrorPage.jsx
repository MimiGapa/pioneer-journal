// src/pages/ErrorPage/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

function ErrorPage() {
  return (
    <div className="error-page">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/">Go back to homepage</Link>
    </div>
  );
}

export default ErrorPage;
