import React from 'react';
import './SkeletonLoader.css';

export const NotablePaperSkeletonLoader = () => {
  return (
    <div className="notable-papers-container">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="skeleton-notable-paper-card">
          <div className="skeleton-notable-title"></div>
          <div className="skeleton-notable-authors"></div>
          <div className="skeleton-notable-abstract"></div>
          <div className="skeleton-notable-footer">
            <div className="skeleton-notable-strand-container">
              <span className="skeleton-notable-strand"></span>
              <span className="skeleton-notable-badge"></span>
            </div>
            <div className="skeleton-notable-link"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ResearchPaperSkeletonLoader = () => {
  return (
    <div className="paper-sections">
      <div className="paper-section">
        <div className="skeleton-section-heading"></div>
        <div className="papers-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="skeleton-paper-card">
              <div className="skeleton-paper-icon">
                <div className="skeleton-icon-circle"></div>
              </div>
              <div className="skeleton-paper-info">
                <div className="skeleton-paper-title"></div>
                <div className="skeleton-paper-authors"></div>
                <div className="skeleton-paper-abstract"></div>
                <div className="skeleton-paper-link"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
