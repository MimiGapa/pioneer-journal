import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMetadata } from '../../utils/driveService';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [notableFilter, setNotableFilter] = useState(false); // New state for notable filter
  const [sections, setSections] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchModalRef = useRef(null);
  const navigate = useNavigate();

  // Fetch available sections for filter dropdown
  useEffect(() => {
    async function fetchSections() {
      try {
        const metadata = await getMetadata();
        const uniqueSections = new Set();
        
        Object.values(metadata || {}).forEach(paper => {
          if (paper.section) {
            uniqueSections.add(paper.section);
          }
        });
        
        setSections(Array.from(uniqueSections).sort());
      } catch (error) {
        console.error('Error fetching sections:', error);
        setSections([]);
      }
    }
    
    fetchSections();
  }, []);

  // Close advanced search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        setShowAdvanced(false);
      }
    }
    
    if (showAdvanced) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdvanced]);

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query && !authorFilter && !sectionFilter && !notableFilter) {
      return; // Don't search with empty criteria
    }
    
    setIsSearching(true);
    
    try {
      // Build search parameters
      const searchParams = new URLSearchParams();
      if (query) searchParams.append('q', query);
      if (authorFilter) searchParams.append('author', authorFilter);
      if (sectionFilter) searchParams.append('section', sectionFilter);
      if (notableFilter) searchParams.append('notable', 'true'); // Add notable filter
      
      // Navigate to search results page with these params
      navigate(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
      setShowAdvanced(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search PioneerJournal"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="button" 
              className="advanced-search-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
              aria-label="Toggle advanced search"
              title="Advanced Search"
            >
              <i className="fas fa-sliders-h"></i>
            </button>
            <button 
              type="submit" 
              className="search-button"
              disabled={isSearching}
            >
              {isSearching ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-search"></i>
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
              onClick={() => setShowAdvanced(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="search-field">
              <label>Keywords</label>
              <input
                type="text"
                placeholder="Search in abstract and keywords"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
              <label className="checkbox-label">
                <input
                  type="checkbox"
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
