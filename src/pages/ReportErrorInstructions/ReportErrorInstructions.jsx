import React from 'react';
import { Link } from 'react-router-dom';
import './ReportErrorInstructions.css';

function ReportErrorInstructions() {
  return (
    <div className="report-error-instructions container">
      <h2>Submit a Research Paper Correction</h2>
      <p>Help us ensure the accuracy of our archive by reporting errors in research papers.</p>
      <p>Please include the following details when reporting an error:</p>
      <ul>
        <li>The paper’s title and publication year.</li>
        <li>The section or page where the error appears.</li>
        <li>A brief description of the issue.</li>
      </ul>
      <p>
        For further assistance, visit our <Link to="/support-center">Support Center</Link>.
      </p>
    </div>
  );
}

export default ReportErrorInstructions;