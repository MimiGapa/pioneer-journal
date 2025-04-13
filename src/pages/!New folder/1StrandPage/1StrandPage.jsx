import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listPapers, getMetadata } from '../../utils/driveService';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import BackToTop from '../../components/BackToTop/BackToTop';
import './StrandPage.css';

function StrandPage() {
  const { strandId } = useParams();
  const [papers, setPapers] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch papers and metadata in parallel
        const [papersList, metadataObj] = await Promise.all([
          listPapers(strandId),
          getMetadata()
        ]);
        
        setPapers(papersList);
        setMetadata(metadataObj);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load research papers');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [strandId]);
  
  // Group papers by section
  const getPapersBySection = () => {
    const sections = {};
    const strandPrefix = strandId.toUpperCase();
    
    // Default section if metadata doesn't specify one
    const defaultSection = `${strandPrefix} 1`;
    
    // Process test sample separately
    if (papers.length === 0) {
      const sampleMeta = metadata.sample || {};
      const sampleSection = sampleMeta.section || defaultSection;
      
      // Initialize the section if not exists
      if (!sections[sampleSection]) {
        sections[sampleSection] = [];
      }
      
      sections[sampleSection].push({
        id: 'sample',
        name: sampleMeta.title || 'Sample Research Paper',
        metadata: sampleMeta
      });
      
      return sections;
    }
    
    // Group real papers by section
    papers.forEach(paper => {
      const fileId = paper.id;
      const paperMeta = metadata[fileId] || {};
      
      // Get section or use default
      const section = paperMeta.section || defaultSection;
      
      // Initialize the section if not exists
      if (!sections[section]) {
        sections[section] = [];
      }
      
      // Add paper to its section
      sections[section].push({
        id: fileId,
        name: paper.name,
        metadata: paperMeta
      });
    });
    
    return sections;
  };
  
  // Define breadcrumbs for current path
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Strands', path: '/strands' },
    { label: strandId.toUpperCase(), path: `/strand/${strandId}` }
  ];
  
  const strandInfo = {
    'stem': { 
      name: 'Science, Technology, Engineering, and Mathematics', 
      color: '#800000' 
    },
    'humss': { 
      name: 'Humanities and Social Sciences', 
      color: '#3C7B15' 
    },
    'abm': { 
      name: 'Accountancy, Business, and Management', 
      color: '#ffd700' 
    },
    'ict': { 
      name: 'Information and Communication Technology', 
      color: '#0a2463' 
    },
    'he': { 
      name: 'Home Economics', 
      color: '#ff69b4' 
    },
    'afa': { 
      name: 'Agri-Fishery Arts', 
      color: '#8B4513' 
    },
  }[strandId.toLowerCase()] || { name: strandId.toUpperCase(), color: '#333333' };

  // Create a paper card component for consistency
  const PaperCard = ({ paper, strandId }) => {
    // Get metadata or use fallbacks
    const paperMeta = paper.metadata || {};
    
    // Clean title - use metadata title or filename without extension
    const title = paperMeta.title || paper.name.replace(/\.pdf$/i, '');
    
    // Get other metadata with fallbacks
    const authors = paperMeta.authors || "Author information unavailable";
    const abstract = paperMeta.abstract || "Abstract not available for this research.";
    
    return (
      <div className="paper-card">
        <div className="paper-icon">
          <i className="fas fa-file-alt"></i>
        </div>
        <div className="paper-info">
          <h3>{title}</h3>
          <p className="paper-authors">{authors}</p>
          <p className="paper-abstract-preview">
            {abstract.length > 120 
              ? `${abstract.substring(0, 120)}...` 
              : abstract}
          </p>
          <Link to={`/view/${strandId}/${paper.id}`} className="view-research-link">
            View research
          </Link>
        </div>
      </div>
    );
  };
  
  // Get papers grouped by sections
  const sectionedPapers = getPapersBySection();
  const sectionNames = Object.keys(sectionedPapers).sort();

  return (
    <div className="strand-page">
      {/* Breadcrumb navigation */}
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="strand-header" style={{ backgroundColor: strandInfo.color }}>
        <h2>{strandId.toUpperCase()}</h2>
        <p>{strandInfo.name} Research Papers</p>
      </div>
      
      <div className="strand-content">
        {loading ? (
          <div className="loading">Loading research papers...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : Object.keys(sectionedPapers).length === 0 ? (
          <div className="no-papers">
            <p>No research papers found for this strand.</p>
            <p>Papers will appear here once they are added to the Google Drive folder.</p>
          </div>
        ) : (
          <div className="paper-sections">
            {sectionNames.map(sectionName => (
              <div key={sectionName} className="paper-section">
                <h2 className="section-heading">{sectionName}</h2>
                <div className="papers-grid">
                  {sectionedPapers[sectionName].map(paper => (
                    <PaperCard 
                      key={paper.id} 
                      paper={paper} 
                      strandId={strandId} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

export default StrandPage;
