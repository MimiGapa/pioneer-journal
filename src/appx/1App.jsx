import React from 'react';
import { Routes, Route } from 'react-router-dom'; // REMOVE BrowserRouter import
import Header from './components/Header/Header';
import BreadcrumbLayout from './components/BreadcrumbLayout';
import StrandPage from './pages/StrandPage/StrandPage';
import ViewerPage from './pages/ViewerPage/ViewerPage';
import BackToTop from './components/BackToTop/BackToTop';

function App() {
  return (
    <div className="app">
      <Header />
      <BreadcrumbLayout>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/strand/:strandId" element={<StrandPage />} />
            <Route path="/view/:strandId/:paperId" element={<ViewerPage />} />
          </Routes>
        </main>
      </BreadcrumbLayout>
      <BackToTop />
    </div>
  );
}

export default App;
