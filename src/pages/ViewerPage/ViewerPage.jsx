import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGoogleViewerUrl, getMetadata } from '../../utils/driveService';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import BackToTop from '../../components/BackToTop/BackToTop';
import './ViewerPage.css';

function ViewerPage() {
  const { strandId, paperId } = useParams();
  const [paperMetadata, setPaperMetadata] = useState({
    title: "Loading...",
    authors: "",
    abstract: "",
    keywords: ""
  });
  const [loading, setLoading] = useState(true);
  
  // Get the Google viewer URL
  const googleViewerUrl = getGoogleViewerUrl(paperId);
  
  // Fetch paper metadata
  useEffect(() => {
    async function loadMetadata() {
      try {
        setLoading(true);
        const metadata = await getMetadata();
        const paperMeta = metadata[paperId] || {};
        
        // Set paper metadata with fallbacks
        setPaperMetadata({
          title: paperMeta.title || "Research Paper",
          authors: paperMeta.authors || "Author information unavailable",
          abstract: paperMeta.abstract || "Abstract not available for this research.",
          keywords: paperMeta.keywords || "No keywords available",
          section: paperMeta.section || ""
        });
      } catch (error) {
        console.error('Error loading metadata:', error);
        // Set fallback values
        setPaperMetadata({
          title: "Research Paper",
          authors: "Author information unavailable",
          abstract: "Failed to load research details.",
          keywords: "",
          section: ""
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadMetadata();
  }, [paperId]);
  
  // Define breadcrumbs for navigation
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Strands', path: '/strands' },
    { label: strandId.toUpperCase(), path: `/strand/${strandId}` }
  ];
  
  // Add section to breadcrumbs if available
  if (paperMetadata.section && !loading) {
    breadcrumbItems.push({ 
      label: paperMetadata.section, 
      path: `/strand/${strandId}#${paperMetadata.section.replace(/\s+/g, '-').toLowerCase()}` 
    });
  }
  
  // Add paper title as final breadcrumb
  breadcrumbItems.push({ 
    label: paperMetadata.title.length > 30 
      ? paperMetadata.title.substring(0, 30) + '...' 
      : paperMetadata.title,
    path: `/view/${strandId}/${paperId}` 
  });

  return (
    <div className="viewer-page">
      {/* Breadcrumb navigation */}
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="viewer-header">
        <Link to={`/strand/${strandId}`} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to {strandId.toUpperCase()} papers
        </Link>
      </div>
      
      {loading ? (
        <div className="metadata-loading">Loading research details...</div>
      ) : (
        <div className="paper-metadata">
          <h1 className="paper-title">{paperMetadata.title}</h1>
          <p className="paper-authors">{paperMetadata.authors}</p>
          
          <div className="metadata-section">
            <h3>Abstract</h3>
            <p className="paper-abstract">{paperMetadata.abstract}</p>
          </div>
          
          <div className="metadata-section">
            <h3>Keywords</h3>
            <p className="paper-keywords">{paperMetadata.keywords}</p>
          </div>
        </div>
      )}
      
      <div className="google-viewer-container">
        <iframe 
          src={googleViewerUrl}
          width="100%" 
          height="600" 
          title="Google PDF Viewer"
          frameBorder="0"
          allowFullScreen
        />
      </div>
      
      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

export default ViewerPage;
