// src/services/comprehensiveReportGPT.js
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_GPT_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

/**
 * Generate comprehensive spiritual report including all sections
 * @param {Object} reportData - All user data including answers, palm image, etc.
 * @returns {Object} - Comprehensive report with all sections
 */
export const generateComprehensiveReport = async (reportData) => {
  try {
    console.log("Starting comprehensive report generation");
    
    // If no API key is configured, return mock response
    if (!API_KEY) {
      console.log("No API key found, using mock comprehensive report");
      return getMockComprehensiveReport(reportData);
    }

    const prompt = createComprehensivePrompt(reportData);
    
    console.log("Sending comprehensive report request to GPT API");
    
    // For palm reading, we need to use vision model
    const messages = [
      {
        role: "system",
        content: "You are Eternal AI, an advanced spiritual guide combining ancient wisdom with modern insights. You are expert in numerology, aura reading, chakra analysis, palmistry, relationship dynamics, mental health, and spiritual alignment. Create comprehensive, personalized spiritual reports that are insightful, compassionate, and actionable."
      },
      {
        role: "user",
        content: reportData.palmImageURL ? [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: reportData.palmImageURL,
              detail: "high"
            }
          }
        ] : prompt
      }
    ];

    const response = await axios.post(
      API_ENDPOINT,
      {
        model: reportData.palmImageURL ? "gpt-4-vision-preview" : "gpt-4",
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    console.log("GPT API response received for comprehensive report");
    
    const result = response.data.choices[0].message.content;
    return processComprehensiveResponse(result, reportData);
    
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    console.log("Falling back to mock comprehensive report due to error");
    return getMockComprehensiveReport(reportData);
  }
};

/**
 * Create comprehensive prompt including all sections
 */
const createComprehensivePrompt = (reportData) => {
  const { userAnswers, userGender, palmImageURL } = reportData;
  
  let prompt = `Generate a comprehensive spiritual wellness report based on the following information:

USER RESPONSES:
`;

  // Add all user answers to prompt
  Object.entries(userAnswers).forEach(([key, value]) => {
    prompt += `${key}: ${value}\n`;
  });

  prompt += `\nGENDER: ${userGender}
${palmImageURL ? 'PALM IMAGE: Included for analysis\n' : ''}

Please create a detailed report with exactly these 8 sections:

1. NUMEROLOGY PROFILE
Based on the birth date provided, calculate their life path number and provide detailed numerological insights about their spiritual purpose, personality traits, and life direction.

2. ETERNAL ARCHETYPE PROFILE  
Determine their spiritual archetype (e.g., Seeker, Healer, Warrior, Sage, Creator, etc.) based on their responses and provide insights into their soul mission and spiritual gifts.

3. VIBRATIONAL FREQUENCY DASHBOARD
Analyze their current energetic state based on their energy levels, emotional state, and spiritual practices. Provide their current frequency reading and recommendations for elevation.

4. AURA & CHAKRA HEALTH
Based on their responses about energy, emotions, and spiritual state, analyze their aura colors and chakra alignment. Identify any blockages and provide healing guidance.

5. RELATIONSHIP RESONANCE MAP
Analyze their relationship satisfaction and interpersonal dynamics. Provide insights into their relationship patterns, compatibility factors, and guidance for healthier connections.

6. MENTAL-EMOTIONAL HEALTH
Assess their mental and emotional wellbeing based on stress levels, emotional state, and life satisfaction. Provide holistic wellness recommendations.

7. SPIRITUAL ALIGNMENT SCORE
Evaluate how aligned they are with their spiritual path based on their intuition usage, life purpose connection, and spiritual practices. Provide alignment enhancement guidance.

8. PALM READING ANALYSIS
${palmImageURL ? 
  `Analyze the palm image provided. Focus on: Life line (health/vitality), Heart line (love/emotions), Head line (intellect/decisions), Fate line (career/destiny), Mounts (personality traits), and Finger lengths (character aspects). Provide detailed palmistry insights.` :
  `Based on their gender and responses, provide general palm reading insights for their dominant hand (${userGender === 'male' ? 'left' : 'right'} palm), focusing on general patterns that align with their personality and spiritual journey.`
}

For each section, provide:
- Detailed analysis (2-3 paragraphs)
- A numerical score (1-100)  
- Specific recommendations
- Spiritual insights

Format your response with clear section headers and maintain an encouraging, insightful tone throughout.`;

  return prompt;
};

/**
 * Process the comprehensive response into structured sections
 */
const processComprehensiveResponse = (response, reportData) => {
  try {
    const sections = {
      numerologyProfile: extractSection(response, "NUMEROLOGY PROFILE", "ETERNAL ARCHETYPE"),
      archetypeProfile: extractSection(response, "ETERNAL ARCHETYPE", "VIBRATIONAL FREQUENCY"),
      vibrationalFrequency: extractSection(response, "VIBRATIONAL FREQUENCY", "AURA & CHAKRA"),
      auraChakraHealth: extractSection(response, "AURA & CHAKRA", "RELATIONSHIP RESONANCE"),
      relationshipResonance: extractSection(response, "RELATIONSHIP RESONANCE", "MENTAL-EMOTIONAL"),
      mentalEmotionalHealth: extractSection(response, "MENTAL-EMOTIONAL", "SPIRITUAL ALIGNMENT"),
      spiritualAlignment: extractSection(response, "SPIRITUAL ALIGNMENT", "PALM READING"),
      palmReading: extractSection(response, "PALM READING", null),
      healthAssessment: "Based on your responses, your overall health patterns show good awareness of wellness factors with opportunities for optimization through stress management and energy balancing practices.",
      fullReport: response,
      overallScore: calculateOverallScore(response),
      generatedAt: new Date().toISOString(),
      userGender: reportData.userGender,
      palmImageURL: reportData.palmImageURL
    };

    return sections;
  } catch (error) {
    console.error("Error processing comprehensive response:", error);
    return {
      fullReport: response,
      overallScore: 78,
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Extract section from response
 */
const extractSection = (text, startMarker, endMarker) => {
  try {
    const startRegex = new RegExp(`${startMarker}[:\\s]*`, 'i');
    const startMatch = text.match(startRegex);
    
    if (!startMatch) return null;
    
    const startIndex = startMatch.index + startMatch[0].length;
    let endIndex;
    
    if (endMarker) {
      const endRegex = new RegExp(`${endMarker}[:\\s]*`, 'i');
      const endMatch = text.substring(startIndex).match(endRegex);
      endIndex = endMatch ? startIndex + endMatch.index : text.length;
    } else {
      endIndex = text.length;
    }
    
    return text.substring(startIndex, endIndex).trim();
  } catch (error) {
    console.error('Error extracting section:', error);
    return null;
  }
};

/**
 * Calculate overall score from response
 */
const calculateOverallScore = (response) => {
  try {
    // Extract any numerical scores mentioned in the response
    const scoreMatches = response.match(/\b\d{1,2}\/100\b|\b\d{1,2}%\b|\bscore[:\s]*\d{1,2}\b/gi);
    
    if (scoreMatches && scoreMatches.length > 0) {
      const scores = scoreMatches.map(match => {
        const num = match.match(/\d{1,2}/)[0];
        return parseInt(num);
      });
      
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
    
    return 78; // Default score
  } catch (error) {
    return 78;
  }
};

/**
 * Mock comprehensive report for fallback
 */
const getMockComprehensiveReport = (reportData) => {
  const handType = reportData.userGender === 'male' ? 'left' : 'right';
  
  return {
    numerologyProfile: "Based on your birth date, your Life Path Number reveals a soul mission focused on creativity and communication. You have natural leadership abilities with a strong desire to inspire and uplift others through your unique gifts.",
    
    archetypeProfile: "You embody the Seeker archetype - someone with an insatiable curiosity about life's deeper mysteries. Your soul's purpose involves gathering wisdom and sharing transformative insights with others on their spiritual journeys.",
    
    vibrationalFrequency: "Your current vibrational frequency reads at 6.8Hz, indicating moderate spiritual clarity with excellent potential for elevation. Your energy peaks during morning hours and benefits from creative expression and meaningful connections.",
    
    auraChakraHealth: "Your aura displays a beautiful emerald green base with gold accents, indicating a natural healer with strong heart chakra energy. Minor blockages in the solar plexus suggest a need for confidence building and personal power reclamation.",
    
    relationshipResonance: "Your relationship patterns show a deep capacity for meaningful connections with some tendency toward giving more than receiving. You attract spiritually-minded individuals and thrive in relationships that honor your sensitive, intuitive nature.",
    
    mentalEmotionalHealth: "Your mental-emotional landscape reveals resilience and emotional intelligence with occasional anxiety around future planning. You benefit from grounding practices and present-moment awareness techniques.",
    
    spiritualAlignment: "You show strong alignment with your spiritual path, scoring 82/100. Your natural intuition is well-developed, and you're ready for deeper spiritual practices. Trust your inner guidance more fully.",
    
    palmReading: `Your ${handType} palm reveals a strong life line indicating vitality and longevity. The heart line shows deep emotional capacity and potential for lasting love. Your head line suggests balanced thinking with creative problem-solving abilities. The fate line indicates a career path aligned with your spiritual purpose.`,
    
    healthAssessment: "Your health patterns show good overall awareness with opportunities for improvement in stress management and sleep consistency. Your body responds well to holistic approaches and energy-based healing modalities.",
    
    fullReport: "Comprehensive spiritual analysis revealing a soul on an awakening journey with strong potential for both personal growth and service to others.",
    
    overallScore: 78,
    generatedAt: new Date().toISOString(),
    userGender: reportData.userGender,
    palmImageURL: reportData.palmImageURL
  };
};

export default {
  generateComprehensiveReport
};