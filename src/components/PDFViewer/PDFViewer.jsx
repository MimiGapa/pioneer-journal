import { Document, Page, pdfjs } from 'react-pdf';

// This is critical - set the worker URL
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './ProfessionalPDFViewer.css';

// Set worker source (required for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ProfessionalPDFViewer({ pdfUrl, title = "Research Paper", authors = "Unknown Authors" }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [outline, setOutline] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const viewerRef = useRef(null);
  function PDFViewer({ pdfUrl, onError }) {
    // Existing state variables...
    
    function onDocumentLoadSuccess({ numPages }) {
      console.log(`PDF loaded successfully with ${numPages} pages`);
      setNumPages(numPages);
    }
  
    function onDocumentLoadError(error) {
      console.error("PDF failed to load:", error);
      if (onError) onError(error);
    }
    
    // Console log the URL for debugging (remove in production)
    React.useEffect(() => {
      console.log("Attempting to load PDF from:", pdfUrl);
    }, [pdfUrl]);
    
    return (
      <div className="pdf-viewer">
        {/* ... toolbar content ... */}
        
        <div className="pdf-content">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="pdf-loading">Loading PDF...</div>}
            error={
              <div className="pdf-error">
                <p>Error loading PDF. Please try again later.</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </div>
            }
            options={{
              cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
              cMapPacked: true
            }}
          >
            {numPages > 0 && (
              <Page
                key={`page_${pageNumber}_${scale}_${rotation}`}
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            )}
          </Document>
        </div>
      </div>
    );
  }
  
  function onDocumentLoadSuccess({ numPages, outline }) {
    setIsLoading(false);
    setNumPages(numPages);
    if (outline) setOutline(outline);
    
    // Generate thumbnails (for simplicity we'll just use page numbers here)
    const thumbs = Array.from(Array(numPages).keys()).map(i => i + 1);
    setThumbnails(thumbs);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages));
    });
  }

  function jumpToPage(page) {
    setPageNumber(Math.max(1, Math.min(page, numPages)));
  }

  // Handle zoom controls
  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  function resetZoom() {
    setScale(1.0);
  }

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  function toggleThumbnails() {
    setShowThumbnails(!showThumbnails);
    if (!showThumbnails) setShowSidebar(true);
  }

  // Search functionality placeholder
  function handleSearch(e) {
    e.preventDefault();
    console.log(`Searching for: ${searchText}`);
    // Actual implementation would require more complex PDF.js integration
  }

  return (
    <div className="professional-pdf-viewer">
      {/* Top header with metadata */}
      <div className="pdf-header">
        <div className="pdf-title-section">
          <h2>{title}</h2>
          <p className="authors">{authors}</p>
        </div>
        
        <div className="pdf-actions">
          <button className="action-button" title="Download">
            <i className="fas fa-download"></i>
          </button>
          <button className="action-button" title="Print" onClick={() => window.print()}>
            <i className="fas fa-print"></i>
          </button>
          <button className="action-button" title="Share">
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      
      {/* Main viewer layout */}
      <div className="pdf-viewer-layout">
        {/* Sidebar */}
        {showSidebar && (
          <div className="pdf-sidebar">
            <div className="sidebar-header">
              <button 
                className={`sidebar-tab ${!showThumbnails ? 'active' : ''}`} 
                onClick={() => setShowThumbnails(false)}
              >
                Contents
              </button>
              <button 
                className={`sidebar-tab ${showThumbnails ? 'active' : ''}`} 
                onClick={() => setShowThumbnails(true)}
              >
                Thumbnails
              </button>
            </div>
            
            {showThumbnails ? (
              <div className="thumbnail-list">
                {thumbnails.map(pageNum => (
                  <div 
                    key={pageNum}
                    className={`thumbnail ${pageNum === pageNumber ? 'active' : ''}`}
                    onClick={() => jumpToPage(pageNum)}
                  >
                    <div className="thumbnail-number">{pageNum}</div>
                    {/* In a real app, you would render actual page thumbnails here */}
                    <div className="thumbnail-placeholder"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="outline-list">
                {outline.length > 0 ? (
                  outline.map((item, index) => (
                    <div 
                      key={index}
                      className="outline-item"
                      onClick={() => jumpToPage(item.pageNumber || 1)}
                    >
                      {item.title}
                    </div>
                  ))
                ) : (
                  <div className="no-outline">No table of contents available</div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Main PDF display area */}
        <div className="pdf-main-area">
          {/* Toolbar */}
          <div className="pdf-toolbar">
            <div className="toolbar-section">
              <button onClick={toggleSidebar} title="Toggle Sidebar" className="toolbar-button">
                <i className={`fas ${showSidebar ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
              </button>
              
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
            
            <div className="toolbar-section">
              <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="toolbar-button">
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="page-info">
                {pageNumber} / {numPages || '-'}
              </span>
              <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="toolbar-button">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="toolbar-section">
              <button onClick={zoomOut} className="toolbar-button" title="Zoom Out">
                <i className="fas fa-search-minus"></i>
              </button>
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn} className="toolbar-button" title="Zoom In">
                <i className="fas fa-search-plus"></i>
              </button>
              <button onClick={resetZoom} className="toolbar-button" title="Fit to Page">
                <i className="fas fa-expand"></i>
              </button>
            </div>
            
            <div className="toolbar-section">
              <button 
                onClick={() => setRotation((rotation + 90) % 360)} 
                className="toolbar-button"
                title="Rotate"
              >
                <i className="fas fa-redo"></i>
              </button>
              
              <button className="toolbar-button highlight-tool" title="Highlight Text">
                <i className="fas fa-highlighter"></i>
              </button>
              
              <button className="toolbar-button" title="Add Note">
                <i className="fas fa-sticky-note"></i>
              </button>
            </div>
          </div>
          
          {/* PDF Document */}
          <div className="pdf-container" ref={viewerRef}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error("Error loading PDF:", error)}
              loading={
                <div className="pdf-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading PDF...</p>
                </div>
              }
              error={
                <div className="pdf-error">
                  <p>Error loading PDF. Please try again later.</p>
                  <button className="retry-button">Try Again</button>
                </div>
              }
              options={{
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
                cMapPacked: true
              }}
            >
              <Page
                key={`page_${pageNumber}_${scale}_${rotation}`}
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                onRenderSuccess={() => console.log(`Page ${pageNumber} rendered successfully`)}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalPDFViewer;
