import React, { useState } from "react";
import "./App.css"; // Custom CSS file for additional styling
import Onboard from './Onboard.jpg';
import { useNavigate } from 'react-router-dom';

const Onboards = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(""); // State to store user input

  // Function to handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Input:", inputValue); // You can save or process the input here
    setInputValue(""); // Clear the input field
  };

      const handleSubmits= (e) => {
    e.preventDefault();
    console.log("check")

    // Add your login logic here (optional)

    // Navigate to /profile
    navigate('/onboard2');
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

    

      {/* Main Content */}
      <div className="container-fluid">
        <div className="row min-vh-100 align-items-center">
  
   {/* <div className="col-md-6 p-0">
  <img
    src={Onboard}
    alt="Meditation"
    className="img-fluid rounded-start ms-4"
  style={{ marginLeft: '25%' }}
  />
</div> */}
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
                  src={Onboard}
                  alt="AI Experience"
                  className="img-fluid w-100 h-100 object-fit-cover"
                  style={{
                    borderRadius: '16px' // Ensure the image matches the container's rounded corners
                  }}
                />
              </div>

          {/* Right Section - Form */}
          <div className="col-md-6 d-flex flex-column justify-content-center bg-dark text-white p-5">
            {/* Progress Indicator */}
            <div className="d-flex justify-content-end mb-4">
              <span className="text-secondary">2/4</span>
            </div>

            {/* Question */}
            <h2 className="mb-4">What brings you peace or joy in your everyday life?</h2>
            <p className="mb-4 text-secondary">
              Think of moments, habits, or small joys that make you feel light and connected.
            </p>

            {/* Input Field */}
            <form onSubmit={handleSubmit}>
              <textarea
                value={inputValue}
                onChange={handleChange}
                placeholder="Type here"
                className="form-control mb-4"
                rows="5"
              ></textarea>

              {/* Buttons */}
              <div className="d-flex justify-content-between align-items-center">
  <button type="button" className="btn btn-outline-light text-white-50">
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

export default Onboards;