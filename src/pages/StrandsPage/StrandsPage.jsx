import React from 'react';
import { Link } from 'react-router-dom';
import './StrandsPage.css';

function StrandsPage() {
  const strands = [
    {
      id: 'stem',
      name: 'Science, Technology, Engineering, and Mathematics',
      color: '#800000',
      description: 'Research papers focused on scientific innovation, mathematical models, and technological advancements.'
    },
    {
      id: 'humss',
      name: 'Humanities and Social Sciences',
      color: '#3C7B15',
      description: 'Studies exploring human behavior, society, culture, history, and philosophical concepts.'
    },
    {
      id: 'abm',
      name: 'Accountancy, Business, and Management',
      color: '#ffd700',
      description: 'Research on business practices, economic theories, entrepreneurship, and financial systems.'
    },
    {
      id: 'ict',
      name: 'Information and Communication Technology',
      color: '#0a2463',
      description: 'Papers on computer systems, software development, networking, and digital communications.'
    },
    {
      id: 'he',
      name: 'Home Economics',
      color: '#ff69b4',
      description: 'Studies related to domestic management, nutrition, textiles, and family resource management.'
    },
    {
      id: 'afa',
      name: 'Agri-Fishery Arts',
      color: '#8B4513',
      description: 'Research on agricultural practices, aquaculture, sustainable farming, and food production.'
    }
  ];

  return (
    <div className="strands-page">
      <div className="strands-header">
        <h1>Academic Strands</h1>
        <p>Explore research papers across different academic disciplines</p>
      </div>
      
      <div className="strands-grid">
        {strands.map(strand => (
          <Link 
            to={`/strand/${strand.id}`} 
            key={strand.id}
            className="strand-card"
          >
            <div className="strand-banner" style={{ backgroundColor: strand.color }}>
              <h2>{strand.id.toUpperCase()}</h2>
            </div>
            <div className="strand-info">
              <h3>{strand.name}</h3>
              <p>{strand.description}</p>
              <span className="strand-link">Browse papers →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StrandsPage;
