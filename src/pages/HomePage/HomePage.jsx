// src/pages/HomePage/HomePage.jsx
// At the top of the HomePage.jsx file
import './HomePage.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMetadata } from '../../utils/driveService';

function HomePage() {
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
        setError('Failed to load notable research papers');
        setLoading(false);
      }
    };

    fetchFeaturedPapers();
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Pioneer Journal</h1>
      <p>Explore research papers from various academic strands:</p>
      
      {/* Notable Research Papers Section */}
      <div className="notable-papers-section">
        <h2>Notable Research Papers</h2>
        
        {loading ? (
          <div className="loading">Loading notable research papers...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : featuredPapers.length === 0 ? (
          <div className="no-papers">No notable research papers found.</div>
        ) : (
          <div className="notable-papers-grid">
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
                  <p className="notable-paper-abstract">
                    {paper.abstract?.substring(0, 200)}
                    {paper.abstract?.length > 200 ? '...' : ''}
                  </p>
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
        )}
      </div>
      
      {/* Strand directory still accessible */}
      <div className="strand-directory">
        <h3>Browse by Academic Strand</h3>
        <div className="strand-links">
          <Link to="/strand/stem" className="strand-link-mini">STEM</Link>
          <Link to="/strand/humss" className="strand-link-mini">HUMSS</Link>
          <Link to="/strand/abm" className="strand-link-mini">ABM</Link>
          <Link to="/strand/ict" className="strand-link-mini">ICT</Link>
          <Link to="/strand/he" className="strand-link-mini">HE</Link>
          <Link to="/strand/afa" className="strand-link-mini">AFA</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
