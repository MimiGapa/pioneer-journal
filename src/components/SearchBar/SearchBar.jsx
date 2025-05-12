import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js'; // Import fuse.js
import { getMetadata } from '../../utils/driveService';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [notableFilter, setNotableFilter] = useState(false);
  const [sections, setSections] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [metadata, setMetadata] = useState(null); // New state for full metadata
  const [suggestions, setSuggestions] = useState([]); // New state for suggestions
  const searchModalRef = useRef(null);
  const navigate = useNavigate();

  // Fetch metadata and extract sections
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const data = await getMetadata();
        setMetadata(data); // Store full metadata
        const uniqueSections = new Set();
        Object.values(data || {}).forEach(paper => {
          if (paper.section) {
            uniqueSections.add(paper.section);
          }
        });
        setSections(Array.from(uniqueSections).sort());
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setMetadata(null);
        setSections([]);
      }
    }
    fetchMetadata();
  }, []);

  // Initialize fuse.js with metadata
  const fuse = useMemo(() => {
    if (metadata) {
      const papers = Object.values(metadata);
      return new Fuse(papers, {
        keys: ['title', 'abstract', 'keywords'], // Fields to search
        threshold: 0.2, // Lower = stricter, higher = more lenient
        ignoreCase: true,
      });
    }
    return null;
  }, [metadata]);

  // Handle input changes and update suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (metadata && value) {
      const papers = Object.values(metadata);
      const exactMatches = papers.filter(paper =>
        paper.title.toLowerCase().includes(value.toLowerCase())
      );
      const fuzzyResults = fuse.search(value).map(result => result.item);
      const uniqueResults = [...new Set([...exactMatches, ...fuzzyResults])];
      setSuggestions(uniqueResults.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (title) => {
    setQuery(title);
    setSuggestions([]); // Hide suggestions after selection
  };

  // Close advanced search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        setShowAdvanced(false);
        setSuggestions([]); // Also hide suggestions
      }
    }
    if (showAdvanced || suggestions.length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdvanced, suggestions]);

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query && !authorFilter && !sectionFilter && !notableFilter) {
      return;
    }
    setIsSearching(true);
    try {
      const searchParams = new URLSearchParams();
      if (query) searchParams.append('q', query);
      if (authorFilter) searchParams.append('author', authorFilter);
      if (sectionFilter) searchParams.append('section', sectionFilter);
      if (notableFilter) searchParams.append('notable', 'true');
      navigate(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
      setShowAdvanced(false);
      setSuggestions([]); // Clear suggestions on submit
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <label htmlFor="search-input" className="sr-only">Search PioneerJournal</label>
            <input
              type="search"
              id="search-input"
              name="search"
              className="search-input"
              placeholder="Search PioneerJournal"
              aria-label="Search PioneerJournal"
              maxLength={250}
              aria-autocomplete="list"
              autoComplete="off" // Disable browser autocomplete
              autoCorrect="off"
              autoCapitalize="off"
              value={query}
              onChange={handleInputChange} // Updated handler
            />
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((paper, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(paper.title)}>
                    <span className="suggestion-title">{paper.title}</span> - {''}
                    <span className="suggestion-authors">
                      {Array.isArray(paper.author) ? paper.author.join(', ') : paper.author || paper.authors}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="advanced-search-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
              aria-label="Toggle advanced search"
            >
              <i className="fas fa-sliders-h" aria-hidden="true"></i>
            </button>
            <button
              type="submit"
              className="search-button"
              aria-label="Search"
              disabled={isSearching}
            >
              {isSearching ? (
                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              ) : (
                <i className="fas fa-search" aria-hidden="true"></i>
              )}
            </button>
          </div>
        </form>
      </div>

      {showAdvanced && (
        <div className="advanced-search-modal" ref={searchModalRef}>
          <div className="advanced-search-header">
            <h3>Advanced Search</h3>
            <button
              className="close-advanced"
              aria-label="Close"
              onClick={() => setShowAdvanced(false)}
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="search-field">
              <label>Keywords</label>
              <input
                type="text"
                placeholder="Search in abstract and keywords"
                value={query}
                onChange={handleInputChange} // Updated handler here too
              />
            </div>
            <div className="search-field">
              <label>Author</label>
              <input
                type="text"
                placeholder="Search by author name"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>Section</label>
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
            <div className="search-field checkbox-field">
              <label htmlFor="notable-checkbox" className="checkbox-label">
                <input
                  type="checkbox"
                  id="notable-checkbox"
                  checked={notableFilter}
                  onChange={() => setNotableFilter(!notableFilter)}
                />
                <span>Only show Notable Research Papers</span>
              </label>
            </div>
            <div className="advanced-search-actions">
              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  setQuery('');
                  setAuthorFilter('');
                  setSectionFilter('');
                  setNotableFilter(false);
                  setSuggestions([]);
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="search-submit-button"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SearchBar;