import React, { useState, useEffect, useRef } from 'react';
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
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const popupRef = useRef(null);
  const outlineButtonRef = useRef(null);
  const googleViewerUrl = getGoogleViewerUrl(paperId);

  useEffect(() => {
    async function loadMetadata() {
      try {
        setLoading(true);
        const metadata = await getMetadata();
        const paperMeta = metadata[paperId] || {};
        setPaperMetadata({
          title: paperMeta.title || "Research Paper",
          authors: paperMeta.authors || "Author information unavailable",
          abstract: paperMeta.abstract || "Abstract not available for this research.",
          keywords: paperMeta.keywords || "No keywords available",
          section: paperMeta.section || ""
        });
      } catch (error) {
        console.error("Error loading metadata:", error);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsSharePopupOpen(false);
      }
      if (outlineButtonRef.current && !outlineButtonRef.current.contains(event.target)) {
        setIsOutlineOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Strands", path: "/strands" },
    { label: strandId.toUpperCase(), path: `/strand/${strandId}` }
  ];
  if (paperMetadata.section && !loading) {
    breadcrumbItems.push({
      label: paperMetadata.section,
      path: `/strand/${strandId}#${paperMetadata.section.replace(/\s+/g, "-").toLowerCase()}`
    });
  }
  breadcrumbItems.push({
    label: paperMetadata.title.length > 30
      ? paperMetadata.title.substring(0, 30) + "..."
      : paperMetadata.title,
    path: `/view/${strandId}/${paperId}`
  });

  const shareUrl = `${window.location.origin}/view/${strandId}/${paperId}`;
  const shareTitle = encodeURIComponent(paperMetadata.title);
  const shareText = encodeURIComponent(
    `Check out this research paper: "${paperMetadata.title}" by ${paperMetadata.authors}`
  );
  const socialMediaLinks = [
    {
      name: "Email",
      url: `mailto:?subject=${shareTitle}&body=${shareText}%0A${shareUrl}`,
      logo: "/assets/icons/email-icon.svg",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      logo: "/assets/icons/facebook-icon.svg",
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      logo: "/assets/icons/x-icon.svg",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareText}`,
      logo: "/assets/icons/linkedin-icon.svg",
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`,
      logo: "/assets/icons/reddit-icon.svg",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${shareText}%0A${shareUrl}`,
      logo: "/assets/icons/whatsapp-icon.svg",
    },
    {
      name: "Telegram",
      url: `https://telegram.me/share/url?url=${shareUrl}&text=${shareText}`,
      logo: "/assets/icons/telegram-icon.svg",
    },
    {
      name: "Messenger",
      url: `https://www.messenger.com/share?link=${shareUrl}`,
      logo: "/assets/icons/messenger-icon.svg",
    },
    {
      name: "Threads",
      url: `https://www.threads.net/share?url=${shareUrl}&text=${shareText}`,
      logo: "/assets/icons/threads-icon.svg",
    },
  ];

  // Helper: close the popup then scroll to the section after a short delay.
  const scrollToSection = (sectionId) => {
    setIsOutlineOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="viewer-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="viewer-header">
        <Link to={`/strand/${strandId}`} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to {strandId.toUpperCase()} papers
        </Link>
      </div>
      <div className="viewer-content">
        {/* Desktop Outline Sidebar */}
        <div className="outline-sidebar">
          <h3>Outline</h3>
          <hr className="outline-divider" />
          <nav role="navigation" aria-label="Table of Contents">
            <ul>
              <li>
                <a
                  href="#abstract"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: document.getElementById("abstract").offsetTop - 80, behavior: "smooth" });
                  }}
                >
                  Abstract
                </a>
              </li>
              <li>
                <a
                  href="#keywords"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: document.getElementById("keywords").offsetTop - 80, behavior: "smooth" });
                  }}
                >
                  Keywords
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/* Main Content */}
        <div className="main-content">
          {loading ? (
            <div className="metadata-loading">Loading research details...</div>
          ) : (
            <div className="paper-metadata">
              <h1 className="paper-title">{paperMetadata.title}</h1>
              <p className="paper-authors">{paperMetadata.authors}</p>
              {strandId.toUpperCase() === "STEM" && (
                <>
                  {showMilestones && (
                    <div className="milestones">
                      <p>
                        <strong>Article History:</strong> Accepted 15 March 2025, Approved 15 April 2025, Published 15 April 2025
                      </p>
                    </div>
                  )}
                  <button
                    className={`show-more-btn ${isActive ? "active" : ""}`}
                    onClick={() => setShowMilestones(!showMilestones)}
                    onTouchStart={() => {
                      setIsActive(true);
                      setTimeout(() => setIsActive(false), 300);
                    }}
                    aria-expanded={showMilestones}
                  >
                    {showMilestones ? "Show less" : "Show more"}
                    <i className={showMilestones ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
                  </button>
                  {/* Mobile Outline Button */}
                  <button
                    className="outline-button"
                    onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                    ref={outlineButtonRef}
                    aria-expanded={isOutlineOpen}
                    aria-label="Toggle table of contents"
                  >
                    <i className="fas fa-list button-icon"></i>
                    Outline
                  </button>
                  {/* Mobile Outline Popup */}
                  {isOutlineOpen && (
                    <div className="outline-popup" ref={popupRef}>
                      <h3>Outline</h3>
                      <hr className="outline-divider" />
                      <nav role="navigation" aria-label="Table of Contents">
                        <ul>
                          <li>
                            <a
                              href="#abstract"
                              onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("abstract");
                              }}
                            >
                              Abstract
                            </a>
                          </li>
                          <li>
                            <a
                              href="#keywords"
                              onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("keywords");
                              }}
                            >
                              Keywords
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
              <div className="metadata-section" id="abstract">
                <h3>Abstract</h3>
                <p className="paper-abstract">{paperMetadata.abstract}</p>
              </div>
              <div className="metadata-section" id="keywords">
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
          <div className="download-share-options">
            <a
              href={`https://drive.google.com/uc?export=download&id=${paperId}`}
              download
              className="download-button"
            >
              <img src="/assets/icons/download-pdf-icon.svg" alt="Download Icon" className="button-icon" />
              Download PDF
            </a>
            <button className="share-button" onClick={() => setIsSharePopupOpen(!isSharePopupOpen)}>
              <img src="/assets/icons/share-icon.svg" alt="Share Icon" className="button-icon" />
              Share
            </button>
          </div>
          {isSharePopupOpen && (
            <div className="share-popup" ref={popupRef}>
              <h3>Share this paper</h3>
              <ul>
                {socialMediaLinks.map((platform) => (
                  <li key={platform.name}>
                    <a href={platform.url} target="_blank" rel="noopener noreferrer" className="share-link">
                      <img src={platform.logo} alt={`${platform.name} logo`} className="share-logo" />
                      {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
              <button className="close-popup-button" onClick={() => setIsSharePopupOpen(false)}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <BackToTop />
    </div>
  );
}

export default ViewerPage;
