// src/components/Chatbot/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from './firebase/config';
import 'bootstrap-icons/font/bootstrap-icons.css';
import chatGPT from './services/chatGPT'
import 'bootstrap/dist/css/bootstrap.min.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Welcome to Eternal! I am your spiritual guide, here to help discover your cognitive identity and unveil your spiritual aura. I will ask you a series of questions to understand your energy better. Ready to begin?',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasExistingReport, setHasExistingReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [palmImageUploaded, setPalmImageUploaded] = useState(false);
  const [showPalmUpload, setShowPalmUpload] = useState(false);
  const [palmImage, setPalmImage] = useState(null);
  const [palmImageUrl, setPalmImageUrl] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [imageValidationAttempts, setImageValidationAttempts] = useState(0);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

const [conversation, setConversation] = useState([
  {
    role: 'system',
    content: `You are Eternal, a wise and compassionate spiritual guide who helps users build their personalized spiritual wellness profile.

Your role is to conduct a gentle, warm, step-by-step interview. The conversation should feel natural, caring, and grounded — like speaking to a trusted guide.

🌟 INTERVIEW FLOW:
You will ask the following **19 questions** in order, strictly **one at a time**.  
You must **validate each response** before moving to the next.  
If the answer is missing, unclear, or in the wrong format, **ask the user again** kindly and clearly.

---

🧘🏽 GUIDELINES (DO NOT VIOLATE):
- Ask **one question at a time**.
- After the user replies, validate the answer:
  - If it's valid, thank them briefly and go to the next question.
  - If it's incomplete or doesn't fit the expected format, gently ask for clarification or correction.
- Keep each message short (1–3 sentences).
- Be empathetic and non-judgmental, even if the user gives an incorrect or vague response.

---

📝 QUESTIONS TO ASK (one at a time):

🌿 CORE IDENTITY
1. What is your full name? (Expecting a complete name.)
2. What is your date of birth? (Expect format like DD-MM-YYYY or YYYY-MM-DD.)
3. What is your blood group? (Expect values like A+, B-, O+, AB- etc.)
4. What time were you born? (Expect a specific time, like 03:30 PM.)
5. What is your gender? (Important for palm reading later.)
6. What is your current profession?

🌿 LIFESTYLE
7. What is your favorite color?
8. What is your height? (In cm or feet+inches.)
9. What is your weight? (In kg or pounds.)
10. What is your usual sleep schedule like? (How many hours, any irregularities, etc.)
11. How active are you physically? (Daily walk, gym, yoga, sedentary, etc.)
12. Do you drink alcohol? (Yes/No/Sometimes.)
13. Do you smoke? (Yes/No/Occasionally.)

🌿 NUTRITION & RHYTHM
14. How would you describe your typical daily diet?  (Vegetarian, vegan, Non-vegetarian), omnivore, etc.)
15. How much water do you drink per day? (In litres or glasses.)

🌿 EMOTIONAL & MENTAL STATE
16. How would you rate your current stress levels? (Low, Medium, High.)

🌿 RELATIONSHIPS & ENERGETICS
17. Do you feel supported by the people in your life?
18. Do you feel connected to your life's purpose?

---

🖐🏼 FINAL PALM IMAGE REQUEST:
Once the 19th question is answered correctly, say this:

"Thank you for sharing all this sacred information. To complete your spiritual profile, I need to analyze your palm.  
Please upload a clear image of your **RIGHT palm if you're MALE**, or your **LEFT palm if you're FEMALE**.  
This follows traditional palmistry principles for the most accurate reading."

---

🧠 Remember:
- Only continue when the previous answer is acceptable.
- Always speak with care, empathy, and presence.
- This is a sacred experience for the user — honor their space.

`
  }
]);

  // Effect to scroll to bottom when messages change - FIXED FLICKERING
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Use setTimeout to ensure DOM is updated before scrolling
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Extract gender from conversation
  useEffect(() => {
    const extractGender = () => {
      const userMessages = messages.filter(msg => msg.role === 'user').map(msg => msg.content.toLowerCase());
      for (const message of userMessages) {
        if (message.includes('male') && !message.includes('female')) {
          setUserGender('male');
          break;
        } else if (message.includes('female')) {
          setUserGender('female');
          break;
        } else if (message.includes('man') || message.includes('boy')) {
          setUserGender('male');
          break;
        } else if (message.includes('woman') || message.includes('girl')) {
          setUserGender('female');
          break;
        }
      }
    };
    extractGender();
  }, [messages]);

  // Function to upload image to Firebase Storage
  const uploadPalmImage = async (file) => {
    try {
      const timestamp = Date.now();
      const fileName = `palm_readings/${currentUser.uid}_${timestamp}_palm.jpg`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading palm image:', error);
      throw error;
    }
  };

  // Function to convert image file to base64 for GPT analysis
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Function to validate if uploaded image is actually a palm using GPT Vision
  const validatePalmImage = async (imageBase64) => {
    try {
      const prompt = `Analyze this image carefully and determine if it shows a human palm/hand. 

Requirements for a valid palm image:
1. Must show the palm side (inside) of a human hand
2. Palm lines should be clearly visible
3. Fingers and thumb should be visible and spread out
4. Image should be clear enough for palmistry analysis
5. Should not be the back of hand, fist, or partial hand

Respond with ONLY one of these exact phrases:
- "VALID_PALM" if this is a clear palm image suitable for palmistry
- "NOT_PALM" if this is not a palm or hand at all
- "UNCLEAR_PALM" if this is a hand/palm but too blurry, dark, or unclear for analysis
- "WRONG_SIDE" if this shows the back of the hand instead of palm
- "PARTIAL_HAND" if only part of the hand/palm is visible

Do not provide any other explanation, just the exact phrase.`;

      const response = await chatGPT.analyzeImage(imageBase64, prompt);
      return response.trim();
    } catch (error) {
      console.error('Error validating palm image:', error);
      return 'VALIDATION_ERROR';
    }
  };

  // Function to handle user input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle palm image upload with validation
  // Function to handle palm image upload with validation
  const handlePalmImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        
        // Convert image to base64 for GPT analysis
        const imageBase64 = await convertImageToBase64(file);
        
        // Validate if the image is actually a palm using GPT
        const validationResult = await validatePalmImage(imageBase64);
        
        // Handle validation results
        if (validationResult === 'VALID_PALM') {
          // Image is valid, proceed with upload
          try {
            const imageUrl = await uploadPalmImage(file);
            setPalmImageUrl(imageUrl);
            setPalmImage(imageBase64);
            setPalmImageUploaded(true);
            
            const correctHand = userGender === 'male' ? 'right' : 'left';
            
            const palmMessage = {
              role: 'user',
              content: `Palm image uploaded (${correctHand} palm)`,
              image: imageBase64,
              imageUrl: imageUrl,
              timestamp: Date.now(),
            };
            
            const confirmationMessage = {
              role: 'assistant',
              content: `Perfect! I can see your ${correctHand} palm clearly. The lines and mounts are well-defined for accurate analysis. I now have everything I need to generate your comprehensive spiritual wellness report including detailed palmistry insights. Would you like me to create your personalized report now?`,
              timestamp: Date.now(),
            };
            
            setMessages(prev => [...prev, palmMessage, confirmationMessage]);
            setChatComplete(true);
            setShowPalmUpload(false);
            setImageValidationAttempts(0); // Reset attempts on success
            
          } catch (uploadError) {
            console.error('Error uploading to Firebase:', uploadError);
            // Even if Firebase upload fails, we can still use the validated image locally
            setPalmImage(imageBase64);
            setPalmImageUploaded(true);
            
            const palmMessage = {
              role: 'user',
              content: 'Palm image uploaded',
              image: imageBase64,
              timestamp: Date.now(),
            };
            
            const confirmationMessage = {
              role: 'assistant',
              content: 'Perfect! I can see your palm clearly. I now have everything I need to generate your comprehensive spiritual wellness report. Would you like me to create your personalized report now?',
              timestamp: Date.now(),
            };
            
            setMessages(prev => [...prev, palmMessage, confirmationMessage]);
            setChatComplete(true);
            setShowPalmUpload(false);
            setImageValidationAttempts(0);
          }
          
        } else {
          // Image is not valid, show appropriate error message
          setImageValidationAttempts(prev => prev + 1);
          
          let errorMessage = '';
          let suggestion = '';
          
          switch (validationResult) {
            case 'NOT_PALM':
              errorMessage = 'This image doesn\'t appear to show a human hand or palm.';
              suggestion = 'Please upload a clear image of your palm (inside of your hand).';
              break;
            case 'UNCLEAR_PALM':
              errorMessage = 'The palm image is too blurry or unclear for accurate analysis.';
              suggestion = 'Please take a clearer, well-lit photo of your palm with all lines visible.';
              break;
            case 'WRONG_SIDE':
              errorMessage = 'This appears to be the back of your hand rather than your palm.';
              suggestion = 'Please upload an image showing your palm (the inside of your hand with visible lines).';
              break;
            case 'PARTIAL_HAND':
              errorMessage = 'Only part of your hand is visible in this image.';
              suggestion = 'Please upload a complete image of your palm with fingers and thumb visible.';
              break;
            case 'VALIDATION_ERROR':
              errorMessage = 'Unable to analyze the image at the moment.';
              suggestion = 'Please try uploading the image again, or ensure it\'s a clear palm photo.';
              break;
            default:
              errorMessage = 'The uploaded image doesn\'t meet the requirements for palm analysis.';
              suggestion = 'Please upload a clear, well-lit image of your palm.';
          }
          
          const correctHand = userGender === 'male' ? 'RIGHT' : 'LEFT';
          const attemptsText = imageValidationAttempts >= 2 ? 
            '\n\n💡 **Tips for a good palm photo:**\n- Use good lighting (natural light works best)\n- Keep your hand flat and fingers spread\n- Make sure all palm lines are clearly visible\n- Avoid shadows or reflections' : '';
          
          const rejectionMessage = {
            role: 'assistant',
            content: `🤔 ${errorMessage}\n\n${suggestion}\n\nRemember: I need your **${correctHand} palm** for accurate traditional palmistry analysis.${attemptsText}`,
            timestamp: Date.now(),
          };
          
          setMessages(prev => [...prev, rejectionMessage]);
        }
        
      } catch (error) {
        console.error('Error processing palm image:', error);
        const errorMessage = {
          role: 'assistant',
          content: 'I encountered an error while analyzing your image. Please try uploading your palm image again.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        // Clear the file input so user can upload the same file again if needed
        event.target.value = '';
      }
    }
  };

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Check if user wants to view existing report
    if (hasExistingReport && (
      inputValue.toLowerCase().includes('view') || 
      inputValue.toLowerCase().includes('existing') ||
      inputValue.toLowerCase().includes('see')
    )) {
      navigate('/report');
      return;
    }

    // If user wants to retake, reset the existing report flag
    if (hasExistingReport && (
      inputValue.toLowerCase().includes('retake') ||
      inputValue.toLowerCase().includes('new') ||
      inputValue.toLowerCase().includes('fresh')
    )) {
      setHasExistingReport(false);
      const retakeMessage = {
        role: 'assistant',
        content: 'Perfect! Let\'s create a fresh spiritual profile for you. I\'ll ask you some questions to understand your current energy and spiritual state.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, { role: 'user', content: inputValue, timestamp: Date.now() }, retakeMessage]);
      setInputValue('');
      return;
    }

    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Process with GPT service
      const botResponse = await chatGPT.sendChatMessage([
        ...conversation,
        { role: 'user', content: inputValue },
      ]);

      // Update conversation context
      setConversation([
        ...conversation,
        { role: 'user', content: inputValue },
        { role: 'assistant', content: botResponse },
      ]);

      // Add bot message to chat
      const botMessage = {
        role: 'assistant',
        content: botResponse,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Check if bot is asking for palm image
      if (botResponse.toLowerCase().includes('palm') && 
          (botResponse.toLowerCase().includes('upload') || botResponse.toLowerCase().includes('image'))) {
        setShowPalmUpload(true);
        setImageValidationAttempts(0); // Reset validation attempts when starting fresh
      }

      // Check if chat should complete based on message content
      if (
        botResponse.toLowerCase().includes('generate your') &&
        botResponse.toLowerCase().includes('report') &&
        botResponse.toLowerCase().includes('would you like')
      ) {
        setChatComplete(true);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content:
          "I'm having trouble processing that. Let me continue with the next question.",
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const userResponses = messages
        .filter((msg) => msg.role === 'user')
        .map((msg) => msg.content);

      // Generate comprehensive report using GPT
      const reportResponse = await chatGPT.generateComprehensiveReport(userResponses, palmImageUploaded);

      // Parse the report into structured sections
      const sections = parseReportSections(reportResponse);

      const comprehensiveReport = {
        userResponses: userResponses,
        palmImageUploaded: palmImageUploaded,
        palmImage: palmImage,
        palmImageUrl: palmImageUrl,
        userGender: userGender,
        generatedReport: reportResponse,
        sections: sections,
        timestamp: new Date().toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'userResults', currentUser.uid), comprehensiveReport);

      // Also save to localStorage for immediate access
      localStorage.setItem('eternalWellnessReport', JSON.stringify(comprehensiveReport));
      
      setTimeout(() => {
        navigate('/report');
      }, 1500);
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback to mock report
      const mockReport = getMockComprehensiveReport();
      localStorage.setItem('eternalWellnessReport', JSON.stringify(mockReport));
      navigate('/report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Parse GPT response into structured sections
  const parseReportSections = (reportText) => {
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
      // Try multiple variations to find the section
      const variations = [
        title,
        title.toLowerCase(),
        title.replace(/\s+/g, ' ').trim(),
        title.replace(/AND/g, '&')
      ];

      let content = '';
      let score = Math.floor(Math.random() * 30) + 70; // Default score

      for (const variation of variations) {
        const escapedTitle = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const nextTitle = sectionTitles[index + 1];
        const escapedNextTitle = nextTitle ? nextTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;
        
        const pattern = escapedNextTitle 
          ? new RegExp(`${escapedTitle}[:\\s]*([\\s\\S]*?)(?=${escapedNextTitle})`, 'i')
          : new RegExp(`${escapedTitle}[:\\s]*([\\s\\S]*)$`, 'i');
        
        const match = reportText.match(pattern);
        
        if (match && match[1]) {
          content = match[1].trim();
          // Extract score if present
          const scoreMatch = content.match(/(?:score|rating)[:\s]*(\d{1,3})(?:\/100|%)?/i);
          if (scoreMatch) {
            score = parseInt(scoreMatch[1]);
            // Remove score line from content
            content = content.replace(/(?:score|rating)[:\s]*\d{1,3}(?:\/100|%)?/gi, '').trim();
          }
          break;
        }
      }

      // If no content found, use default description
      if (!content) {
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
      'NUMEROLOGY WITH DATE OF BIRTH': 'Based on your birth date numerology, your life path reveals important spiritual insights and karmic patterns that guide your journey through this incarnation.',
      'ETERNAL ARCHETYPE PROFILE': 'Your spiritual archetype represents your soul\'s primary energy signature and the unique role you play in the cosmic tapestry of existence.',
      'VIBRATIONAL FREQUENCY DASHBOARD': 'Your current vibrational frequency reflects your energetic state and alignment with higher consciousness and universal love.',
      'AURA AND CHAKRA HEALTH': 'Your aura and chakra system show the flow of energy through your spiritual centers and overall energetic health and balance.',
      'RELATIONSHIP RESONANCE MAP': 'Your relationship patterns reveal how you connect with others energetically and the soul contracts that shape your interpersonal bonds.',
      'MENTAL EMOTIONAL HEALTH': 'Your mental and emotional patterns show your current state of psychological wellbeing and areas for spiritual growth and healing.',
      'SPIRITUAL ALIGNMENT SCORE': 'Your spiritual alignment indicates how connected you are to your higher purpose, divine guidance, and authentic spiritual path.',
      'PALM READINGS': palmImageUploaded ? 
        'Your palm analysis reveals profound insights about your life path, relationships, health patterns, and spiritual destiny written in the sacred lines of your hands.' : 
        'Palm reading requires an uploaded image of your correct hand (right for males, left for females) to provide detailed palmistry analysis.',
      'HEALTH INSIGHTS': 'Your overall health insights provide holistic guidance for maintaining optimal physical, mental, emotional, and spiritual wellbeing throughout your journey.'
    };
    return defaults[title] || 'Insights and guidance for your spiritual journey and soul evolution.';
  };

  // Mock comprehensive report
  const getMockComprehensiveReport = () => {
    return {
      userResponses: messages.filter(msg => msg.role === 'user').map(msg => msg.content),
      palmImageUploaded: palmImageUploaded,
      palmImage: palmImage,
      palmImageUrl: palmImageUrl,
      userGender: userGender,
      sections: {
        "NUMEROLOGY WITH DATE OF BIRTH": {
          description: "Based on your birth date, your Life Path Number is 7, indicating a spiritual seeker with deep intuitive abilities. Your Destiny Number is 3, suggesting creativity and communication as key life themes. Your Soul Urge Number 9 reveals a compassionate nature with a desire to serve humanity.",
          score: 88
        },
        "ETERNAL ARCHETYPE PROFILE": {
          description: "You embody the Mystic Healer archetype - someone who bridges the spiritual and physical realms. Your natural empathy and intuitive gifts make you a powerful force for healing and transformation in this world.",
          score: 85
        },
        "VIBRATIONAL FREQUENCY DASHBOARD": {
          description: "Your current frequency resonates at 528Hz, the Love frequency, indicating harmony and alignment with natural healing rhythms. Your energy patterns show strong morning vitality with evening contemplation periods.",
          score: 78
        },
        "AURA AND CHAKRA HEALTH": {
          description: "Your aura displays beautiful emerald green with violet crown energy, indicating strong healing abilities and spiritual connection. Minor throat chakra blockages around self-expression need attention through chanting or singing.",
          score: 82
        },
        "RELATIONSHIP RESONANCE MAP": {
          description: "You naturally attract soul-level connections and serve as an energy anchor for others. Boundary work needed with energy vampires who may drain your compassionate nature through unconscious energy exchange.",
          score: 75
        },
        "MENTAL EMOTIONAL HEALTH": {
          description: "Strong emotional intelligence with tendency toward overthinking and absorbing others' emotions. Your empathic nature requires daily grounding practices and energetic protection techniques for optimal mental clarity.",
          score: 73
        },
        "SPIRITUAL ALIGNMENT SCORE": {
          description: "Excellent alignment with higher purpose and spiritual practices. Your connection to divine guidance is strong, with natural ability to channel healing energy and receive intuitive insights during meditation.",
          score: 91
        },
        "PALM READINGS": {
          description: palmImageUploaded ? 
            `Your ${userGender === 'male' ? 'right' : 'left'} palm reveals a strong life line indicating vitality and longevity. Deep heart line shows capacity for profound emotional connections. Your head line indicates analytical thinking balanced with strong intuition. Mount of Apollo shows creative gifts waiting to be fully expressed.` : 
            `Palm analysis requires image upload of your ${userGender === 'male' ? 'right' : 'left'} palm for detailed reading.`,
          score: palmImageUploaded ? 84 : 0
        },
        "HEALTH INSIGHTS": {
          description: "Overall strong constitution with recommendation for stress management and nervous system support. Focus on grounding practices, adequate hydration, and regular movement to maintain optimal energetic balance.",
          score: 79
        }
      },
      timestamp: new Date().toISOString()
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!currentUser) {
    return null;
  }

  const correctHand = userGender === 'male' ? 'RIGHT' : 'LEFT';

return (
  <>
    <style>
      {`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, sans-serif;
          background: #0a0a0b;
          color: #ffffff;
          overflow-x: hidden;
        }

        .chat-container {
          height: 100vh;
          background: #000000;
          position: relative;
          overflow: hidden;
        }

        /* Sidebar Overlay for Mobile */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: none;
        }

        /* Glassmorphism Sidebar */
        .sidebar {
          background: rgba(17, 25, 40, 0.75);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.125);
          border-radius: 0 24px 24px 0;
          height: 100vh;
          overflow-y: auto;
          position: relative;
          z-index: 10;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .sidebar-brand {
          padding: 32px 24px;
          text-align: center;
        }

        .sidebar-brand h4 {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .sidebar-menu {
          padding: 24px 0;
        }

        .sidebar-item {
          padding: 16px 24px;
          margin: 4px 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          text-align: left;
          width: calc(100% - 32px);
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .sidebar-item:hover {
          color: #ffffff;
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          color: #ffffff;
        }

        .upgrade-card {
          margin: 24px 16px;
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .upgrade-card h6 {
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .upgrade-card p {
          font-size: 12px;
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .upgrade-btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-profile {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          background: rgba(17, 25, 40, 0.8);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #ffffff;
          font-size: 16px;
          flex-shrink: 0;
        }

        .main-chat {
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 5;
        }

        .chat-header {
          padding: 24px 32px;
          background: rgba(17, 25, 40, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 20;
          flex-shrink: 0;
        }

        .search-bar {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 12px 20px;
          color: #ffffff;
          width: 320px;
          font-size: 14px;
          outline: none;
        }

        .search-bar::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .header-icons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .header-icon:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: transparent;
          min-height: 0;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .message {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          animation: messageSlide 0.5s ease-out;
          max-width: 100%;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .ai-avatar {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          color: #ffffff;
        }

        .user-avatar-msg {
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          color: #333;
        }

        .message-content {
          max-width: 70%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px) saturate(180%);
          padding: 20px 24px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .message.user .message-content {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .message-text {
          margin: 0;
          line-height: 1.6;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          white-space: pre-wrap;
        }

        .message-image {
          max-width: 100%;
          max-height: 300px;
          height: auto;
          border-radius: 12px;
          margin-top: 10px;
          border: 2px solid rgba(161, 222, 47, 0.3);
        }

        .palm-upload-section {
          padding: 24px 32px;
          background: rgba(17, 25, 40, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          flex-shrink: 0;
        }

        .palm-upload-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px) saturate(180%);
          border: 2px dashed rgba(161, 222, 47, 0.5);
          border-radius: 16px;
          padding: 32px;
          margin: 16px auto;
          max-width: 450px;
          transition: all 0.3s ease;
        }

        .palm-upload-container:hover {
          border-color: rgba(161, 222, 47, 0.8);
          background: rgba(255, 255, 255, 0.15);
        }

        .upload-icon {
          font-size: 48px;
          color: rgba(161, 222, 47, 1);
          margin-bottom: 16px;
        }

        .upload-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .upload-subtext {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .upload-instruction {
          background: rgba(161, 222, 47, 0.1);
          border: 1px solid rgba(161, 222, 47, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          color: rgba(161, 222, 47, 1);
          font-weight: 600;
          font-size: 15px;
        }

        .upload-btn {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(161, 222, 47, 0.4);
        }

        .upload-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .validation-error {
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
          color: rgba(244, 67, 54, 0.9);
          font-size: 14px;
          line-height: 1.5;
        }

        .validation-tips {
          background: rgba(161, 222, 47, 0.1);
          border: 1px solid rgba(161, 222, 47, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
          color: rgba(161, 222, 47, 0.9);
          font-size: 13px;
          line-height: 1.5;
        }

        .chat-input-area {
          padding: 24px 32px 32px;
          background: rgba(17, 25, 40, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .input-container {
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 28px;
          padding: 16px 64px 16px 24px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .input-container:focus-within {
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chat-input {
          background: transparent;
          border: none;
          color: #ffffff;
          flex: 1;
          outline: none;
          resize: none;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.5;
          min-height: 24px;
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .input-actions {
          position: absolute;
          right: 12px;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .input-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .input-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .send-btn {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          color: #ffffff !important;
        }

        .send-btn:hover {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
        }

        .generate-report-container {
          padding: 32px;
          text-align: center;
          background: rgba(17, 25, 40, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .generate-report-button {
          background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
          color: #ffffff;
          border: none;
          padding: 16px 32px;
          border-radius: 28px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 auto;
          max-width: 100%;
        }

        .generate-report-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .today-divider {
          text-align: center;
          margin: 40px 0;
          position: relative;
        }

        .today-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }

        .today-divider span {
          background: rgba(17, 25, 40, 0.8);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
        }

        /* ============ RESPONSIVE BREAKPOINTS ============ */

        /* Large Desktop (1400px+) */
        @media (min-width: 1400px) {
          .sidebar-brand h4 {
            font-size: 26px;
          }
          .chat-messages {
            padding: 40px;
          }
          .message-content {
            max-width: 60%;
          }
        }

        /* Desktop (1200px - 1399px) */
        @media (max-width: 1399px) {
          .search-bar {
            width: 280px;
          }
          .chat-messages {
            padding: 30px;
          }
        }

        /* Large Tablet (992px - 1199px) */
        @media (max-width: 1199px) {
          .search-bar {
            width: 250px;
          }
          .sidebar-brand h4 {
            font-size: 22px;
          }
          .message-content {
            max-width: 75%;
          }
        }

        /* Tablet (768px - 991px) */
        @media (max-width: 991px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: ${sidebarOpen ? '0' : '-320px'};
            width: 320px;
            z-index: 1000;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0 24px 24px 0;
          }

          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'};
          }

          .mobile-menu-btn {
            display: block;
          }

          .search-bar {
            width: 200px;
            font-size: 13px;
            padding: 10px 16px;
          }

          .chat-header {
            padding: 20px 24px;
          }

          .chat-messages {
            padding: 24px 20px;
            gap: 20px;
          }

          .message-content {
            max-width: 80%;
            padding: 16px 20px;
          }

          .chat-input-area {
            padding: 20px 24px 24px;
          }

          .palm-upload-section {
            padding: 20px 24px;
          }

          .palm-upload-container {
            padding: 24px;
            max-width: 400px;
          }

          .generate-report-container {
            padding: 24px;
          }

          .generate-report-button {
            padding: 14px 24px;
            font-size: 15px;
          }

          .header-icons {
            gap: 8px;
          }

          .header-icon {
            width: 36px;
            height: 36px;
          }
        }

        /* Mobile Large (576px - 767px) */
        @media (max-width: 767px) {
          .search-bar {
            width: 160px;
            font-size: 12px;
            padding: 8px 12px;
          }

          .chat-header {
            padding: 16px 20px;
          }

          .chat-messages {
            padding: 20px 16px;
            gap: 16px;
          }

          .message {
            gap: 12px;
          }

          .message-avatar {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .message-content {
            max-width: 85%;
            padding: 14px 16px;
            font-size: 14px;
          }

          .message-text {
            font-size: 14px;
            line-height: 1.5;
          }

          .chat-input-area {
            padding: 16px 20px 20px;
          }

          .input-container {
            padding: 12px 56px 12px 16px;
          }

          .chat-input {
            font-size: 14px;
          }

          .input-btn {
            width: 32px;
            height: 32px;
          }

          .palm-upload-section {
            padding: 16px 20px;
          }

          .palm-upload-container {
            padding: 20px 16px;
            max-width: 350px;
          }

          .upload-icon {
            font-size: 40px;
          }

          .upload-text {
            font-size: 16px;
          }

          .upload-subtext {
            font-size: 13px;
          }

          .upload-instruction {
            padding: 12px;
            font-size: 14px;
          }

          .upload-btn {
            padding: 10px 20px;
            font-size: 13px;
          }

          .generate-report-container {
            padding: 20px 16px;
          }

          .generate-report-button {
            padding: 12px 20px;
            font-size: 14px;
            flex-direction: column;
            gap: 8px;
          }

          .today-divider {
            margin: 24px 0;
          }

          .today-divider span {
            font-size: 11px;
            padding: 6px 12px;
          }

          .sidebar-brand {
            padding: 24px 20px;
          }

          .sidebar-brand h4 {
            font-size: 20px;
          }

          .sidebar-menu {
            padding: 20px 0;
          }

          .sidebar-item {
            padding: 12px 20px;
            margin: 2px 12px;
            font-size: 13px;
          }

          .upgrade-card {
            margin: 20px 12px;
            padding: 20px;
          }

          .upgrade-card h6 {
            font-size: 14px;
          }

          .upgrade-card p {
            font-size: 11px;
          }

          .user-profile {
            padding: 16px 20px;
          }

          .user-avatar {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
        }

        /* Mobile Small (400px - 575px) */
        @media (max-width: 575px) {
          .search-bar {
            width: 120px;
            font-size: 11px;
            padding: 6px 10px;
          }

          .chat-header {
            padding: 12px 16px;
          }

          .chat-messages {
            padding: 16px 12px;
            gap: 14px;
          }

          .message-content {
            max-width: 90%;
            padding: 12px 14px;
          }

          .message-text {
            font-size: 13px;
          }

          .chat-input-area {
            padding: 12px 16px 16px;
          }

          .input-container {
            padding: 10px 48px 10px 14px;
          }

          .chat-input {
            font-size: 13px;
          }

          .input-btn {
            width: 28px;
            height: 28px;
          }

          .palm-upload-section {
            padding: 12px 16px;
          }

          .palm-upload-container {
            padding: 16px 12px;
            max-width: 300px;
          }

          .upload-icon {
            font-size: 36px;
          }

          .upload-text {
            font-size: 15px;
          }

          .upload-subtext {
            font-size: 12px;
          }

          .upload-instruction {
            padding: 10px;
            font-size: 13px;
          }

          .generate-report-container {
            padding: 16px 12px;
          }

          .generate-report-button {
            padding: 10px 16px;
            font-size: 13px;
          }

          .header-icons {
            gap: 6px;
          }

          .header-icon {
            width: 32px;
            height: 32px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }
        }

        /* Mobile Extra Small (320px - 399px) */
        @media (max-width: 399px) {
          .search-bar {
            width: 100px;
            font-size: 10px;
            padding: 5px 8px;
          }

          .chat-header {
            padding: 10px 12px;
          }

          .chat-messages {
            padding: 12px 8px;
            gap: 12px;
          }

          .message-content {
            max-width: 95%;
            padding: 10px 12px;
          }

          .message-text {
            font-size: 12px;
          }

          .chat-input-area {
            padding: 10px 12px 12px;
          }

          .input-container {
            padding: 8px 40px 8px 12px;
          }

          .chat-input {
            font-size: 12px;
          }

          .input-btn {
            width: 24px;
            height: 24px;
          }

          .palm-upload-container {
            padding: 12px 8px;
            max-width: 280px;
          }

          .upload-text {
            font-size: 14px;
          }

          .upload-subtext {
            font-size: 11px;
          }

          .generate-report-button {
            padding: 8px 12px;
            font-size: 12px;
          }

          .sidebar-brand h4 {
            font-size: 18px;
          }

          .header-icon {
            width: 28px;
            height: 28px;
          }
        }

        /* Landscape Mobile Orientation */
        @media (max-height: 500px) and (orientation: landscape) {
          .chat-messages {
            padding: 16px;
          }

          .palm-upload-container {
            padding: 16px;
          }

          .generate-report-container {
            padding: 16px;
          }

          .user-profile {
            position: relative;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .upgrade-card {
            display: none;
          }
        }

        /* High DPI / Retina Displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .message-text {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Accessibility - Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .message {
            animation: none;
          }
          
          .sidebar {
            transition: none;
          }
          
          .input-btn, .upload-btn, .generate-report-button {
            transition: none;
          }
        }

        /* Focus States for Accessibility */
        .chat-input:focus,
        .search-bar:focus {
          box-shadow: 0 0 0px rgba(0, 0, 0, 0.8);
          outline: none;
        }
        .input-btn:focus,
        .upload-btn:focus,
        .generate-report-button:focus {
          outline: 2px solid rgba(161, 222, 47, 0.8);
          outline-offset: 2px;
        }
      `}
    </style>

    <div className="chat-container">
      {/* Sidebar Overlay for Mobile */}
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      
      <div className="row g-0 h-100">
        {/* Enhanced Sidebar */}
        <div className="col-md-3 col-lg-2 sidebar">
          <div className="sidebar-brand">
            <h4>Eternal AI</h4>
          </div>
          
          <div className="sidebar-menu">
            <button className="sidebar-item active">
              <i className="bi bi-chat-dots"></i>
              Chat UI
            </button>
            <button className="sidebar-item">
              <i className="bi bi-clock-history"></i>
              My History
            </button>
            <button className="sidebar-item">
              <i className="bi bi-gear"></i>
              Settings
            </button>
          </div>

          <div className="upgrade-card">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <span style={{ fontSize: '24px' }}>✨</span>
            </div>
            <h6>Upgrade to Pro</h6>
            <p>Unlock powerful features with our pro upgrade today!</p>
            <button className="upgrade-btn">
              Upgrade now →
            </button>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                {currentUser?.displayName || currentUser?.email || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Pro Member
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Chat Area */}
        <div className="col-md-9 col-lg-10 main-chat" ref={chatContainerRef}>
          {/* Enhanced Header */}
          <div className="chat-header">
            <div className="d-flex align-items-center gap-3">
              <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
              </button>
              <input type="text" className="search-bar" placeholder="🔍 Search conversations..." />
            </div>
            
            <div className="header-icons">
              <div className="header-icon">
                <i className="bi bi-bell"></i>
              </div>
              <div className="header-icon">
                <i className="bi bi-moon"></i>
              </div>
              <div className="header-icon">
                <i className="bi bi-question-circle"></i>
              </div>
              <div className="user-avatar">
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>

          {/* Enhanced Chat Messages */}
          <div className="chat-messages">
            <div className="today-divider">
              <span>Today</span>
            </div>
            
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'user' : ''}`}>
                <div className={`message-avatar ${msg.role === 'user' ? 'user-avatar-msg' : 'ai-avatar'}`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <p className="message-text">{msg.content}</p>
                  {msg.image && (
                    <img src={msg.image} alt="Palm" className="message-image" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Palm Upload Section */}
          {showPalmUpload && !palmImageUploaded && (
            <div className="palm-upload-section">
              <div className="palm-upload-container">
                <div className="upload-icon">🖐️</div>
                <div className="upload-text">Upload Your {correctHand} Palm</div>
                <div className="upload-subtext">
                  For accurate palm reading analysis, please upload a clear, well-lit image of your palm
                </div>
                <div className="upload-instruction">
                  📋 {userGender === 'male' ? 'MALES: Upload RIGHT palm' : 'FEMALES: Upload LEFT palm'}
                  <br />
                  {userGender ? '' : 'Please specify your gender first for correct palm selection'}
                </div>
                
                {imageValidationAttempts >= 2 && (
                  <div className="validation-tips">
                    <strong>💡 Tips for a perfect palm photo:</strong><br />
                    • Use natural lighting or bright room light<br />
                    • Keep your hand flat with fingers spread apart<br />
                    • Ensure all palm lines are clearly visible<br />
                    • Avoid shadows, reflections, or blurry images<br />
                    • Show your complete palm from wrist to fingertips
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePalmImageUpload}
                  style={{ display: 'none' }}
                  id="palm-upload"
                  disabled={loading}
                />
                <label htmlFor="palm-upload" className="upload-btn">
                  {loading ? (
                    <>
                      <span className="loader" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                      Analyzing Image...
                    </>
                  ) : (
                    `Choose ${correctHand} Palm Image`
                  )}
                </label>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.6)', 
                  marginTop: '12px',
                  fontStyle: 'italic'
                }}>
                  Our AI will verify that your image shows a clear palm before proceeding
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Chat Input */}
          {!chatComplete && !showPalmUpload && (
            <form onSubmit={handleSendMessage} className="chat-input-area">
              <div className="input-container">
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  rows="1"
                  className="chat-input"
                />
                <div className="input-actions">
                  <button type="button" className="input-btn">
                    <i className="bi bi-paperclip"></i>
                  </button>
                  <button type="button" className="input-btn">
                    <i className="bi bi-mic"></i>
                  </button>
                  <button type="submit" className="input-btn send-btn" disabled={loading}>
                    {loading ? <span className="loader"></span> : <i className="bi bi-send"></i>}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Generate Report Button */}
          {chatComplete && (
            <div className="generate-report-container">
              <button
                className="generate-report-button"
                onClick={generateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <span className="loader"></span>
                    Generating Your Complete Report...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-text"></i>
                    Generate My Complete Spiritual Wellness Report
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);
};

export default Chatbot;