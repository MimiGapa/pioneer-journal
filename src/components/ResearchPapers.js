import React, { useEffect, useState } from 'react';
import { getUserMessage, listPapers } from './src/utils/driveService'; // Adjust the path as necessary

const ResearchPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPapers = async () => {
      const fetchedPapers = await listPapers('stem'); // Example strand
      setPapers(fetchedPapers);
      setLoading(false);
    };

    fetchPapers().catch((error) => {
      setErrorMessage('Failed to load research papers. Please try again later.');
      setLoading(false);
    });
  }, []);

  const message = getUserMessage(); // Get the user-friendly message

  return (
    <div>
      {loading && <div>Loading research papers...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {message && <div className="user-message">{message}</div>}
      <ul>
        {papers.map((paper) => (
          <li key={paper.id}>{paper.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResearchPapers;
