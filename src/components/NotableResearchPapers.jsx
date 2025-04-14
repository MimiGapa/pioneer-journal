// src/components/NotableResearchPapers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMetadata } from '../utils/driveService';
import './NotableResearchPapers.css';

const NotableResearchPapers = () => {
  const [featuredPapers, setFeaturedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      try {
        const metadata = await getMetadata();
        
        // Filter papers that have the featured flag set to true
        const featured = Object.entries(metadata)
          .filter(([_, paperData]) => paperData.featured === true)
          .map(([fileId, paperData]) => ({
            id: fileId,
            ...paperData
          }));
        
        setFeaturedPapers(featured);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured papers:', error);
        setError('Failed to load featured research papers');
        setLoading(false);
      }
    };

    fetchFeaturedPapers();
  }, []);

  if (loading) {
    return <div className="notable-papers-loading">Loading notable research papers...</div>;
  }

  if (error) {
    return <div className="notable-papers-error">{error}</div>;
  }

  if (featuredPapers.length === 0) {
    return null; // Don't show the section if there are no featured papers
  }

  return (
    <section className="notable-papers-section">
      <h2>Notable Research Papers</h2>
      <div className="notable-papers-container">
        {featuredPapers.map((paper) => {
          // Determine the strand based on the section prefix
          let strand = 'stem';
          const sectionPrefix = (paper.section || '').split(' ')[0].toLowerCase();
          
          if (sectionPrefix === 'stem') strand = 'stem';
          else if (sectionPrefix === 'humss') strand = 'humss';
          else if (sectionPrefix === 'abm') strand = 'abm';
          else if (sectionPrefix === 'ict') strand = 'ict';
          else if (sectionPrefix === 'he') strand = 'he';
          else if (sectionPrefix === 'afa') strand = 'afa';
          
          return (
            <div key={paper.id} className="notable-paper-card">
              <div className="notable-paper-badge">Notable</div>
              <h3 className="notable-paper-title">{paper.title}</h3>
              <p className="notable-paper-authors">{paper.authors}</p>
              <p className="notable-paper-abstract">{paper.abstract.substring(0, 200)}...</p>
              <div className="notable-paper-footer">
                <span className="notable-paper-strand">{sectionPrefix.toUpperCase()}</span>
                <Link to={`/view/${strand}/${paper.id}`} className="notable-paper-link">
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NotableResearchPapers;
