import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';

function BreadcrumbLayout({ children }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Skip breadcrumbs on home page
  if (pathnames.length === 0) {
    return children;
  }

  // Generate breadcrumb items based on the current route
  const breadcrumbItems = [
    { label: 'Home', path: '/' }
  ];
  
  let currentPath = '';
  pathnames.forEach((name, index) => {
    currentPath += `/${name}`;
    
    // Skip certain paths or customize labels
    switch(name) {
      case 'strand':
        breadcrumbItems.push({ label: 'Strands', path: '/strands' });
        break;
      case 'view':
        // Skip 'view' in breadcrumbs
        break;
      default:
        if (name === pathnames[pathnames.length - 1]) {
          // Format the last item (current page)
          breadcrumbItems.push({ 
            label: name.charAt(0).toUpperCase() + name.slice(1),
            path: currentPath
          });
        } else {
          breadcrumbItems.push({ 
            label: name.charAt(0).toUpperCase() + name.slice(1),
            path: currentPath
          });
        }
    }
  });

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      {children}
    </>
  );
}

export default BreadcrumbLayout;
