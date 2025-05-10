import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feedback.css';

function Feedback({ onClose }) {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [suggestText, setSuggestText] = useState('');

  const handleFeedbackClick = () => {
    setIsFeedbackOpen(true);
  };

  const handleCloseModal = () => {
    setIsFeedbackOpen(false);
    setFeedbackType(null);
    setSuggestText('');
    if (onClose) onClose();
  };

  const handleReportClick = () => {
    navigate('/report-content-error');
    setIsFeedbackOpen(false);
  };

  const handleImproveClick = () => {
    setFeedbackType('improve');
  };

  const handleSendImprovement = async () => {
    if (!suggestText.trim()) {
      alert("Please enter a suggestion before sending.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Anonymous User", // Keeps sender anonymous
          email: "no-reply@pioneerjournal.com", // Optional sender email
          subject: "Website Improvement Suggestion",
          message: suggestText
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Thank you for your feedback! Your suggestion has been sent.");
        setSuggestText(''); // Clears the textarea after successful submission
        handleCloseModal(); // Closes the modal
      } else {
        throw new Error(data.error || "Failed to send feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <button
        className="feedback-button"
        onClick={handleFeedbackClick}
        tabIndex="0"
        aria-label="Open feedback modal"
      >
        <i className="fas fa-comment"></i>
        <span className="feedback-text">Feedback</span>
      </button>
      {isFeedbackOpen && (
        <div className="feedback-modal-overlay" onClick={handleCloseModal}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            {feedbackType === null ? (
              <div className="feedback-option">
                <h3>How can we support your research journey today?</h3>
                <button onClick={handleReportClick}>Submit a Correction</button>
                <button onClick={handleImproveClick}>Suggest an Archive Improvement</button>
              </div>
            ) : (
              <div className="feedback-suggestion">
                <h3>Suggest an Archive Improvement</h3>
                <p>Your insights help us enhance the research archive. For general inquiries, please contact our support team.</p>
                <textarea
                  value={suggestText}
                  onChange={(e) => setSuggestText(e.target.value)}
                  placeholder="Enter your suggestion here..."
                  maxLength={500}
                />
                <div className="feedback-actions">
                  <button 
                    className="return-btn"
                    onClick={() => setFeedbackType(null)}>Return
                  </button>
                  <button 
                    className="send-feedback-btn"
                    onClick={handleSendImprovement}>Send Feedback
                  </button>
                </div>
                <div className="character-counter">{suggestText.length}/500</div>
              </div>
            )}
            <button 
              className="close-modal" 
              onClick={handleCloseModal}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedback;
