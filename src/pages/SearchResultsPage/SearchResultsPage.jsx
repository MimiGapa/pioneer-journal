import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMetadata } from '../../utils/driveService';
import './SearchResultsPage.css';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  const authorFilter = searchParams.get('author') || '';
  const sectionFilter = searchParams.get('section') || '';
  const notableFilter = searchParams.get('notable') === 'true'; // Parse the notable filter

  useEffect(() => {
    async function performSearch() {
      try {
        setLoading(true);
        const metadata = await getMetadata();
        
        // Filter papers based on search criteria
        const matchingPapers = Object.entries(metadata || {})
          .filter(([id, paper]) => {
            // Skip if it doesn't match notable filter
            if (notableFilter && !paper.featured) {
              return false;
            }
            
            // Skip if it doesn't match section filter
            if (sectionFilter && paper.section !== sectionFilter) {
              return false;
            }
            
            // Skip if it doesn't match author filter
            if (authorFilter && 
                !(paper.authors && 
                  paper.authors.toLowerCase().includes(authorFilter.toLowerCase()))) {
              return false;
            }
            
            // Skip if it doesn't match query (title, abstract, keywords)
            if (query) {
              const queryLower = query.toLowerCase();
              const titleMatch = paper.title && paper.title.toLowerCase().includes(queryLower);
              const abstractMatch = paper.abstract && paper.abstract.toLowerCase().includes(queryLower);
              const keywordsMatch = paper.keywords && paper.keywords.toLowerCase().includes(queryLower);
              
              if (!(titleMatch || abstractMatch || keywordsMatch)) {
                return false;
              }
            }
            
            return true;
          })
          .map(([id, paper]) => ({
            id,
            ...paper
          }));
        
        setResults(matchingPapers);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    
    performSearch();
  }, [query, authorFilter, sectionFilter, notableFilter]);

  // Function to determine which strand a paper belongs to based on its section
  const getStrandFromSection = (section) => {
    if (!section) return 'stem'; // Default
    
    const sectionLower = section.toLowerCase();
    if (sectionLower.includes('stem')) return 'stem';
    if (sectionLower.includes('humss')) return 'humss';
    if (sectionLower.includes('abm')) return 'abm';
    if (sectionLower.includes('ict')) return 'ict';
    if (sectionLower.includes('he')) return 'he';
    if (sectionLower.includes('afa')) return 'afa';
    
    // Extract first word as fallback
    return section.split(' ')[0].toLowerCase();
  };

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>Search Results</h1>
        <div className="search-summary">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
          
          {query && (
            <span className="search-filters">
              for <span className="highlight">"{query}"</span>
            </span>
          )}
          
          {authorFilter && (
            <span className="search-filters">
              by author <span className="highlight">"{authorFilter}"</span>
            </span>
          )}
          
          {sectionFilter && (
            <span className="search-filters">
              in section <span className="highlight">"{sectionFilter}"</span>
            </span>
          )}
          
          {notableFilter && (
            <span className="search-filters">
              <span className="highlight notable-indicator">
                <i className="fas fa-award"></i> Notable papers only
              </span>
            </span>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Searching...</div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <p>No matching research papers found.</p>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="results-list">
          {results.map(paper => {
            const paperStrand = getStrandFromSection(paper.section);
            const isNotable = paper.featured;
            
            return (
              <div key={paper.id} className={`result-card ${isNotable ? 'notable-result' : ''}`}>
                <h3 className="result-title">
                  <Link to={`/view/${paperStrand}/${paper.id}`}>
                    {isNotable && <i className="fas fa-award notable-icon"></i>}
                    {paper.title}
                  </Link>
                </h3>
                
                <p className="result-authors">{paper.authors}</p>
                
                <p className="result-abstract">
                  {paper.abstract?.length > 200 
                    ? `${paper.abstract.substring(0, 200)}...` 
                    : paper.abstract}
                </p>
                
                <div className="result-meta">
                  <span className="result-section">{paper.section}</span>
                  <Link 
                    to={`/view/${paperStrand}/${paper.id}`}
                    className="view-result-link"
                  >
                    View research
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;
