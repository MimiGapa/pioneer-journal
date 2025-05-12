import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { getMetadata } from '../../utils/driveService';
import './SearchResultsPage.css';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  const authorFilter = searchParams.get('author') || '';
  const sectionFilter = searchParams.get('section') || '';
  const notableFilter = searchParams.get('notable') === 'true';

  // Define query words for search and highlighting
  const queryWords = query ? query.toLowerCase().split(/\s+/).filter(word => word.length > 0) : [];

  // Custom function to find whole word matches for highlighting
  const findWholeWords = ({ searchWords, textToHighlight }) => {
    const chunks = [];
    searchWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(textToHighlight)) !== null) {
        chunks.push({
          start: match.index,
          end: match.index + word.length,
        });
      }
    });
    return chunks;
  };

  useEffect(() => {
    async function performSearch() {
      try {
        setLoading(true);
        const metadata = await getMetadata();
        console.log('Metadata fetched:', metadata); // Debug log

        const matchingPapers = Object.entries(metadata || {})
          .filter(([id, paper]) => {
            if (notableFilter && !paper.featured) return false;
            if (sectionFilter && paper.section !== sectionFilter) return false;
            if (authorFilter && 
                !(paper.authors && 
                  paper.authors.toLowerCase().includes(authorFilter.toLowerCase()))) {
              return false;
            }
            if (query) {
              const allWordsFound = queryWords.every(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                return (
                  (paper.title && regex.test(paper.title)) ||
                  (paper.abstract && regex.test(paper.abstract)) ||
                  (paper.keywords && regex.test(paper.keywords))
                );
              });
              if (!allWordsFound) return false;
            }
            return true;
          })
          .map(([id, paper]) => ({
            id,
            ...paper
          }));
        
        // Group results by section for sorting
        const groupedResults = matchingPapers.reduce((acc, paper) => {
          const section = paper.section || 'Other';
          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push(paper);
          return acc;
        }, {});

        // Sort sections alphabetically
        const sortedSections = Object.keys(groupedResults).sort();

        // Sort results within each section alphabetically by title
        sortedSections.forEach(section => {
          groupedResults[section].sort((a, b) => a.title.localeCompare(b.title));
        });

        // Flatten the grouped and sorted results into a single array
        const sortedResults = sortedSections.flatMap(section => groupedResults[section]);
        setResults(sortedResults);
        console.log('Search results:', sortedResults); // Debug log
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    
    performSearch();
  }, [query, authorFilter, sectionFilter, notableFilter]);

  const getStrandFromSection = (section) => {
    if (!section) return 'stem';
    const sectionLower = section.toLowerCase();
    if (sectionLower.includes('stem')) return 'stem';
    if (sectionLower.includes('humss')) return 'humss';
    if (sectionLower.includes('abm')) return 'abm';
    if (sectionLower.includes('ict')) return 'ict';
    if (sectionLower.includes('he')) return 'he';
    if (sectionLower.includes('afa')) return 'afa';
    return section.split(' ')[0].toLowerCase();
  };

  // Compute unique strands
  const uniqueStrands = useMemo(() => {
    const strands = results.map(paper => getStrandFromSection(paper.section));
    return [...new Set(strands)].sort();
  }, [results]);

  // Track the first paper of each strand for ID assignment
  const firstPaperByStrand = useMemo(() => {
    const seenStrands = new Set();
    const firstPapers = {};
    results.forEach(paper => {
      const strand = getStrandFromSection(paper.section);
      if (!seenStrands.has(strand)) {
        seenStrands.add(strand);
        firstPapers[strand] = paper.id;
      }
    });
    return firstPapers;
  }, [results]);

  // Function to scroll to the top of the strand's first card
  const scrollToStrand = (strand) => {
    const element = document.getElementById(`strand-${strand}`);
    if (element) {
      // Get the height of any fixed header (if present)
      const header = document.querySelector('.header'); // Adjust selector if needed
      const headerHeight = header ? header.offsetHeight : 0;
      const offset = headerHeight + 10; // Additional 10px buffer
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
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
                <i className="fas fa-award" aria-hidden="true"></i> Notable papers only
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
          <div className="strands-list">
            {uniqueStrands.map((strand, index) => (
              <React.Fragment key={strand}>
                {index > 0 && <span className="strand-separator"> | </span>}
                <button
                  onClick={() => scrollToStrand(strand)}
                  className="strand-item"
                >
                  {strand.toUpperCase()}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="cards-container">
            {results.map(paper => {
              const paperStrand = getStrandFromSection(paper.section);
              const isNotable = paper.featured;
              const abstractText = paper.abstract?.length > 200 
                ? `${paper.abstract.substring(0, 200)}...` 
                : paper.abstract;
              
              // Assign id to the first paper of each strand
              const isFirstOfStrand = firstPaperByStrand[paperStrand] === paper.id;

              return (
                <div
                  key={paper.id}
                  id={isFirstOfStrand ? `strand-${paperStrand}` : undefined}
                  className={`result-card ${isNotable ? 'notable-result' : ''}`}
                >
                  <h3 className="result-title">
                    <Link to={`/view/${paperStrand}/${paper.id}`}>
                      {isNotable && <i className="fas fa-award notable-icon" aria-hidden="true"></i>}
                      <Highlighter
                        highlightClassName="highlight"
                        searchWords={queryWords}
                        autoEscape={true}
                        textToHighlight={paper.title}
                        findChunks={findWholeWords}
                      />
                    </Link>
                  </h3>
                  <p className="result-authors">{paper.authors}</p>
                  <p className="result-abstract">
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={queryWords}
                      autoEscape={true}
                      textToHighlight={abstractText}
                      findChunks={findWholeWords}
                    />
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
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;