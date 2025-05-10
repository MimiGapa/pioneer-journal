import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SupportCenter.css';

function SupportCenter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    subject: '',
    message: '',
    role: '',
    file: null
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
    setErrors({ ...errors, [name]: '' });
  };

  const clearRoleSelection = () => {
    setFormData({ ...formData, role: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.confirmEmail) newErrors.confirmEmail = 'Confirm Email is required';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    if (formData.message.length > 500) newErrors.message = 'Message exceeds 500 characters';
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleMessageChange = (e) => {
    const messageValue = e.target.value;

    if (messageValue.length <= 500) {
      setFormData({ ...formData, message: messageValue });
    }

    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Expand dynamically
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      alert("Thank you for contacting us! Your information has been sent.");
      setFormData({ name: '', email: '', confirmEmail: '', subject: '', message: '', role: '', file: null });
    } else {
      throw new Error(data.error || "Failed to send email. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(`Error: ${error.message}`);
  }

    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="support-center container">
      <h2>Support Center</h2>
      <p>Please fill out the form below to submit your report or question:</p>
      <form onSubmit={handleSubmit} className="support-form" ref={formRef}>
        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label>Name<span className="required">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className={`form-group ${errors.email ? 'error' : ''}`}>
          <label>Email<span className="required">*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className={`form-group ${errors.confirmEmail ? 'error' : ''}`}>
          <label>Confirm Email<span className="required">*</span></label>
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className={formData.email && formData.confirmEmail ? (formData.email === formData.confirmEmail ? 'valid' : 'invalid') : ''}
          />
          {errors.confirmEmail && <span className="error-text">{errors.confirmEmail}</span>}
        </div>
        <div className={`form-group ${errors.subject ? 'error' : ''}`}>
          <label>Subject<span className="required">*</span></label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
          {errors.subject && <span className="error-text">{errors.subject}</span>}
        </div>
        <div className={`form-group ${errors.message ? 'error' : ''}`}>
          <label>Message<span className="required">*</span></label>
          <div className="message-container">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleMessageChange}
              className={`expandable-textarea ${formData.message.length > 500 ? "exceed-limit" : ""}`}
            />
            <span className={`char-counter ${formData.message.length > 500 ? "exceed-limit" : ""}`}>
              {formData.message.length}/500
            </span>
          </div>
          {errors.message && <span className="error-text">{errors.message}</span>}
        </div>
        <div className="form-group">
          <label>Role <span className="optional">(Optional)</span></label>
          <div className="role-container">
            <div className="role-options">
              {["Student", "Teacher", "Researcher"].map((role) => (
                <label key={role}>
                  <input type="radio" name="role" value={role} checked={formData.role === role} onChange={handleChange} />
                  {role}
                </label>
              ))}
            </div>
            <button 
              type="button" 
              className="clear-sltn-btn"
              onClick={clearRoleSelection}
              >
              Clear Selection
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>File Attachment <span className="optional">(Optional)</span></label>
          <input type="file" name="file" onChange={handleChange} />
        </div>
        <div className="privacy-notice">
          We value your privacy—only share requested details.
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setFormData({ name: '', email: '', confirmEmail: '', subject: '', message: '', role: '', file: null })}
            >Cancel
          </button>
          <button 
            type="submit"
            className="submit-btn"
            >Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SupportCenter;