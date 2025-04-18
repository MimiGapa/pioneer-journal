import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listPapers, getMetadata } from '../../utils/driveService';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './StrandPage.css';

function StrandPage() {
  const { strandId } = useParams();
  const [papers, setPapers] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeatured, setShowFeatured] = useState(true);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [totalCount, setTotalCount] = useState(0); // Total paper count

  // Define breadcrumbs
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Strands', path: '/strands' },
    { label: strandId.toUpperCase(), path: `/strand/${strandId}` }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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

  // Calculate total count
  useEffect(() => {
    if (papers.length === 0) {
      setTotalCount(metadata.sample ? 1 : 0);
    } else {
      setTotalCount(papers.length);
    }
  }, [papers, metadata]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Group papers by section and sort them accordingly
  const getPapersBySection = () => {
    const sections = {};
    const strandPrefix = strandId.toUpperCase();
    const defaultSection = `${strandPrefix} 1`;

    if (papers.length === 0) {
      const sampleMeta = metadata.sample || {};
      const sampleSection = sampleMeta.section || defaultSection;
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

    papers.forEach(paper => {
      const fileId = paper.id;
      const paperMeta = metadata[fileId] || {};
      const section = paperMeta.section || defaultSection;
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push({
        id: fileId,
        name: paper.name,
        metadata: paperMeta
      });
    });

    Object.keys(sections).forEach(sectionName => {
      sections[sectionName].sort((a, b) => {
        if (showFeatured) {
          const aFeatured = a.metadata.featured;
          const bFeatured = b.metadata.featured;
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;
        }
        const aTitle = (a.metadata.title || a.name).replace(/\.pdf$/i, '');
        const bTitle = (b.metadata.title || b.name).replace(/\.pdf$/i, '');
        return sortDirection === 'asc'
          ? aTitle.localeCompare(bTitle)
          : bTitle.localeCompare(aTitle);
      });
    });
    return sections;
  };

  const strandInfo = {
    stem: {
      name: 'Science, Technology, Engineering, and Mathematics',
      color: '#800000'
    },
    humss: {
      name: 'Humanities and Social Sciences',
      color: '#3C7B15'
    },
    abm: {
      name: 'Accountancy, Business, and Management',
      color: '#ffd700'
    },
    ict: {
      name: 'Information and Communication Technology',
      color: '#0a2463'
    },
    he: {
      name: 'Home Economics',
      color: '#ff69b4'
    },
    afa: {
      name: 'Agri-Fishery Arts',
      color: '#8B4513'
    },
  }[strandId.toLowerCase()] || { name: strandId.toUpperCase(), color: '#333333' };

  // Paper card component with AOS attributes; accepts a "aosDelay" prop.
  const PaperCard = ({ paper, strandId, aosDelay }) => {
    const paperMeta = paper.metadata || {};
    const title = paperMeta.title || paper.name.replace(/\.pdf$/i, '');
    const authors = paperMeta.authors || "Author information unavailable";
    const abstract = paperMeta.abstract || "Abstract not available for this research.";
    const isFeatured = paperMeta.featured;
    return (
      <div className={`paper-card ${isFeatured && showFeatured ? 'featured-paper' : ''}`}
           data-aos="fade-up"
           data-aos-delay={aosDelay}>
        <div className="paper-icon">
          <i className={`fas ${isFeatured ? 'fa-award' : 'fa-file-alt'}`}></i>
        </div>
        <div className="paper-info">
          {isFeatured && showFeatured && <div className="featured-badge">Notable</div>}
          <h3>{title}</h3>
          <p className="paper-authors">{authors}</p>
          <p className="paper-abstract-preview">
            {abstract.length > 120 ? `${abstract.substring(0, 120)}...` : abstract}
          </p>
          <Link to={`/view/${strandId}/${paper.id}`} className="view-research-link">
            View research
          </Link>
        </div>
      </div>
    );
  };

  const sectionedPapers = getPapersBySection();
  const sectionNames = Object.keys(sectionedPapers).sort();

  return (
    <div className="strand-page">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="strand-header" style={{ backgroundColor: strandInfo.color }}
           data-aos="fade-up"
           data-aos-delay="50">
        <h2 data-aos="fade-up" data-aos-delay="80">{strandId.toUpperCase()}</h2>
        <p data-aos="fade-up" data-aos-delay="100">{strandInfo.name} Research Papers</p>
        {!loading && (
          <div className="strand-total-count" data-aos="fade-up" data-aos-delay="120">
            {totalCount} Total Papers
          </div>
        )}
      </div>

      <div className="strand-content">
        <div className="strand-controls" data-aos="fade-up" data-aos-delay="150">
          <label className="featured-checkbox">
            <input
              type="checkbox"
              checked={showFeatured}
              onChange={() => setShowFeatured(!showFeatured)}
            />
            <span>Showcase Notable Research Papers</span>
          </label>
          <button
            className="sort-button"
            onClick={toggleSortDirection}
            title={sortDirection === 'asc' ? 'Sort Z-A' : 'Sort A-Z'}
          >
            Sort {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
            <i className={`fas fa-sort-alpha-${sortDirection === 'asc' ? 'down' : 'up'}`}></i>
          </button>
        </div>

        {loading ? (
          <div className="loading" data-aos="fade-up" data-aos-delay="150">
            Loading research papers...
          </div>
        ) : error ? (
          <div className="error-message" data-aos="fade-up" data-aos-delay="150">
            {error}
          </div>
        ) : Object.keys(sectionedPapers).length === 0 ? (
          <div className="no-papers" data-aos="fade-up" data-aos-delay="150">
            <p>No research papers found for this strand.</p>
            <p>Papers will appear here once they are added to the Google Drive folder.</p>
          </div>
        ) : (
          <div className="paper-sections">
            {sectionNames.map((sectionName, sIndex) => (
              <div key={sectionName} className="paper-section"
                   data-aos="fade-up"
                   data-aos-delay={150 + sIndex * 50}>
                <h2 className="section-heading"
                    data-aos="fade-up" data-aos-delay={200 + sIndex * 50}>
                  {sectionName}
                  <span className="section-count">
                    ({sectionedPapers[sectionName].length} papers)
                  </span>
                </h2>
                <div className="papers-grid">
                  {sectionedPapers[sectionName].map((paper, index) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      strandId={strandId}
                      aosDelay={200 + sIndex * 50 + index * 50}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StrandPage;
