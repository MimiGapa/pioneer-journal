import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import StrandsPage from "./pages/StrandsPage/StrandsPage";
import StrandPage from "./pages/StrandPage/StrandPage";
import ViewerPage from "./pages/ViewerPage/ViewerPage";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage";
import BackToTop from "./components/BackToTop/BackToTop";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import "./App.css";

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);
  // Default to showing splash
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
    
    // Check if this is a refresh using Performance API
    let isRefresh = false;
    
    // Try the modern Navigation API first
    if (window.performance && window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        isRefresh = navEntries[0].type === 'reload';
      }
    }
    
    // Fallback to older API if needed
    if (!isRefresh && window.performance && window.performance.navigation) {
      isRefresh = window.performance.navigation.type === 1;
    }
    
    // If it's a refresh, don't show splash
    if (isRefresh) {
      setShowSplash(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Header />
          <main className="main-content">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={location.pathname}
                classNames="fade"
                timeout={800}
                nodeRef={nodeRef}
              >
                <div className="route-wrapper" ref={nodeRef}>
                  <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/strands" element={<StrandsPage />} />
                    <Route path="/strand/:strandId" element={<StrandPage />} />
                    <Route
                      path="/view/:strandId/:paperId"
                      element={<ViewerPage />}
                    />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route
                      path="*"
                      element={
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                          Page under construction
                        </div>
                      }
                    />
                  </Routes>
                </div>
              </CSSTransition>
            </SwitchTransition>
          </main>
          <Footer />
          <BackToTop />
        </>
      )}
    </div>
  );
}

export default App;
