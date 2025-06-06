import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Main = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 3
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  const starfieldStyle = {
    minHeight: '100vh',
    background: '#000000',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const starStyle = (star) => ({
    position: 'absolute',
    left: `${star.left}%`,
    top: `${star.top}%`,
    width: `${star.size}px`,
    height: `${star.size}px`,
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    opacity: star.opacity,
    animation: `twinkle 3s infinite ease-in-out`,
    animationDelay: `${star.animationDelay}s`
  });

  const plusStyle = {
    position: 'absolute',
    color: '#ffffff',
    fontSize: '20px',
    opacity: 0.6,
    animation: 'twinkle 4s infinite ease-in-out'
  };

  const mainContentStyle = {
    position: 'relative',
    zIndex: 10,
    color: '#ffffff',
    textAlign: 'center',
    padding: '0 20px',
    
  };

  const brandStyle = {
    fontSize: '14px',
    fontWeight: '300',
    marginBottom: '40px',
    opacity: 0.8,
    letterSpacing: '2px'
  };

const headingStyle = {
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  fontWeight: '300',
  lineHeight: '1.2',
  marginBottom: '30px',
  fontFamily: '"Manrope-SemiBold", Helvetica',
  backgroundImage: 'linear-gradient(90deg, rgba(161, 222, 47, 1) 0%, rgba(0, 163, 255, 1) 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
};


  const descriptionStyle = {
    fontSize: '16px',
    fontWeight: '300',
    opacity: 0.7,
    maxWidth: '500px',
    margin: '0 auto 40px auto',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    padding: '12px 30px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '400',
    marginRight: '15px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
    border: '1px solid #00ff88',
    color: '#ffffff',
    padding: '12px 30px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  };

  return (
    <>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .btn-hover:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            transform: translateY(-2px);
          }

          .btn-primary-hover:hover {
            background-color: #00cc6a !important;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 255, 136, 0.3);
          }

          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
        `}
      </style>
      
      <div style={starfieldStyle} className="d-flex align-items-center justify-content-center">
        {/* Animated Stars */}
        {stars.map(star => (
          <div key={star.id} style={starStyle(star)}></div>
        ))}
        
        {/* Plus symbols */}
        <div style={{...plusStyle, left: '15%', top: '20%', animationDelay: '0s'}}>+</div>
        <div style={{...plusStyle, right: '10%', top: '15%', animationDelay: '1s'}}>+</div>
        <div style={{...plusStyle, left: '20%', bottom: '25%', animationDelay: '2s'}}>+</div>
        <div style={{...plusStyle, right: '15%', bottom: '30%', animationDelay: '1.5s'}}>✦</div>
        <div style={{...plusStyle, left: '10%', top: '60%', animationDelay: '0.5s'}}>+</div>
        <div style={{...plusStyle, right: '25%', top: '45%', animationDelay: '2.5s'}}>✦</div>

        {/* Main Content */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div style={mainContentStyle}>
                <div style={brandStyle}>Eternal AI</div>
                
                <h1 style={headingStyle}>
                 Eternal AI is your personal companion
                  for inner growth and exploration.
                </h1>
                
                <p style={descriptionStyle}>
                  Eternal AI empowers you to reflect, grow, and connect deeply with your spiritual self. Through thoughtful prompts, intelligent guidance, and a serene interface, it helps you navigate your inner journey. Whether you're journaling, meditating, or seeking clarity, Eternal is here to walk with you—every step, every insight, every breakthrough.
                </p>
                
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center mt-4">
                  <a 
                    href="#" 
                    style={buttonStyle}
                    className="btn-hover mb-3 mb-sm-0"
                  >
                    Get Started ↗
                  </a>
                  <a 
                   href="/login" 
                    style={primaryButtonStyle}
                    className="btn-primary-hover"
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;