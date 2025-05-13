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
import ReportErrorInstructions from "./pages/ReportErrorInstructions/ReportErrorInstructions";
import SupportCenter from "./pages/SupportCenter/SupportCenter";
import BackToTop from "./components/BackToTop/BackToTop";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import Feedback from "./components/Feedback/Feedback";

import "./App.css";

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);

  const [showSplash, setShowSplash] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // New state

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
    let isRefresh = false;
    if (window.performance && window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isRefresh = navEntries[0].type === "reload";
      }
    }
    if (!isRefresh && window.performance && window.performance.navigation) {
      isRefresh = window.performance.navigation.type === 1;
    }
    if (isRefresh) {
      setShowSplash(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close the feedback modal when the route changes
  useEffect(() => {
    setIsFeedbackModalOpen(false);
  }, [location]);

  return (
    <div className="app">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Header setFeedbackOpen={setIsFeedbackModalOpen} /> {/* Pass setter */}
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
                    <Route path="/view/:strandId/:paperId" element={<ViewerPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/report-content-error" element={<ReportErrorInstructions />} />
                    <Route path="/support-center" element={<SupportCenter />} />
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
          <Feedback
            isModalOpen={isFeedbackModalOpen}           // Pass state
            setIsModalOpen={setIsFeedbackModalOpen}     // Pass setter
          />
        </>
      )}
    </div>
  );
}

export default App;
