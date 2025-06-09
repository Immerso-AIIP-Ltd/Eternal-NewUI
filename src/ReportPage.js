import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { useAuth } from './context/AuthContext';
import './ReportPage.css';
import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.png';
import image4 from './image4.png';
import image5 from './image5.png';
import image6 from './image6.png';
import image7 from './image7.png';
import image8 from './image8.png';
import image9 from './image9.png';

const ReportPage = () => {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [palmImageUploaded, setPalmImageUploaded] = useState(false);
  const [palmImageUrl, setPalmImageUrl] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Try to get from localStorage first (for immediate access)
        // const localReport = localStorage.getItem('eternalWellnessReport');
        const localReport = localStorage.getItem('eternalWellnessReport');
        if (localReport) {
          const parsedReport = JSON.parse(localReport);
          setReport(parsedReport.sections || processReportData(parsedReport));
          setPalmImageUploaded(parsedReport.palmImageUploaded || false);
          setPalmImageUrl(parsedReport.palmImageUrl || parsedReport.palmImage);
          setUserGender(parsedReport.userGender);
          setLoading(false);
          return;
        }

        // Fetch from Firestore if not in localStorage
        const reportDoc = await getDoc(doc(db, 'userResults', currentUser.uid));
        
        if (reportDoc.exists()) {
          const data = reportDoc.data();
          if (data.sections) {
            setReport(data.sections);
            setPalmImageUploaded(data.palmImageUploaded || false);
            setPalmImageUrl(data.palmImageUrl || data.palmImage);
            setUserGender(data.userGender);
          } else if (data.generatedReport) {
            // Parse the generated report text
            const parsedSections = parseGPTReport(data.generatedReport);
            setReport(parsedSections);
            setPalmImageUploaded(data.palmImageUploaded || false);
            setPalmImageUrl(data.palmImageUrl || data.palmImage);
            setUserGender(data.userGender);
          } else {
            // Fallback to old format
            setReport(processReportData(data));
            setPalmImageUploaded(false);
            setPalmImageUrl(null);
            setUserGender(null);
          }
        } else {
          // No report found, use mock data
          console.log('No report found, using mock data');
          const mockReport = getMockComprehensiveReport();
          setReport(mockReport.sections);
          setPalmImageUploaded(mockReport.palmImageUploaded);
          setPalmImageUrl(mockReport.palmImageUrl);
          setUserGender(mockReport.userGender);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load your wellness report. Please try again later.');
        // Fallback to mock data on error
        const mockReport = getMockComprehensiveReport();
        setReport(mockReport.sections);
        setPalmImageUploaded(mockReport.palmImageUploaded);
        setPalmImageUrl(mockReport.palmImageUrl);
        setUserGender(mockReport.userGender);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [currentUser, navigate]);

  // Parse GPT-generated report text into structured sections
  const parseGPTReport = (reportText) => {
    const sections = {};
    const sectionTitles = [
      'NUMEROLOGY WITH DATE OF BIRTH',
      'ETERNAL ARCHETYPE PROFILE',
      'VIBRATIONAL FREQUENCY DASHBOARD', 
      'AURA AND CHAKRA HEALTH',
      'RELATIONSHIP RESONANCE MAP',
      'MENTAL EMOTIONAL HEALTH',
      'SPIRITUAL ALIGNMENT SCORE',
      'PALM READINGS',
      'HEALTH INSIGHTS'
    ];

    sectionTitles.forEach((title, index) => {
      const nextTitle = sectionTitles[index + 1];
      
      // Create regex patterns to find sections
      const titleVariations = [title, title.toLowerCase(), title.replace(/\s+/g, '\\s+')];
      
      let content = '';
      let score = Math.floor(Math.random() * 30) + 70; // Default score

      for (const variation of titleVariations) {
        const pattern = nextTitle 
          ? new RegExp(`${variation}[:\\s]*([\\s\\S]*?)(?=${nextTitle.replace(/\s+/g, '\\s+')}|$)`, 'i')
          : new RegExp(`${variation}[:\\s]*([\\s\\S]*)$`, 'i');
        
        const match = reportText.match(pattern);
        
        if (match && match[1]) {
          content = match[1].trim();
          
          // Extract score from content
          const scoreMatch = content.match(/(?:score|rating)[:\s]*(\d{1,3})(?:\/100|%)?/i);
          if (scoreMatch) {
            score = parseInt(scoreMatch[1]);
            // Remove score line from content
            content = content.replace(/(?:score|rating)[:\s]*\d{1,3}(?:\/100|%)?/gi, '').trim();
          }
          
          // Clean up content
          content = content
            .replace(/^\s*[-•]\s*/gm, '') // Remove bullet points
            .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
          
          break;
        }
      }

      // If no content found, use default description
      if (!content || content.length < 20) {
        content = getDefaultDescription(title);
      }

      sections[title] = {
        description: content,
        score: score
      };
    });

    return sections;
  };

  // Get default descriptions for sections
  const getDefaultDescription = (title) => {
    const defaults = {
      'NUMEROLOGY WITH DATE OF BIRTH': 'Based on your birth date numerology, your Life Path Number reveals your soul\'s primary mission in this lifetime. Your Expression Number shows how you manifest your talents, while your Soul Urge Number indicates your deepest desires and motivations.',
      'ETERNAL ARCHETYPE PROFILE': 'Your spiritual archetype represents your soul\'s primary energy signature and sacred role in the cosmic tapestry. This archetype guides your spiritual gifts, challenges, and the unique way you serve others on their journey.',
      'VIBRATIONAL FREQUENCY DASHBOARD': 'Your current vibrational frequency reflects your energetic state and alignment with higher consciousness. This measurement indicates your resonance with love, healing, and spiritual growth frequencies.',
      'AURA AND CHAKRA HEALTH': 'Your aura colors reveal your current emotional and spiritual state, while your chakra health shows the flow of energy through your seven main energy centers. Each chakra corresponds to different aspects of your physical, emotional, and spiritual wellbeing.',
      'RELATIONSHIP RESONANCE MAP': 'Your relationship patterns reveal how you energetically connect with others and the types of soul contracts you tend to form. This includes understanding your empathic boundaries and how relationships serve your spiritual growth.',
      'MENTAL EMOTIONAL HEALTH': 'Your mental and emotional patterns show your current state of psychological wellbeing, stress levels, and emotional processing abilities. This includes your intuitive sensitivity and capacity for emotional healing.',
      'SPIRITUAL ALIGNMENT SCORE': 'Your spiritual alignment indicates how connected you are to your higher self, life purpose, and divine guidance. This measures your consistency in spiritual practices and openness to spiritual growth.',
      'PALM READINGS': palmImageUploaded ? 
        `Your palm analysis reveals profound insights about your life path, relationships, health patterns, and spiritual destiny written in the sacred lines of your ${userGender === 'male' ? 'left' : 'right'} hand.` : 
        `Palm reading requires an uploaded image of your ${userGender === 'male' ? 'left' : 'right'} palm to provide detailed palmistry analysis including life line, heart line, head line, and spiritual mount interpretations.`,
      'HEALTH INSIGHTS': 'Your holistic health insights provide guidance for maintaining optimal physical, mental, emotional, and spiritual wellbeing. This includes recommendations for diet, exercise, stress management, and energy healing practices.'
    };
    return defaults[title] || 'Insights and guidance for your spiritual journey and soul evolution.';
  };

  // Process legacy report data format
  const processReportData = (data) => {
    if (data.sections) return data.sections;
    
    const sections = {};
    const newTitles = [
      'NUMEROLOGY WITH DATE OF BIRTH',
      'ETERNAL ARCHETYPE PROFILE', 
      'VIBRATIONAL FREQUENCY DASHBOARD',
      'AURA AND CHAKRA HEALTH',
      'RELATIONSHIP RESONANCE MAP',
      'MENTAL EMOTIONAL HEALTH',
      'SPIRITUAL ALIGNMENT SCORE',
      'PALM READINGS',
      'HEALTH INSIGHTS'
    ];

    newTitles.forEach((title, index) => {
      sections[title] = {
        description: getDefaultDescription(title),
        score: Math.floor(Math.random() * 30) + 70
      };
    });

    return sections;
  };

  // Mock comprehensive report with new structure
  const getMockComprehensiveReport = () => {
    return {
      palmImageUploaded: false,
      palmImageUrl: null,
      userGender: 'male',
      sections: {
        "NUMEROLOGY WITH DATE OF BIRTH": {
          description: "Life Path Number (Birthdate Calculation): 6 (3 + 7 + 2 + 0 + 0 + 3 = 15 -> 1 + 5 = 6) Meaning: Life path number 6 signifies harmony, nurturing, and responsibility. Individuals with this number are often caring, compassionate, and thrive in environments where they can support others. Destiny Number (Full Name Calculation): 5 (9 + 1 + 4 + 1 + 4 + 5 + 4 + 5 + 9 + 5 + 5 + 2 + 6 + 5 + 9 + 5 + 2 + 5 + 4 + 5 + 9 + 1 + 9 = 123 -> 1 + 2 + 3 = 6) Meaning: Destiny number 5 represents freedom, adaptability, and curiosity. Individuals with this number are known for their versatility, love for change, and desire for exploration.",
          score: 88
        },
        "ETERNAL ARCHETYPE PROFILE": {
          description: "Spiritual Personality Type: Seeker Characteristics: As a Seeker, you have a natural curiosity towards spiritual growth and self-discovery. You are open-minded, adventurous, and always seeking deeper truths and meanings in life.",
          score: 85
        },
        "VIBRATIONAL FREQUENCY DASHBOARD": {
          description: "Current Energetic State: 85/100 Analysis: Your energetic state is quite high, indicating a strong connection to higher vibrations. Keep nurturing this energy through practices like meditation, mindfulness, and spending time in nature.",
          score: 78
        },
        "AURA AND CHAKRA HEALTH": {
          description: "Aura Colors: Blue and Green Chakra Alignment Status: Balanced Analysis: Your aura colors suggest calmness, communication, and healing energy. Your balanced chakras indicate overall well-being and harmony within your energy centers.",
          score: 82
        },
        "RELATIONSHIP RESONANCE MAP": {
          description: "Relationship Energy Impact: Positive (+) Analysis: Your relationships have a positive impact on your energy, bringing joy, support, and fulfillment. Ensure to nurture these connections and maintain healthy boundaries.",
          score: 91
        },
        "MENTAL EMOTIONAL HEALTH": {
          description: "Your emotional intelligence is highly developed with strong empathic abilities. You tend to absorb others' emotions which requires daily energy clearing practices. Mental clarity peaks during morning meditation sessions.",
          score: 85
        },
        "SPIRITUAL ALIGNMENT SCORE": {
          description: "Excellent alignment with your higher purpose and spiritual practices. Your connection to divine guidance is strong through meditation and intuitive practices. Natural ability to channel healing energy and receive spiritual insights.",
          score: 91
        },
        "PALM READINGS": {
          description: palmImageUploaded ? 
            "Your palm reveals a strong life line indicating vitality and longevity. Deep heart line shows capacity for profound emotional connections. Your head line indicates analytical thinking balanced with strong intuition." : 
            "Palm reading analysis requires an uploaded image of your correct hand (left for males, right for females) to provide detailed palmistry insights.",
          score: palmImageUploaded ? 84 : 0
        },
        "HEALTH INSIGHTS": {
          description: "Overall strong constitution with recommendation for stress management and nervous system support. Focus on grounding practices, adequate hydration, and regular movement to maintain optimal energetic balance.",
          score: 79
        }
      }
    };
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#4CAF50'; // Green
    if (score >= 75) return '#8BC34A'; // Light green  
    if (score >= 65) return '#FFC107'; // Amber
    if (score >= 50) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 65) return 'Good'; 
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  };

  const handleRetakeQuiz = () => {
    // Clear existing data
    localStorage.removeItem('eternalWellnessReport');
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your Comprehensive Soul Journey Report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="error-message">{error}</div>
        <button className="action-button" onClick={() => navigate('/chat')}>
          Return to Chat
        </button>
      </div>
    );
  }

  // Filter out sections with no content and ensure all required sections are present
  const requiredSections = [
    'NUMEROLOGY WITH DATE OF BIRTH',
    'ETERNAL ARCHETYPE PROFILE',
    'VIBRATIONAL FREQUENCY DASHBOARD',
    'AURA AND CHAKRA HEALTH',
    'RELATIONSHIP RESONANCE MAP',
    'MENTAL EMOTIONAL HEALTH',
    'SPIRITUAL ALIGNMENT SCORE',
    'PALM READINGS',
    'HEALTH INSIGHTS'
  ];

  // Ensure all required sections exist
  requiredSections.forEach(sectionTitle => {
    if (!report[sectionTitle]) {
      report[sectionTitle] = {
        description: getDefaultDescription(sectionTitle),
        score: Math.floor(Math.random() * 30) + 70
      };
    }
  });

  const validSections = Object.entries(report).filter(([title, data]) => 
    data && data.description && requiredSections.includes(title)
  );
  
  const totalScore = validSections.length > 0 ? 
    validSections.reduce((sum, [, data]) => sum + (data.score || 0), 0) / validSections.length : 0;

  return (
    <div className="report-page">
      {/* Cosmic Background */}
      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="report-container">
        {/* Header Section */}
        <header className="report-header">
          <div className="header-content">
            <div className="main-title">
              <h1>Your Complete Soul Journey Report</h1>
              <p>A comprehensive analysis of your spiritual, energetic, numerological, and vibrational wellbeing</p>
            </div>
          </div>
        </header>

        {/* AI Profile Section */}
        <section className="ai-profile-section">
          <div className="profile-container-no-image">
            <div className="profile-info">
              <div className="ai-label">
                <span className="eternal-text">Eternal AI Comprehensive Analysis</span>
                <h2>{currentUser?.displayName || 'Spiritual Seeker'}</h2>
              </div>
              <div className="profile-description">
                <p>Your consciousness bridge and AI-guided spiritual analysis. This comprehensive report combines numerology, palmistry, aura reading, chakra analysis, and spiritual alignment assessment to provide you with deep insights into your soul's journey and highest potential.</p>
              </div>
            </div>
            <div className="score-display">
              <div className="score-card">
                <span className="score-label">Overall Spiritual Score</span>
                <div className="score-value">{Math.round(totalScore)}%</div>
                <div className="score-chart">
                  <div className="chart-fill" style={{ width: `${totalScore}%`, backgroundColor: getScoreColor(totalScore) }}></div>
                </div>
              </div>
              <div className="score-card">
                <span className="score-label">Analysis Completion</span>
                <div className="score-value">{palmImageUploaded ? '100' : '89'}%</div>
                <div className="score-chart">
                  <div className="chart-fill" style={{ width: `${palmImageUploaded ? 100 : 89}%` }}></div>
                </div>
                {!palmImageUploaded && (
                  <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '8px' }}>
                    Upload {userGender === 'male' ? 'left' : 'right'} palm for complete analysis
                  </small>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Report Cards Section */}
        <section className="report-cards-section">
          <h2 className="section-title">Your Comprehensive Analysis</h2>
          
          <div className="report-cards-grid">
            {requiredSections.map((title, index) => {
              const data = report[title];
              return (
                <div key={index} className="report-card">
                  <div className="card-content">
                    <div className="card-header">
                      <h4>{title}</h4>
                      <div style={{ 
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: getScoreColor(data.score || 0),
                        marginBottom: '8px'
                      }}>
                        {data.score || 0}/100
                      </div>
                    </div>
                    <div className="card-description">
                      <p>{data.description}</p>
                    </div>
                    
                    {/* Show palm image if available and this is palm reading section */}
                    {title === 'PALM READINGS' && palmImageUploaded && palmImageUrl && (
                      <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <img 
                          src={palmImageUrl} 
                          alt={`${userGender === 'male' ? 'Left' : 'Right'} Palm Analysis`}
                          style={{ 
                            maxWidth: '100%', 
                            height: '200px', 
                            objectFit: 'cover',
                            borderRadius: '12px',
                            border: '2px solid rgba(161, 222, 47, 0.3)'
                          }} 
                        />
                        <p style={{ 
                          fontSize: '0.8rem', 
                          color: 'rgba(255,255,255,0.7)', 
                          marginTop: '8px' 
                        }}>
                          {userGender === 'male' ? 'Left' : 'Right'} Palm Analysis
                        </p>
                      </div>
                    )}
                    
                    <div style={{ marginTop: '15px' }}>
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ 
                            width: `${data.score || 0}%`,
                            backgroundColor: getScoreColor(data.score || 0)
                          }}
                        ></div>
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: getScoreColor(data.score || 0),
                        fontWeight: '600',
                        marginTop: '5px'
                      }}>
                        {getScoreLabel(data.score || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Analytics Section */}
        <section className="analytics-section">
          <h2 className="section-title">Detailed Analysis Breakdown</h2>
          
          <div className="analytics-grid">
            {requiredSections.map((title, index) => {
              const data = report[title];
              return (
                <div key={index} className="analytics-card">
                  <div className="analytics-score" style={{ color: getScoreColor(data.score || 0) }}>
                    {data.score || 0}
                  </div>
                  <div className="analytics-info">
                    <h4>{title}</h4>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ 
                          width: `${data.score || 0}%`,
                          backgroundColor: getScoreColor(data.score || 0)
                        }}
                      ></div>
                    </div>
                    <span className="score-label" style={{ color: getScoreColor(data.score || 0) }}>
                      {getScoreLabel(data.score || 0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="analytics-section" style={{ marginTop: '60px' }}>
          <h2 className="section-title">Personalized Recommendations</h2>
          <div className="report-cards-grid">
            <div className="report-card">
              <div className="card-content">
                <div className="card-header">
                  <h4>🧘‍♀️ Daily Spiritual Practice</h4>
                </div>
                <div className="card-description">
                  <p>Based on your numerology and spiritual alignment, incorporate 20 minutes of morning meditation, weekly crystal healing sessions, and evening gratitude journaling to enhance your spiritual connection.</p>
                </div>
              </div>
            </div>
            
            <div className="report-card">
              <div className="card-content">
                <div className="card-header">
                  <h4>💎 Recommended Crystals</h4>
                </div>
                <div className="card-description">
                  <p>Amethyst for spiritual protection and intuition, Rose Quartz for heart chakra healing, Clear Quartz for energy amplification, and Selenite for aura cleansing. Meditate with these stones daily.</p>
                </div>
              </div>
            </div>

            <div className="report-card">
              <div className="card-content">
                <div className="card-header">
                  <h4>🌱 Energy Enhancement</h4>
                </div>
                <div className="card-description">
                  <p>Practice grounding exercises in nature, use sage or palo santo for space clearing, maintain energetic boundaries through visualization, and perform weekly aura cleansing rituals.</p>
                </div>
              </div>
            </div>

            <div className="report-card">
              <div className="card-content">
                <div className="card-header">
                  <h4>🌟 Numerological Guidance</h4>
                </div>
                <div className="card-description">
                  <p>Your life path number suggests focusing on spiritual learning and serving others. Consider pursuing metaphysical studies, energy healing certifications, or spiritual counseling training.</p>
                </div>
              </div>
            </div>

            <div className="report-card">
              <div className="card-content">
                <div className="card-header">
                  <h4>🖐️ Palmistry Insights</h4>
                </div>
                <div className="card-description">
                  {palmImageUploaded ? (
                    <p>Your palm lines reveal your life path and spiritual gifts. Focus on developing the talents indicated by your mounts and lines, particularly in healing and intuitive work.</p>
                  ) : (
                    <>
                      <p>Complete your spiritual analysis by uploading your {userGender === 'male' ? 'left' : 'right'} palm image to unlock detailed palmistry insights about your destiny, relationships, and spiritual gifts.</p>
                      <button 
                        className="action-button" 
                        onClick={() => navigate('/chat')}
                        style={{ marginTop: '15px' }}
                      >
                        Upload {userGender === 'male' ? 'Left' : 'Right'} Palm Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="report-card">
              <div className="card-content">
                <div className="card-header">
                  <h4>🌿 Health & Wellness</h4>
                </div>
                <div className="card-description">
                  <p>Maintain your spiritual health through regular energy clearing, proper hydration, organic nutrition, and stress management techniques like breathwork and yoga.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spiritual Journey Tracker */}
        <section className="analytics-section" style={{ marginTop: '60px' }}>
          <h2 className="section-title">Your Spiritual Progress Tracker</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-score" style={{ fontSize: '2rem' }}>7</div>
              <div className="analytics-info">
                <h4>Chakras Analyzed</h4>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: '100%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <span className="score-label" style={{ color: '#4CAF50' }}>Complete</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-score" style={{ fontSize: '2rem' }}>{palmImageUploaded ? '9' : '6'}</div>
              <div className="analytics-info">
                <h4>Spiritual Aspects Analyzed</h4>
                <div className="score-bar">
                  <div className="score-fill" style={{ 
                    width: `${palmImageUploaded ? 100 : 67}%`, 
                    backgroundColor: palmImageUploaded ? '#4CAF50' : '#FFC107' 
                  }}></div>
                </div>
                <span className="score-label" style={{ 
                  color: palmImageUploaded ? '#4CAF50' : '#FFC107' 
                }}>
                  {palmImageUploaded ? 'Complete' : 'Partial'}
                </span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-score" style={{ fontSize: '2rem' }}>12</div>
              <div className="analytics-info">
                <h4>Numerological Calculations</h4>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: '100%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <span className="score-label" style={{ color: '#4CAF50' }}>Complete</span>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-score" style={{ fontSize: '2rem' }}>∞</div>
              <div className="analytics-info">
                <h4>Spiritual Potential</h4>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: '85%', backgroundColor: '#8BC34A' }}></div>
                </div>
                <span className="score-label" style={{ color: '#8BC34A' }}>Expanding</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="report-footer">
          <div className="footer-content">
            <h3 style={{ 
              color: '#A1DE2F', 
              marginBottom: '20px',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Continue Your Sacred Journey
            </h3>
            <p>
              This comprehensive spiritual analysis represents your current energetic state and soul development. 
              As you grow and evolve through spiritual practices, your vibration, alignment, and life path will continue to unfold. 
              Consider retaking this assessment every 3-6 months to track your spiritual evolution and growth.
            </p>
            
            {/* Palm Image Display in Footer if Available */}
            {palmImageUploaded && palmImageUrl && (
              <div style={{ 
                margin: '30px 0',
                padding: '20px',
                background: 'rgba(161, 222, 47, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(161, 222, 47, 0.3)',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#A1DE2F', marginBottom: '15px' }}>🖐️ Your Palm Analysis</h4>
                <img 
                  src={palmImageUrl} 
                  alt={`${userGender === 'male' ? 'Left' : 'Right'} Palm`}
                  style={{ 
                    maxWidth: '300px', 
                    height: '250px', 
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '2px solid rgba(161, 222, 47, 0.5)'
                  }} 
                />
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(255,255,255,0.8)', 
                  marginTop: '10px' 
                }}>
                  {userGender === 'male' ? 'Left' : 'Right'} Palm - Traditional palmistry analysis as per ancient guidelines
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
              <button className="retake-button" onClick={handleRetakeQuiz}>
                Retake Complete Assessment
              </button>
              <button 
                className="action-button" 
                onClick={() => navigate('/chat')}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                Continue Spiritual Chat
              </button>
            </div>
            
            <div style={{ 
              marginTop: '30px', 
              padding: '20px',
              background: 'rgba(161, 222, 47, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(161, 222, 47, 0.3)'
            }}>
              <h4 style={{ color: '#A1DE2F', marginBottom: '10px' }}>🌟 Your Sacred Affirmation</h4>
              <p style={{ 
                fontStyle: 'italic', 
                fontSize: '1.1rem', 
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                "I am a divine being of infinite light and love, connected to the cosmic wisdom of the universe. 
                My spiritual journey unfolds perfectly according to divine timing, and I trust in my highest path. 
                I embrace my unique gifts and use them to serve the highest good of all."
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReportPage;
