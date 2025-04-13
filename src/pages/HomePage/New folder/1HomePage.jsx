// src/pages/HomePage/HomePage.jsx
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const strands = [
    { id: 'stem', name: 'STEM', fullName: 'Science, Technology, Engineering, and Mathematics', color: 'var(--stem-color)' },
    { id: 'humss', name: 'HUMSS', fullName: 'Humanities and Social Science', color: 'var(--humss-color)' },
    { id: 'abm', name: 'ABM', fullName: 'Accountancy, Business and Management', color: 'var(--abm-color)' },
    { id: 'ict', name: 'ICT', fullName: 'Information and Communication Technology', color: 'var(--ict-color)' },
    { id: 'he', name: 'HE', fullName: 'Home Economics', color: 'var(--he-color)' },
    { id: 'afa', name: 'AFA', fullName: 'Agri-Fishery Arts', color: 'var(--afa-color)' }
  ];

  return (
    <div className="home-page">
      <h2>Research Paper Archive</h2>
      <p>Explore research papers by academic strand</p>
      
      <div className="strands-grid">
        {strands.map(strand => (
          <Link 
            to={`/strand/${strand.id}`} 
            key={strand.id}
            className="strand-card"
            style={{ borderColor: strand.color }}
          >
            <div className="strand-header" style={{ backgroundColor: strand.color }}>
              <h3>{strand.name}</h3>
            </div>
            <div className="strand-body">
              <p>{strand.fullName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
