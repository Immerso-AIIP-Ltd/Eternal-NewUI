// src/services/chatGPT.js
import axios from 'axios';

// API settings (in production, store these in environment variables)
const API_ENDPOINT = process.env.REACT_APP_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
const MODEL = 'gpt-3.5-turbo'; // You can upgrade to GPT-4 for better results if available

/**
 * Sends a message to the GPT API and gets a response
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<String>} - GPT's response text
 */
export const sendChatMessage = async (messages) => {
  try {
    // Check if API key is configured
    if (!API_KEY) {
      console.log('No API key found. Using mock response.');
      return getMockResponse(messages);
    }

    // Make API request
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    // Return the response content
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling GPT API:', error);
    // Return mock response as fallback
    return getMockResponse(messages);
  }
};

/**
 * Generates a comprehensive wellness report using GPT with the new 9-section structure
 * @param {Array} userResponses - Array of user responses from the conversation
 * @param {Boolean} palmImageUploaded - Whether palm image was uploaded
 * @returns {Promise<String>} - Generated report text
 */
export const generateComprehensiveReport = async (userResponses, palmImageUploaded = false) => {
  const reportPrompt = `You are an expert spiritual advisor and wellness coach. Based on the following user responses from a comprehensive spiritual assessment, generate a detailed report with exactly these 9 sections. Each section should be 2-3 well-structured sentences with specific insights and include a score from 60-100.

User responses: ${userResponses.join(' | ')}
Palm image provided: ${palmImageUploaded ? 'Yes' : 'No'}

Generate a detailed analysis for each section in this EXACT format:

NUMEROLOGY WITH DATE OF BIRTH
[Provide detailed numerological analysis including Life Path Number, Expression Number, and Soul Urge Number with specific meanings and calculations based on any dates mentioned in responses]
Score: [X]/100

ETERNAL ARCHETYPE PROFILE  
[Determine their spiritual personality type such as Healer, Mystic, Teacher, Guardian, Seeker, etc. with detailed characteristics and spiritual gifts based on their responses]
Score: [X]/100

VIBRATIONAL FREQUENCY DASHBOARD
[Assess their current energetic frequency, mention specific Hz if possible (like 528Hz, 432Hz), and describe their vibrational state and energy patterns]
Score: [X]/100

AURA AND CHAKRA HEALTH
[Analyze specific aura colors (blue, green, violet, etc.) and detailed chakra balance/blockages, mentioning specific chakras and their conditions]
Score: [X]/100

RELATIONSHIP RESONANCE MAP
[Evaluate how they connect with others energetically, relationship patterns, and energy exchange dynamics based on their responses about relationships]
Score: [X]/100

MENTAL EMOTIONAL HEALTH
[Assess emotional patterns, mental clarity, psychological wellbeing, and empathic abilities based on their stress, mood, and emotional responses]
Score: [X]/100

SPIRITUAL ALIGNMENT SCORE
[Measure connection to higher self, spiritual practices effectiveness, and life purpose alignment based on their spiritual practices and beliefs]
Score: [X]/100

PALM READINGS
${palmImageUploaded ? 
  '[Provide detailed palm reading analysis including life line (health/vitality), heart line (emotions/relationships), head line (intellect/communication), fate line (career/destiny), and mounts analysis (personality traits). Mention specific characteristics and their meanings for the uploaded palm]' : 
  '[Explain that detailed palm reading requires uploaded palm image and describe what insights would be provided with proper image - life line, heart line, head line, fate line, and mounts analysis. Mention the importance of using correct hand (left for males, right for females)]'}
Score: [X]/100

HEALTH INSIGHTS
[Provide holistic wellness recommendations based on their responses, including physical, mental, emotional, and spiritual health guidance]
Score: [X]/100

Be specific, personalized, and spiritually insightful while remaining practical and grounded. Use the user's actual responses to create personalized insights for each section.`;

  try {
    // Check if API key is configured
    if (!API_KEY) {
      console.log('No API key found for report generation. Using mock report.');
      return getMockComprehensiveReportText(palmImageUploaded);
    }

    // Make API request
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are an expert spiritual advisor generating comprehensive wellness reports with specific insights and scores. Follow the exact format requested with clear section breaks.' },
          { role: 'user', content: reportPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000, // Increased for comprehensive report
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    return getMockComprehensiveReportText(palmImageUploaded);
  }
};

/**
 * Legacy function for compatibility - generates old format wellness report
 * @param {Array} conversation - Full conversation history
 * @returns {Promise<Object>} - Structured report with sections
 */
export const generateWellnessReport = async (conversation) => {
  try {
    // Extract user responses from conversation
    const userResponses = conversation
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
    
    // Generate new format report
    const reportText = await generateComprehensiveReport(userResponses, false);
    
    // Process into old format for compatibility
    return processReportText(reportText);
  } catch (error) {
    console.error('Error generating legacy wellness report:', error);
    return processReportText(getMockReport());
  }
};

/**
 * Provides a mock response for chat messages when no API key is available
 * @param {Array} messages - Array of message objects
 * @returns {String} - Mock response text
 */
const getMockResponse = (messages) => {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  
  // Check for gender-related responses to provide appropriate palm instructions
  const userMessages = messages.filter(msg => msg.role === 'user').map(msg => msg.content.toLowerCase());
  let userGender = null;
  for (const message of userMessages) {
    if (message.includes('male') && !message.includes('female')) {
      userGender = 'male';
      break;
    } else if (message.includes('female')) {
      userGender = 'female';
      break;
    }
  }
  
  // If empty greeting or intro question
  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
    return "Hello! I'm your spiritual guide from Eternal. I'm here to help discover your cognitive identity and unveil your spiritual aura. Could you start by telling me your name and gender?";
  }
  
  // Questions based on last message content
  if (lastMessage.includes('name') && !lastMessage.includes('born')) {
    return "Nice to meet you! When were you born? Please share your birth date so I can understand your numerological influences better.";
  }
  
  if (lastMessage.includes('born') || lastMessage.includes('birthday') || lastMessage.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
    return "Thank you for sharing your birth date. Do you happen to know your birth time? It helps with more precise astrological and spiritual insights.";
  }
  
  if (lastMessage.includes('time') || lastMessage.includes('am') || lastMessage.includes('pm')) {
    return "That's helpful for our reading. How would you describe your sleep patterns? Do you sleep deeply, have trouble falling asleep, or wake up frequently?";
  }
  
  if (lastMessage.includes('sleep')) {
    return "Sleep patterns reveal a lot about our energy flow. What about your diet - do you follow any particular dietary preference (vegetarian, vegan, omnivore, etc.)?";
  }
  
  if (lastMessage.includes('diet') || lastMessage.includes('food') || lastMessage.includes('eat')) {
    return "Your nutritional choices directly impact your energy field. How frequently do you experience stress or anxiety in your daily life?";
  }
  
  if (lastMessage.includes('stress') || lastMessage.includes('anxiety')) {
    return "Thank you for sharing. Managing stress is key to maintaining a clear aura. How would you describe your usual mood and emotional patterns?";
  }
  
  if (lastMessage.includes('mood') || lastMessage.includes('emotional')) {
    return "Your emotional awareness shows spiritual maturity. On a scale of 1-10, how connected do you feel to your spiritual self?";
  }
  
  if (lastMessage.includes('spiritual') || lastMessage.match(/\d+/)) {
    return "I sense you're on a meaningful spiritual journey. Do you have relationships in your life that feel particularly uplifting? And are there any that feel energetically draining?";
  }
  
  if (lastMessage.includes('relationship')) {
    return "Relationships form important energy connections in our lives. Do you practice any form of meditation, breathwork, or other spiritual practices?";
  }
  
  if (lastMessage.includes('meditation') || lastMessage.includes('practice')) {
    return "Thank you for sharing your spiritual practices. How would you describe your overall health and energy levels?";
  }
  
  if (lastMessage.includes('health') || lastMessage.includes('energy')) {
    const palmHand = userGender === 'male' ? 'LEFT' : userGender === 'female' ? 'RIGHT' : 'correct';
    return `Thank you for sharing all this information! To complete your spiritual profile, I need to analyze your palm. For accurate palm reading, please upload a clear image of your ${palmHand} palm ${userGender ? (userGender === 'male' ? '(left for males)' : '(right for females)') : '(left for males, right for females)'}. This ancient practice follows traditional palmistry guidelines for the most accurate reading.`;
  }
  
  // Check if asking for palm reading
  if (lastMessage.includes('palm') || lastMessage.includes('hand')) {
    const palmHand = userGender === 'male' ? 'LEFT' : userGender === 'female' ? 'RIGHT' : 'correct';
    return `To complete your spiritual profile, I'd like to analyze your palm. Please upload a clear image of your ${palmHand} palm for a detailed palm reading. This will add valuable insights about your life path, relationships, and destiny to your report.`;
  }
  
  // Check if ready for report generation
  if (lastMessage.includes('report') || lastMessage.includes('generate') || lastMessage.includes('ready')) {
    return "Thank you for sharing all this information! I now have everything I need to generate your comprehensive spiritual wellness report. Would you like me to create your personalized report now?";
  }
  
  // Default response for other messages
  return "I understand. Your energy patterns are starting to become clearer to me. Let's continue - can you tell me more about your daily spiritual practices or what brings you peace?";
};

/**
 * Provides a mock comprehensive report text when no API key is available
 * @param {Boolean} palmImageUploaded - Whether palm image was uploaded
 * @returns {String} - Mock report text
 */
const getMockComprehensiveReportText = (palmImageUploaded) => {
  return `NUMEROLOGY WITH DATE OF BIRTH
Based on your birth date analysis, your Life Path Number is 7, indicating you are a natural spiritual seeker with deep intuitive abilities and a connection to mystical realms. Your Expression Number 3 reveals strong creative and communication gifts that should be utilized in your spiritual work. Your Soul Urge Number 9 shows a humanitarian spirit with a desire to heal and serve others on a soul level.
Score: 88/100

ETERNAL ARCHETYPE PROFILE
You embody the Mystic Healer archetype - a rare combination of spiritual wisdom and healing abilities. This archetype represents someone who bridges the physical and spiritual worlds, often serving as a guide for others' spiritual awakening. Your energy signature shows strong empathic abilities and natural channeling gifts that allow you to access higher dimensional guidance.
Score: 85/100

VIBRATIONAL FREQUENCY DASHBOARD
Your current vibrational frequency resonates at approximately 528Hz, known as the "Love Frequency" or "Miracle Tone." This indicates you are in a state of heart-centered alignment with strong healing capabilities. Your energy patterns show optimal morning vitality between 6-9 AM with natural contemplative periods in the evening that support spiritual growth and integration.
Score: 78/100

AURA AND CHAKRA HEALTH
Your aura displays a beautiful emerald green base color indicating powerful heart chakra activation and healing abilities, with violet crown chakra energy showing strong spiritual connection. Minor blockages appear in the throat chakra around self-expression and speaking your truth. Your solar plexus shows balanced personal power with room for increased confidence in your spiritual gifts.
Score: 82/100

RELATIONSHIP RESONANCE MAP
You naturally attract soul-level connections and often serve as an energetic anchor and healer in relationships. Your empathic nature creates deep bonds but requires conscious boundary setting to prevent energy depletion. You have strong compatibility with earth and water sign energies and benefit from relationships that support your spiritual growth and healing work.
Score: 75/100

MENTAL EMOTIONAL HEALTH
You possess highly developed emotional intelligence and intuitive sensitivity that serves your spiritual path well. Tendency toward overthinking and absorbing others' emotional states requires daily energetic clearing practices. Your mental clarity peaks during morning meditation and benefits from regular grounding activities in nature.
Score: 73/100

SPIRITUAL ALIGNMENT SCORE
Excellent alignment with your spiritual purpose and higher self connection. Your dedication to spiritual practices shows consistent growth and evolution. Strong ability to receive divine guidance through meditation, dreams, and intuitive insights. Continue developing your natural psychic abilities through regular practice and trust in your inner wisdom.
Score: 91/100

PALM READINGS
${palmImageUploaded ? 
  `Your palm reveals a strong, clear life line indicating excellent vitality and longevity extending well into your 80s. The deep heart line shows your capacity for profound emotional connections and healing love. Your head line demonstrates perfect balance between analytical thinking and intuitive wisdom. The Mount of Apollo is well-developed, indicating creative gifts and spiritual leadership abilities that are ready to be fully expressed in the world.
Score: 84/100` :
  `Palm reading analysis requires an uploaded palm image to provide detailed insights. Your palm lines would reveal information about your life path, health patterns, relationship tendencies, and creative potential. Please upload a clear photo of your correct hand (left for males, right for females) to unlock this powerful aspect of your spiritual analysis.
Score: 0/100`}

HEALTH INSIGHTS
Your overall constitution shows strong spiritual sensitivity that requires conscious energy management and protection practices. Focus on grounding techniques, adequate hydration, and regular movement to maintain optimal energetic balance. Consider incorporating adaptogenic herbs, crystal healing, and sound therapy to support your highly sensitive nervous system and enhance your natural healing abilities.
Score: 79/100`;
};

/**
 * Processes the report text into structured sections (legacy compatibility)
 * @param {String} reportText - Raw report text
 * @returns {Object} - Structured report
 */
const processReportText = (reportText) => {
  try {
    // Extract sections for legacy format
    const sections = {
      auraColors: extractSection(reportText, "AURA AND CHAKRA HEALTH", "RELATIONSHIP") ||
                  extractSection(reportText, "Aura Colors", "Personality") ||
                  "Your aura shows beautiful emerald green with violet overtones, indicating healing abilities and spiritual connection.",
      personality: extractSection(reportText, "ETERNAL ARCHETYPE PROFILE", "VIBRATIONAL") ||
                  extractSection(reportText, "Personality", "Spiritual Profile") ||
                  "You demonstrate a thoughtful and introspective personality with strong spiritual inclinations.",
      spiritualProfile: extractSection(reportText, "SPIRITUAL ALIGNMENT SCORE", "PALM") ||
                       extractSection(reportText, "Spiritual Profile", "Energy Boosters") ||
                       "Your spiritual profile shows excellent alignment with higher purpose and natural healing abilities.",
      energyBoosters: extractSection(reportText, "VIBRATIONAL FREQUENCY DASHBOARD", "AURA") ||
                     extractSection(reportText, "Energy Boosters", "Energy Drains") ||
                     "Nature connection, meditation, creative expression, meaningful relationships, and spiritual practices boost your energy.",
      energyDrains: extractSection(reportText, "MENTAL EMOTIONAL HEALTH", "SPIRITUAL") ||
                   extractSection(reportText, "Energy Drains", "Alignment") ||
                   "Negative environments, energy vampires, overthinking, and lack of boundaries drain your sensitive energy.",
      alignment: extractSection(reportText, "HEALTH INSIGHTS", null) ||
                extractSection(reportText, "Alignment", "Daily Practice") ||
                "Maintain alignment through daily spiritual practices, energy protection, and conscious boundary setting.",
      dailyPractice: "Begin each day with meditation and end with gratitude journaling. Practice energy clearing and protection visualizations regularly."
    };
    
    // If any sections are missing, return the full text
    if (Object.values(sections).some(section => !section)) {
      return {
        fullReading: reportText
      };
    }
    
    return sections;
  } catch (error) {
    console.error('Error processing report text:', error);
    return {
      fullReading: reportText
    };
  }
};

/**
 * Extracts a section from text between markers (legacy compatibility)
 * @param {String} text - Full text
 * @param {String} startMarker - Section start marker
 * @param {String} endMarker - Section end marker or null for end of text
 * @returns {String} - Extracted section or null if not found
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
 * Provides a mock wellness report when no API key is available (legacy compatibility)
 * @returns {String} - Mock report text
 */
const getMockReport = () => {
  return `
AURA COLORS:
Your dominant aura colors are indigo blue and emerald green. The indigo blue represents your heightened intuition and deep inner wisdom. You have a natural ability to connect with your higher self and perceive truths beyond what is immediately visible. The emerald green indicates a strong heart center and healing energy. You naturally provide balance and harmony to environments and people around you.

PERSONALITY:
You demonstrate a thoughtful and introspective personality. Your responses show someone who values quality rest and physical wellbeing, suggesting you understand the importance of self-care. You have a rich inner life with vivid mental imagery and sensitivity to sensory experiences, particularly sound and music. Your approach to social interaction is balanced – you appreciate connection but also recognize the importance of personal space and energy management.

SPIRITUAL PROFILE:
Your spiritual strengths lie in your intuition and ability to process experiences through multiple channels – both visual and auditory. You're naturally introspective, which provides you with deep insights about yourself and others. Your main spiritual challenge involves finding consistency in your practices and creating routines that support your spiritual growth without feeling restrictive. There's also a tendency to absorb others' energies, which can sometimes cloud your connection to your own spiritual truth.

ENERGY BOOSTERS:
1. Spending time in nature - particularly environments with water or lush greenery
2. Creative expression through visual arts or music
3. Meaningful one-on-one conversations with trusted friends
4. Regular physical movement that connects you to your body
5. Moments of solitude for reflection and processing experiences

ENERGY DRAINS:
1. Crowded, noisy environments with chaotic energy
2. Irregular sleep patterns that disrupt your natural rhythm
3. Extended periods of screen time or digital consumption
4. Interactions with people who frequently complain or focus on negativity
5. Rushing through activities without allowing time for mental and emotional processing

ALIGNMENT:
To stay aligned with your true essence, establish a consistent morning and evening routine that honors your energy patterns. Create boundaries around your time and energy, particularly with people who tend to drain you. Make deliberate choices about the environments you spend time in, prioritizing spaces that feel harmonious and peaceful. Schedule regular time for both creative expression and quiet reflection. Listen to your body's signals about hunger, rest, and movement, and respond with compassionate attention. Finally, connect with others who share your values and spiritual interests, but maintain your unique path rather than conforming to others' expectations.

DAILY PRACTICE:
Begin each day with a 5-minute visualization practice. Sit comfortably with your eyes closed and imagine your body surrounded by a protective bubble of indigo blue and emerald green light. Breathe deeply into this space, allowing the colors to become more vibrant with each breath. Set an intention for how you wish to engage with the world that day. Throughout the day, take brief moments (even 30 seconds) to reconnect with this colored energy field, particularly before entering new environments or beginning new tasks. In the evening, spend a few minutes journaling about moments when you felt most connected and energized, as well as moments when you felt drained or disconnected. Over time, this practice will strengthen your awareness of your energy patterns and help you make choices that support your authentic spiritual alignment.
  `;
};

export default {
  sendChatMessage,
  generateWellnessReport,
  generateComprehensiveReport
};