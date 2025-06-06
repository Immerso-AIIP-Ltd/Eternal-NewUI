import React, { useState } from "react";
import "./Onboard.css"; 
import download from './download.jpg';
import { useNavigate } from 'react-router-dom';

function Onboarding2() {
    const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [progress, setProgress] = useState(75); // Progress indicator (e.g., 75%)

  // Options for the checkboxes
  const experienceOptions = [
    "Casual And Friendly",
    "Professional And Formal",
    "Informative And Detailed",
    "Quick And To The Point",
    "Creative And Engaging",
  ];

  // Function to handle checkbox change
  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Options:", selectedOptions);
    // You can save or process the selected options here
  };

      const handleSubmits = (e) => {
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
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="text-center position-relative">
              {/* Zodiac Wheel */}
              <div
                className="position-relative mx-auto"
                style={{
                  width: '650px',
                  height: '650px',
                  maxWidth: '90vw',
                  maxHeight: '90vw',
                  overflow: 'hidden',
                  borderRadius: '16px', // Rounded corners
                  border: '2px solid rgba(255, 255, 255, 0.1)' // Subtle border
                }}
              >
                <img
                  src={download}
                  alt="AI Experience"
                  className="img-fluid w-100 h-100 object-fit-cover"
                  style={{
                    borderRadius: '16px' // Ensure the image matches the container's rounded corners
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-center bg-dark text-white p-5">
            {/* Progress Indicator */}
            <div className="d-flex justify-content-end mb-4">
              <span className="text-secondary">3/4</span>
            </div>

            {/* Question */}
            <h2 className="mb-4">What kind of experience are you seeking when chatting with our Eternal AI?</h2>
            <p className="mb-4 text-secondary small">
              You can select multiple options from the following list.
            </p>

            {/* Checkbox Form */}
            <form onSubmit={handleSubmit}>
              {experienceOptions.map((option, index) => (
                <div key={index} className="form-check mb-2">
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="form-check-input me-2"
                    style={{
                      accentColor: '#00bfff' // Light blue color for checkboxes
                    }}
                  />
                  <label className="form-check-label" htmlFor={`option-${index}`}>
                    {option}
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
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                  onClick={handleSubmits}
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
}

export default Onboarding2;