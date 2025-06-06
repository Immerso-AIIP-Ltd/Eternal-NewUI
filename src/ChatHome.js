import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const ChatHome = () => {
    const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Sample data for the scrolling cards
const cardData = [
  { id: 1, url: "meditation guidance", title: "Guide me through a morning meditation for spiritual awakening" },
  { id: 2, url: "chakra healing", title: "Analyze my chakra blockages and suggest healing crystals" },
  { id: 3, url: "numerology reading", title: "Calculate my life path number and explain its spiritual meaning" },
  { id: 4, url: "aura analysis", title: "What colors do you see in my aura and what do they mean?" },
  { id: 5, url: "dream interpretation", title: "Help me understand the spiritual message in my recurring dreams" },
  { id: 6, url: "energy cleansing", title: "Create a personalized energy cleansing ritual for my home" },
  { id: 7, url: "soul purpose discovery", title: "Discover my soul's purpose and spiritual mission in this lifetime" },
  { id: 8, url: "spiritual guidance", title: "Provide spiritual guidance for my current life challenges" },
  { id: 9, url: "manifestation coaching", title: "Help me align with the universe to manifest my desires" },
];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % (cardData.length * 200));
    }, 50);

    return () => clearInterval(interval);
  }, [cardData.length]);

  const StarIcon = () => (
    <div className="position-absolute text-white" style={{
      fontSize: '12px',
      opacity: 0.6,
      animation: 'twinkle 2s infinite'
    }}>
      ✦
    </div>
  );


    const handleSubmit = (e) => {
    e.preventDefault();
    console.log("check")

    // Add your login logic here (optional)

    // Navigate to /profile
    navigate('/chat');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Add Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        .hero-gradient-text {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          border-color: rgba(74, 222, 128, 0.3);
          box-shadow: 0 10px 30px rgba(74, 222, 128, 0.2);
        }
        
        .btn-custom {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(74, 222, 128, 0.3);
        }
        
        .scrolling-container {
          animation: scroll 30s linear infinite;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem !important;
          }
          .hero-subtitle {
            font-size: 1rem !important;
          }
        }
      `}</style>

      {/* Animated Stars Background */}
      <StarIcon />
      <div className="position-absolute" style={{ top: '20%', left: '10%' }}>
        <StarIcon />
      </div>
      <div className="position-absolute" style={{ top: '60%', right: '15%' }}>
        <StarIcon />
      </div>
      <div className="position-absolute" style={{ top: '80%', left: '20%' }}>
        <StarIcon />
      </div>
      <div className="position-absolute" style={{ top: '30%', right: '25%' }}>
        <StarIcon />
      </div>
      <div className="position-absolute" style={{ top: '70%', right: '35%' }}>
        <StarIcon />
      </div>

      <div className="container-fluid h-100">
        {/* Header */}
        <div className="row">
          <div className="col-12 text-center pt-4">
            <h6 className="text-white-50 mb-0">Eternal AI</h6>
          </div>
        </div>

        {/* Main Hero Section */}
        <div className="row justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="col-12 col-lg-8 text-center">
            <h1 className="hero-gradient-text fw-bold mb-4 hero-title" style={{ 
              fontSize: '4rem',
              lineHeight: '1.2',
              animation: 'float 6s ease-in-out infinite'
            }}>
             Eternal AI is your personal companion for inner growth and exploration.
            </h1>
            <p className="text-white-50 mb-4 hero-subtitle" style={{ 
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
            Eternal AI empowers you to reflect, grow, and connect deeply with your spiritual self. Through thoughtful prompts, intelligent guidance, and a serene interface, it helps you navigate your inner journey. Whether you're journaling, meditating, or seeking clarity, Eternal is here to walk with you—every step, every insight, every breakthrough.
            </p>
            <button className="btn btn-custom px-4 py-2 rounded-pill text-white fw-semibold" onClick={handleSubmit}>
              Start Journey 
              <span className="ms-2">🚀</span>
            </button>
          </div>
        </div>

        {/* Scrolling Cards Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="overflow-hidden" style={{ height: '400px' }}>
              <div className="d-flex flex-column gap-3 scrolling-container">
                {/* First Row */}
                <div className="d-flex gap-3" style={{ minWidth: '200%' }}>
                  {cardData.concat(cardData).map((card, index) => (
                    <div 
                      key={`row1-${index}`}
                      className="card-hover p-4 rounded-3"
                      style={{
                        minWidth: '350px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        flexShrink: '0'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-white fw-medium">{card.title}</span>
                        <span className="text-white-50">↗</span>
                      </div>
                      <a href={card.url} className="text-primary text-decoration-none small">
                        {card.url}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Second Row (Reverse Direction) */}
                <div className="d-flex gap-3" style={{ 
                  minWidth: '200%',
                  animation: 'scroll 25s linear infinite reverse'
                }}>
                  {cardData.concat(cardData).map((card, index) => (
                    <div 
                      key={`row2-${index}`}
                      className="card-hover p-4 rounded-3"
                      style={{
                        minWidth: '350px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        flexShrink: '0'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-white fw-medium">{card.title}</span>
                        <span className="text-white-50">↗</span>
                      </div>
                      <a href={card.url} className="text-primary text-decoration-none small">
                        {card.url}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Third Row */}
                <div className="d-flex gap-3" style={{ 
                  minWidth: '200%',
                  animation: 'scroll 35s linear infinite'
                }}>
                  {cardData.concat(cardData).map((card, index) => (
                    <div 
                      key={`row3-${index}`}
                      className="card-hover p-4 rounded-3"
                      style={{
                        minWidth: '350px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        flexShrink: '0'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-white fw-medium">{card.title}</span>
                        <span className="text-white-50">↗</span>
                      </div>
                      <a href={card.url} className="text-primary text-decoration-none small">
                        {card.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Star */}
        <div className="row">
          <div className="col-12 text-center pb-4">
            <div className="text-white" style={{ 
              fontSize: '2rem',
              opacity: '0.3',
              animation: 'twinkle 3s infinite'
            }}>
              ✦
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;