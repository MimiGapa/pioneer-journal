import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Feedback.css';

function Feedback({ isModalOpen, setIsModalOpen }) {
  const navigate = useNavigate();
  const [feedbackType, setFeedbackType] = useState(null);
  const [suggestText, setSuggestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFeedbackClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedbackType(null);
    setSuggestText('');
  };

  const handleReportClick = () => {
    navigate('/report-content-error');
    setIsModalOpen(false);
  };

  const handleImproveClick = () => {
    setFeedbackType('improve');
  };

  const handleSendImprovement = async () => {
    if (!suggestText.trim()) {
      alert("Please enter a suggestion before sending.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Anonymous User",
          email: "no-reply@pioneerjournal.com",
          subject: "Website Improvement Suggestion",
          message: suggestText
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Thank you for your feedback! Your suggestion has been sent.");
        setSuggestText('');
        handleCloseModal();
      } else {
        throw new Error(data.error || "Failed to send feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="feedback-button"
        onClick={handleFeedbackClick}
        tabIndex="0"
        aria-label="Open feedback modal"
        aria-controls="feedback-modal"
      >
        <i className="fas fa-comment" aria-hidden="true"></i>
        <span className="feedback-text">Feedback</span>
      </button>
      {isModalOpen && (
        <div className="feedback-modal-overlay" onClick={handleCloseModal}>
          <div id="feedback-modal" className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            {feedbackType === null ? (
              <div className="feedback-option">
                <h3>How can we support your research journey today?</h3>
                <button onClick={handleReportClick}>Submit a Correction</button>
                <button onClick={handleImproveClick}>Suggest an Archive Improvement</button>
              </div>
            ) : (
              <div className="feedback-suggestion">
                <h3>Suggest an Archive Improvement</h3>
                <p>
                  Your insights help us enhance the research archive. For general inquiries, please contact our{' '}
                  <Link to="/support-center">support team</Link>.
                </p>
                <textarea
                  value={suggestText}
                  onChange={(e) => setSuggestText(e.target.value)}
                  placeholder="Enter your suggestion here..."
                  maxLength={500}
                />
                <div className="feedback-actions">
                  <button 
                    className="return-btn"
                    onClick={() => setFeedbackType(null)}
                  >
                    Return
                  </button>
                  <button 
                    className="send-feedback-btn"
                    onClick={handleSendImprovement}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Feedback"}
                  </button>
                </div>
                <div className="character-counter">{suggestText.length}/500</div>
              </div>
            )}
            <button 
              className="close-modal" 
              aria-label="Close"
              onClick={handleCloseModal}
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedback;