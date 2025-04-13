import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

function Breadcrumbs({ items }) {
  return (
    <div className="breadcrumbs">
      <div className="breadcrumbs-container">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.path}>
              {isLast ? (
                <span className="breadcrumb-item current">{item.label}</span>
              ) : (
                <>
                  <Link to={item.path} className="breadcrumb-item">
                    {item.label}
                  </Link>
                  <span className="breadcrumb-separator">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Breadcrumbs;
