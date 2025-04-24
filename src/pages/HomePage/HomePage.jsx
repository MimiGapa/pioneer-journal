// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMetadata } from '../../utils/driveService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HomePage.css';
import { NotablePaperSkeletonLoader } from '../../components/SkeletonLoader/SkeletonLoader';

function HomePage() {
  const [featuredPapers, setFeaturedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Strand colors and categories
  const strandInfo = {
    stem: { name: 'Science, Technology, Engineering, and Mathematics', color: '#800000', type: 'academic' },
    humss: { name: 'Humanities and Social Sciences', color: '#3C7B15', type: 'academic' },
    abm: { name: 'Accountancy, Business, and Management', color: '#ffd700', type: 'academic' },
    ict: { name: 'Information and Communication Technology', color: '#0a2463', type: 'tvl' },
    he: { name: 'Home Economics', color: '#ff69b4', type: 'tvl' },
    afa: { name: 'Agri-Fishery Arts', color: '#8B4513', type: 'tvl' },
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
            ...paperData,
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

  // Refresh AOS when the dynamic content loads
  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1
            className="hero-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            The Pioneer Journal
          </h1>
          <p
            className="journal-subtitle tagline"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            of Multidisciplinary Research, Innovation and Educational Practices
          </p>
          <p
            className="hero-description"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            A collection of research papers from senior high school students of SINHS
          </p>
          <Link
            to="/strands"
            className="explore-button"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Explore Research Papers
          </Link>
        </div>
      </div>
      
      {/* Welcome Section */}
      <div
        className="welcome-section"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 data-aos="fade-up" data-aos-delay="150">
          Welcome to The Pioneer Journal
        </h2>
        <p data-aos="fade-up" data-aos-delay="200">
          The Pioneer Journal of Multidisciplinary Research, Innovation and Educational Practices is a repository of research 
          papers produced by the senior high school students of Siniloan Integrated National High School. 
          These papers represent the academic achievements and innovative thinking of the school's talented students.
        </p>
      </div>
      
      {/* Notable Research Papers Section */}
      <div
        className="notable-papers-section"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 data-aos="fade-up" data-aos-delay="150">
          Notable Research Papers
        </h2>
        {loading ? (
          <div
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <NotablePaperSkeletonLoader />
          </div>
        ) : error ? ( 
          <div
            className="error"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {error}
          </div>
        ) : featuredPapers.length === 0 ? (
          <div
            className="no-papers"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            No notable research papers found.
          </div>
        ) : (
          <div className="notable-papers-grid">
            {featuredPapers.map((paper, index) => {
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
                <div
                  key={paper.id}
                  className="notable-paper-card"
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 100}
                >
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
                        style={{ backgroundColor: strandColor, color: '#fff' }}
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
      <div
        className="browse-categories-section"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h3 data-aos="fade-up" data-aos-delay="150">Browse by Category</h3>
        
        <div className="strand-categories" data-aos="fade-up" data-aos-delay="200">
          <div className="strand-category">
            <h4 data-aos="fade-up" data-aos-delay="250">Academic Strands</h4>
            <div className="strand-links">
              {Object.entries(strandInfo)
                .filter(([_, info]) => info.type === 'academic')
                .map(([strand, info]) => (
                  <Link 
                    key={strand} 
                    to={`/strand/${strand}`} 
                    className="strand-link-mini"
                    style={{ backgroundColor: info.color }}
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    {strand.toUpperCase()}
                  </Link>
                ))}
            </div>
          </div>
          
          <div className="strand-category">
            <h4 data-aos="fade-up" data-aos-delay="250">
              Technical-Vocational-Livelihood (TVL) Strands
            </h4>
            <div className="strand-links">
              {Object.entries(strandInfo)
                .filter(([_, info]) => info.type === 'tvl')
                .map(([strand, info]) => (
                  <Link 
                    key={strand} 
                    to={`/strand/${strand}`} 
                    className="strand-link-mini"
                    style={{ backgroundColor: info.color }}
                    data-aos="fade-up"
                    data-aos-delay="300"
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
