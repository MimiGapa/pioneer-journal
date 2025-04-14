import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMetadata } from '../../utils/driveService';
import './StrandsPage.css';

function StrandsPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Fetch metadata and calculate counts
  useEffect(() => {
    async function fetchData() {
      try {
        const metadata = await getMetadata();
        const strandCounts = {};
        
        // Count papers per strand
        Object.values(metadata).forEach(paper => {
          if (!paper.section) return;
          
          const strand = paper.section.split(' ')[0]; // Extract strand name from section
          strandCounts[strand] = (strandCounts[strand] || 0) + 1;
        });
        
        setCounts(strandCounts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching metadata:", error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Define strands with proper categorization
  const strands = [
    // Academic Strands
    {
      id: 'stem',
      name: 'Science, Technology, Engineering, and Mathematics',
      color: '#800000',
      description: 'Research papers focused on scientific innovation, mathematical models, and technological advancements.',
      category: 'academic'
    },
    {
      id: 'humss',
      name: 'Humanities and Social Sciences',
      color: '#3C7B15',
      description: 'Studies exploring human behavior, society, culture, history, and philosophical concepts.',
      category: 'academic'
    },
    {
      id: 'abm',
      name: 'Accountancy, Business, and Management',
      color: '#ffd700',
      description: 'Research on business practices, economic theories, entrepreneurship, and financial systems.',
      category: 'academic'
    },
    
    // Technical-Vocational-Livelihood (TVL) Strands
    {
      id: 'ict',
      name: 'Information and Communication Technology',
      color: '#0a2463',
      description: 'Papers on computer systems, software development, networking, and digital communications.',
      category: 'tvl'
    },
    {
      id: 'he',
      name: 'Home Economics',
      color: '#ff69b4',
      description: 'Studies related to domestic management, nutrition, textiles, and family resource management.',
      category: 'tvl'
    },
    {
      id: 'afa',
      name: 'Agri-Fishery Arts',
      color: '#8B4513',
      description: 'Research on agricultural practices, aquaculture, sustainable farming, and food production.',
      category: 'tvl'
    }
  ];

  // Group strands by category
  const academicStrands = strands.filter(strand => strand.category === 'academic');
  const tvlStrands = strands.filter(strand => strand.category === 'tvl');

  return (
    <div className="strands-page">
      <div className="strands-header">
        <h1>Senior High School Strands</h1>
        <p>Explore research papers across different academic and technical-vocational disciplines</p>
      </div>
      
      {/* Academic Strands Section */}
      <div className="strand-category-section">
        <h2 className="strand-category-title">Academic Strands</h2>
        <div className="strands-grid">
          {academicStrands.map(strand => (
            <Link 
              to={`/strand/${strand.id}`} 
              key={strand.id}
              className="strand-card"
            >
              <div className="strand-banner" style={{ backgroundColor: strand.color }}>
                <h2 className="strand-title">{strand.id.toUpperCase()}</h2>
                {!loading && (
                  <span className="paper-count">
                    {counts[strand.id.toUpperCase()] || 0} papers
                  </span>
                )}
              </div>
              <div className="strand-info">
                <h3>{strand.name}</h3>
                <p>{strand.description}</p>
                <span className="strand-link">Browse papers →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* TVL Strands Section */}
      <div className="strand-category-section">
        <h2 className="strand-category-title">Technical-Vocational-Livelihood (TVL) Strands</h2>
        <div className="strands-grid">
          {tvlStrands.map(strand => (
            <Link 
              to={`/strand/${strand.id}`} 
              key={strand.id}
              className="strand-card"
            >
              <div className="strand-banner" style={{ backgroundColor: strand.color }}>
                <h2 className="strand-title">{strand.id.toUpperCase()}</h2>
                {!loading && (
                  <span className="paper-count">
                    {counts[strand.id.toUpperCase()] || 0} papers
                  </span>
                )}
              </div>
              <div className="strand-info">
                <h3>{strand.name}</h3>
                <p>{strand.description}</p>
                <span className="strand-link">Browse papers →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StrandsPage;
