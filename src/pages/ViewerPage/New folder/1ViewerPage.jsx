import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PDFViewer from '../../components/PDFViewer/PDFViewer';
import { getProxiedPdfUrl, getGoogleViewerUrl } from '../../utils/driveService';
import './ViewerPage.css';

function ViewerPage() {
  const { strandId, paperId } = useParams();
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  
  // Get URLs for both our proxy and Google's viewer
  const pdfUrl = getProxiedPdfUrl(paperId);
  const googleViewerUrl = getGoogleViewerUrl(paperId);
  
  // Handle errors with our custom viewer
  const handlePdfError = () => {
    console.log("PDF failed to load, switching to Google viewer");
    setUseGoogleViewer(true);
  };

  return (
    <div className="viewer-page">
      <div className="viewer-header">
        <Link to={`/strand/${strandId}`} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to {strandId.toUpperCase()} papers
        </Link>
        <h2>Research Paper Viewer</h2>
        
        {useGoogleViewer && (
          <div className="google-viewer-notice">
            Using Google's PDF viewer as a fallback
          </div>
        )}
      </div>
      
      {useGoogleViewer ? (
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
      ) : (
        <PDFViewer pdfUrl={pdfUrl} onError={handlePdfError} />
      )}
    </div>
  );
}

export default ViewerPage;
