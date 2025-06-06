import React, { useState } from "react";
import "./App.css"; // Custom CSS file for additional styling
import check from './check.jpg'
import { useNavigate } from 'react-router-dom'; 

const OnboardMain = () => {
       const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  // Options for radio buttons
  const interactionOptions = [
    {
      id: "ai_lead",
      label: "AI Lead",
      description: "AI asks questions or gives prompts, and I'll respond accordingly.",
      icon: "✨"
    },
    {
      id: "you_lead",
      label: "You Lead",
      description: "I initiate conversation, ask questions, and provide topics for discussion.",
      icon: "👤"
    },
    {
      id: "mixed",
      label: "Mixed",
      description: "A blend of both, where either of us can initiate and steer the conversation.",
      icon: "⚔️"
    }
  ];

  // Function to handle radio button change
  const handleRadioChange = (optionId) => {
    setSelectedOption(optionId);
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    console.log("check")

    // Add your login logic here (optional)

    // Navigate to /profile
    navigate('/home');
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      {/* Background Stars */}
      <div className="position-absolute w-100 " style={{ zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="position-absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              background: '#ffffff',
              borderRadius: '50%',
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Large Decorative Stars */}
      {/* <div className="position-absolute text-white opacity-25">
        <span className="position-absolute" style={{ top: '8%', left: '5%' }}>★</span>
        <span className="position-absolute" style={{ top: '15%', right: '10%' }}>★</span>
        <span className="position-absolute" style={{ bottom: '20%', left: '8%' }}>★</span>
        <span className="position-absolute" style={{ bottom: '15%', right: '12%' }}>★</span>
        <span className="position-absolute" style={{ top: '40%', right: '5%' }}>★</span>
        <span className="position-absolute" style={{ bottom: '60%', left: '3%' }}>★</span>
      </div> */}

      {/* Main Content */}
      <div className="container-fluid">
        <div className="row min-vh-100 align-items-center">
          {/* Left Section - Image */}
          <div className="col-md-6 p-0">
            <div className="text-center position-relative">
              {/* AI Image */}
              <div
                className="position-relative mx-auto"
                style={{
                  width: "450px",
                  height: "450px",
                  maxWidth: "90vw",
                  maxHeight: "90vw",
                  overflow: "hidden",
                  borderRadius: "16px", // Rounded corners
                  border: "2px solid rgba(255, 255, 255, 0.1)" // Subtle border
                }}
              >
                <img
                  src={check} // Replace with your image path
                  alt="AI Silhouette"
                  className="img-fluid w-100 h-100 object-fit-cover"
                  style={{
                    borderRadius: "16px" // Match the container's rounded corners
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="col-md-6 d-flex flex-column justify-content-center bg-dark text-white p-5">
            {/* Progress Indicator */}
            <div className="d-flex justify-content-end mb-4">
              <span className="text-secondary">4/4</span>
            </div>

            {/* Question */}
            <h2 className="mb-4">Do you prefer the AI to initiate conversation and ask questions, or would you rather lead the interaction?</h2>
            <p className="mb-4 text-secondary small">
              Select only single option from the following list.
            </p>

            {/* Radio Buttons */}
            <form onSubmit={handleSubmit}>
              {interactionOptions.map((option, index) => (
                <div key={index} className="mb-3">
                  <label className="form-check form-check-inline">
                    <input
                      type="radio"
                      name="interactionMode"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => handleRadioChange(option.id)}
                      className="form-check-input me-2"
                    />
                    <span className="form-check-label">
                      <span
                        className="icon-circle"
                        style={{
                          backgroundColor: "#ffffff",
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          marginRight: "5px",
                          color: "#ffffff",
                          textAlign: "center",
                          lineHeight: "20px"
                        }}
                      >
                        {option.icon}
                      </span>
                      {option.label}
                    </span>
                    <small className="form-text text-white mt-1">{option.description}</small>
                  </label>
                </div>
              ))}

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-outline-light">
                  Skip
                </button>
                <button
                  type="submit"
                  className="btn px-4 py-2 fw-semibold"
                  style={{
                     background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
                    border: "none",
                    color: "white",
                    borderRadius: "8px"
                  }}
                >
                  Next →
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardMain;