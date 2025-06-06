import React, { useState } from "react";
import "./App.css"; // Custom CSS file for additional styling
import onboardhome from './onboardhome.jpg'
import { useNavigate } from 'react-router-dom'; 

const JourneyPage = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [progress, setProgress] = useState(1); // Progress indicator (e.g., 1/4)

  // Options for the checkboxes
  const journeyOptions = [
    { id: "growth", icon: "🔵", label: "Growth" },
    { id: "healing", icon: "🔴", label: "Healing" },
    { id: "spiritual", icon: "🟡", label: "Spiritual" },
    { id: "peace", icon: "🟢", label: "Peace" },
    { id: "creative", icon: "🔵", label: "Creative" },
    { id: "others", icon: "🔴", label: "Others" },
  ];

  // Function to handle checkbox change
  const handleCheckboxChange = (optionId) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

   const handleSubmit = (e) => {
    e.preventDefault();
    console.log("check")

    // Add your login logic here (optional)

    // Navigate to /profile
    navigate('/onboard');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      {/* Background Stars */}
      <div className="position-absolute w-100 " style={{ zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
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
              {/* Chakra Image */}
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
                  src={onboardhome}// Replace with your image path
                  alt="Chakras"
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
              <span className="text-secondary">1/4</span>
            </div>

            {/* Question */}
            <h2 className="mb-4">What do you seek from this journey?</h2>
            <p className="mb-4 text-secondary small">
              You can select multiple options from the following list.
            </p>

            {/* Checkbox Form */}
            <form  onSubmit={handleSubmit}>
              <div className="row g-3">
                {journeyOptions.map((option, index) => (
                  <div key={index} className="col-md-4">
                    <div
                      className="card bg-dark text-white p-3"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #404040"
                      }}
                    >
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => handleCheckboxChange(option.id)}
                          className="form-check-input me-2"
                        />
                        <label className="form-check-label" htmlFor={`option-${option.id}`}>
                          <span
                            className="icon-circle"
                            style={{
                              backgroundColor: option.icon,
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
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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

export default JourneyPage;