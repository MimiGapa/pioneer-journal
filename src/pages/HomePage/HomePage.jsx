// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMetadata } from '../../utils/driveService';
import './HomePage.css';

function HomePage() {
  const [featuredPapers, setFeaturedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Strand colors and categories
  const strandInfo = {
    'stem': { name: 'Science, Technology, Engineering, and Mathematics', color: '#800000', type: 'academic' },
    'humss': { name: 'Humanities and Social Sciences', color: '#3C7B15', type: 'academic' },
    'abm': { name: 'Accountancy, Business, and Management', color: '#ffd700', type: 'academic' },
    'ict': { name: 'Information and Communication Technology', color: '#0a2463', type: 'tvl' },
    'he': { name: 'Home Economics', color: '#ff69b4', type: 'tvl' },
    'afa': { name: 'Agri-Fishery Arts', color: '#8B4513', type: 'tvl' },
  };

  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      try {
        setLoading(true);
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
      <div className="hero-section">
        <div className="hero-content">
          <h1>The Pioneer Journal</h1>
          <p className="journal-subtitle">of Multidisciplinary Research, Innovation and Educational Practices</p>
          <p className="hero-description">A collection of research papers from senior high school students of SINHS</p>
          <Link to="/strands" className="explore-button">
            Explore Research Papers
          </Link>
        </div>
      </div>
      
      <div className="welcome-section">
        <h2>Welcome to The Pioneer Journal</h2>
        <p>
          The Pioneer Journal of Multidisciplinary Research, Innovation and Educational Practices is a repository of research 
          papers produced by the senior high school students of Siniloan Integrated National High School. 
          These papers represent the academic achievements and innovative thinking of the school's talented students.
        </p>
      </div>
      
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
              
              const strandColor = strandInfo[strand]?.color || '#333';
              
              return (
                <div key={paper.id} className="notable-paper-card">
                  <h3 className="notable-paper-title">{paper.title}</h3>
                  <p className="notable-paper-authors">{paper.authors}</p>
                  <p className="notable-paper-abstract">
                    {paper.abstract?.substring(0, 100)}
                    {paper.abstract?.length > 100 ? '...' : ''}
                  </p>
                  <div className="notable-paper-footer">
                    <div className="strand-badge-container">
                      <span 
                        className="notable-paper-strand" 
                        style={{backgroundColor: strandColor, color: '#fff'}}
                      >
                        {sectionPrefix.toUpperCase()}
                      </span>
                      <span className="notable-badge">Notable</span>
                    </div>
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
      
      {/* Browse by Category Section */}
      <div className="browse-categories-section">
        <h3>Browse by Category</h3>
        
        <div className="strand-categories">
          <div className="strand-category">
            <h4>Academic Strands</h4>
            <div className="strand-links">
              {Object.entries(strandInfo)
                .filter(([_, info]) => info.type === 'academic')
                .map(([strand, info]) => (
                  <Link 
                    key={strand} 
                    to={`/strand/${strand}`} 
                    className="strand-link-mini"
                    style={{backgroundColor: info.color}}
                  >
                    {strand.toUpperCase()}
                  </Link>
                ))}
            </div>
          </div>
          
          <div className="strand-category">
            <h4>Technical-Vocational-Livelihood (TVL) Strands</h4>
            <div className="strand-links">
              {Object.entries(strandInfo)
                .filter(([_, info]) => info.type === 'tvl')
                .map(([strand, info]) => (
                  <Link 
                    key={strand} 
                    to={`/strand/${strand}`} 
                    className="strand-link-mini"
                    style={{backgroundColor: info.color}}
                  >
                    {strand.toUpperCase()}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
