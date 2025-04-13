import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import StrandsPage from './pages/StrandsPage/StrandsPage';
import StrandPage from './pages/StrandPage/StrandPage';
import ViewerPage from './pages/ViewerPage/ViewerPage';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage';
import BackToTop from './components/BackToTop/BackToTop';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/strands" element={<StrandsPage />} />
          <Route path="/strand/:strandId" element={<StrandPage />} />
          <Route path="/view/:strandId/:paperId" element={<ViewerPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={
            <div style={{padding: '2rem', textAlign: 'center'}}>Page under construction</div>
          } />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
