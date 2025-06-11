// src/services/chatGPT.js
import axios from 'axios';

// API settings (in production, store these in environment variables)
const API_ENDPOINT = process.env.REACT_APP_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const MODEL = 'gpt-3.5-turbo'; // You can upgrade to GPT-4 for better results if available
const VISION_MODEL = 'gpt-4o'; // Model for image analysis

/**
 * Generates a unique seed for each user to ensure varied results
 * @param {Array} userResponses - User's responses
 * @returns {String} - Unique user seed
 */
const generateUserSeed = (userResponses) => {
  const responseText = userResponses.join('').toLowerCase();
  const timestamp = Date.now();
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const textLength = responseText.length;
  const vowelCount = (responseText.match(/[aeiou]/g) || []).length;
  const consonantCount = textLength - vowelCount;
  
  return `${timestamp % 1000}${dayOfYear}${textLength % 100}${vowelCount % 50}${consonantCount % 50}`;
};

/**
 * Generates dynamic score based on user characteristics
 * @param {String} section - Section name
 * @param {String} userSeed - User's unique seed
 * @param {Array} userResponses - User responses
 * @returns {Number} - Dynamic score between 35-95
 */
const generateDynamicScore = (section, userSeed, userResponses) => {
  const seedNum = parseInt(userSeed.slice(-3));
  const responseText = userResponses.join(' ').toLowerCase();
  
  // Base score calculations for different sections
  const baseScores = {
    'NUMEROLOGY': 35 + (seedNum % 60),
    'ARCHETYPE': 45 + ((seedNum * 7) % 50),
    'VIBRATIONAL': 38 + ((seedNum * 11) % 55),
    'AURA': 42 + ((seedNum * 13) % 53),
    'RELATIONSHIP': 50 + ((seedNum * 17) % 40),
    'MENTAL': 55 + ((seedNum * 19) % 40),
    'SPIRITUAL': 40 + ((seedNum * 23) % 55),
    'PALM': 45 + ((seedNum * 29) % 45),
    'HEALTH': 48 + ((seedNum * 31) % 47)
  };
  
  // Adjust based on response content
  let adjustment = 0;
  if (responseText.includes('meditat') || responseText.includes('spiritual')) adjustment += 10;
  if (responseText.includes('stress') || responseText.includes('anxiety')) adjustment -= 5;
  if (responseText.includes('happy') || responseText.includes('peaceful')) adjustment += 8;
  if (responseText.includes('exercise') || responseText.includes('active')) adjustment += 6;
  if (responseText.includes('sleep') && responseText.includes('well')) adjustment += 5;
  
  const sectionKey = section.split(' ')[0];
  const baseScore = baseScores[sectionKey] || 60;
  const finalScore = Math.min(95, Math.max(35, baseScore + adjustment));
  
  return finalScore;
};

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
 * Analyzes an uploaded image to verify if it's a valid palm image
 * @param {String} imageBase64 - Base64 encoded image string
 * @param {String} prompt - Analysis prompt for the image
 * @returns {Promise<String>} - Validation result
 */
export const analyzeImage = async (imageBase64, prompt) => {
  try {
    // Check if API key is configured
    if (!API_KEY) {
      console.log('No API key found for image analysis. Using mock validation.');
      return getMockImageValidation(imageBase64);
    }

    // Remove the data URL prefix if present
    const base64Image = imageBase64.startsWith('data:') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    const response = await axios.post(
      API_ENDPOINT,
      {
        model: VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.1 // Low temperature for more consistent validation
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    const result = response.data.choices[0].message.content.trim();
    
    // Validate that we got one of the expected responses
    const validResponses = ['VALID_PALM', 'NOT_PALM', 'UNCLEAR_PALM', 'WRONG_SIDE', 'PARTIAL_HAND'];
    if (validResponses.includes(result)) {
      return result;
    } else {
      // If GPT didn't return expected format, be conservative and reject
      console.log('Unexpected GPT response:', result);
      return 'NOT_PALM';
    }
  } catch (error) {
    console.error('Error in image analysis:', error);
    
    // Check for specific error types
    if (error.response && error.response.status === 404) {
      console.log('GPT-4o Vision not available (404). Using strict validation.');
      // For 404 errors, be more conservative - likely means Vision API isn't available
      return 'NOT_PALM';
    }
    
    // For other errors, use mock validation but be stricter
    return getMockImageValidation(imageBase64);
  }
};

/**
 * Generates a comprehensive wellness report using GPT with enhanced personalization
 * @param {Array} userResponses - Array of user responses from the conversation
 * @param {Boolean} palmImageUploaded - Whether palm image was uploaded
 * @returns {Promise<String>} - Generated report text
 */
export const generateComprehensiveReport = async (userResponses, palmImageUploaded = false) => {
  // Generate dynamic seed for varied results
  const userSeed = generateUserSeed(userResponses);
  const currentDate = new Date().toISOString().split('T')[0];
  const userText = userResponses.join(' ');
  
  const reportPrompt = `You are Eternal AI, an advanced spiritual advisor with deep expertise in metaphysical sciences. Create a HIGHLY PERSONALIZED spiritual wellness report based on the unique responses below. Each section must be distinctly different with varied scores and specific details.

CRITICAL INSTRUCTIONS FOR UNIQUENESS:
- Make each response COMPLETELY UNIQUE based on specific user answers
- Vary scores significantly (use realistic distributions: some 35-50, some 60-75, some 80-95)
- Include specific numbers, dates, colors, frequencies, and measurements
- Reference the user's actual words and responses directly in quotes
- Create realistic score patterns that reflect actual spiritual assessment
- Avoid generic responses - be highly specific to this individual

USER PROFILE SEED: ${userSeed}
ANALYSIS DATE: ${currentDate}
PALM IMAGE: ${palmImageUploaded ? 'Uploaded for detailed palm reading' : 'No palm image provided'}

USER RESPONSES: ${userResponses.join(' || ')}

Generate EXACTLY these 9 sections with highly varied and specific content:

NUMEROLOGY WITH DATE OF BIRTH
[Extract the date of birth and Calculate specific numeralogy numnber (adding the date of bith numbers) and give the Life Path Number. Include challenging years, current numerological cycle. Mention specific numerological influences for this year.]
Score: [Generate varied score 35-95]/100

ETERNAL ARCHETYPE PROFILE  
[Analyze personality from responses to determine ONE specific archetype: Ancient Healer, Cosmic Teacher, Intuitive Mystic, Earth Guardian, Quantum Seeker, Light Warrior, Soul Alchemist, Dream Walker, Energy Weaver, etc. Describe their unique spiritual gifts, shadow aspects, and evolutionary path based on actual responses. Quote user responses.]
Score: [Generate varied score 45-90]/100

VIBRATIONAL FREQUENCY DASHBOARD
[Assign specific frequency (432Hz, 528Hz, 741Hz, 852Hz, 963Hz, etc.) based on user energy. Analyze energy patterns from mood/stress responses. Mention specific times when energy peaks/dips. Include geometric patterns (triangles, spirals, mandalas) or colors associated with frequency. Reference their actual lifestyle responses.]
Score: [Generate varied score 38-88]/100

AURA AND CHAKRA HEALTH
[Identify 2-3 specific aura colors (not generic blue/green): crimson, turquoise, amber, magenta, silver, gold. Detail which chakras are blocked/open based on lifestyle answers. Mention specific crystals (amethyst, rose quartz, citrine), essential oils (frankincense, lavender, peppermint), practices. Reference their actual health/stress responses.]
Score: [Generate varied score 42-92]/100

RELATIONSHIP RESONANCE MAP
[Analyze relationship patterns from their responses about supportive/draining relationships. Identify their specific love language (words of affirmation, physical touch, etc.), attachment style (secure, anxious, avoidant). Mention specific relationship challenges and gifts. Quote their relationship responses.]
Score: [Generate varied score 50-85]/100

MENTAL EMOTIONAL HEALTH
[Assess from stress/anxiety/mood responses. Identify specific emotional patterns, triggers, coping mechanisms. Mention specific mental health practices (CBT, mindfulness, journaling), meditation styles (Vipassana, Transcendental, loving-kindness), therapeutic approaches. Reference their actual emotional responses.]
Score: [Generate varied score 55-95]/100

SPIRITUAL ALIGNMENT SCORE
[Evaluate based on their spiritual practice responses. Assess connection to higher self, intuition usage, life purpose clarity. Mention specific spiritual practices they mentioned, deities/guides (Archangel Michael, Buddha, etc.), traditions (Buddhism, Christianity, Paganism) that resonate. Quote spiritual responses.]
Score: [Generate varied score 40-90]/100

PALM READINGS
${palmImageUploaded ? 
  '[Provide detailed palm reading with specific line descriptions: Life line (length 65mm, 3 breaks, chain formation at age 45), Heart line (deep, curves toward Saturn finger, fork ending), Head line (slopes 15 degrees, island at Mercury mount), Fate line (starts at wrist, breaks at 30, resumes at 35), Mount analysis (Venus prominent=passionate, Jupiter elevated=leadership). Mention specific markings like crosses at age 40, star on Apollo mount, triangle on Mercury mount.]' : 
  '[Explain that detailed palm reading requires uploaded palm image. Describe what specific insights would be revealed: exact life span predictions, relationship timing, career changes at specific ages, health warnings, spiritual awakening periods. Mention importance of using correct hand based on their gender stated in responses.]'}
Score: [Generate varied score 45-85]/100

HEALTH INSIGHTS
[Based on sleep patterns, diet, exercise habits they mentioned. Provide specific recommendations: drink 2.3L water daily, walk 8,000 steps, sleep by 10:30 PM, avoid caffeine after 2 PM. Mention specific supplements (magnesium 400mg, B12, vitamin D3), herbs (ashwagandha, rhodiola), practices (breathwork 4-7-8 technique). Reference their actual health responses.]
Score: [Generate varied score 48-88]/100

Be extremely specific, personalized, and spiritually insightful. Use the user's actual responses extensively - quote them directly. Make scores realistically varied. Include specific numbers, measurements, and techniques throughout.`;

  try {
    // Check if API key is configured
    if (!API_KEY) {
      console.log('No API key found for report generation. Using enhanced mock report.');
      return getMockComprehensiveReportText(userResponses, palmImageUploaded, userSeed);
    }

    // Make API request
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are Eternal AI, an expert spiritual advisor generating highly personalized wellness reports with specific insights and varied scores. Follow the exact format requested with clear section breaks and be extremely specific to each individual.' },
          { role: 'user', content: reportPrompt }
        ],
        temperature: 0.8, // Increased for more varied responses
        max_tokens: 3500, // Increased for comprehensive report
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
    return getMockComprehensiveReportText(userResponses, palmImageUploaded, userSeed);
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
 * Mock image validation for when API key is not available
 * @param {String} imageBase64 - Base64 image string
 * @returns {String} - Mock validation result
 */
const getMockImageValidation = (imageBase64) => {
  // Simple mock validation - in production this would use actual image analysis
  if (!imageBase64 || imageBase64.length < 1000) {
    return 'UNCLEAR_PALM';
  }
  
  // For testing without API key, let's make it strict but allow some valid palms
  const validationResults = ['NOT_PALM', 'NOT_PALM', 'WRONG_SIDE', 'UNCLEAR_PALM', 'VALID_PALM'];
  const randomIndex = Math.floor(Math.random() * validationResults.length);
  
  return validationResults[randomIndex];
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
    const palmHand = userGender === 'male' ? 'RIGHT' : userGender === 'female' ? 'LEFT' : 'correct';
    return `Thank you for sharing all this information! To complete your spiritual profile, I need to analyze your palm. For accurate palm reading, please upload a clear image of your ${palmHand} palm ${userGender ? (userGender === 'male' ? '(right for males)' : '(left for females)') : '(right for males, left for females)'}. This ancient practice follows traditional palmistry guidelines for the most accurate reading.`;
  }
  
  // Check if asking for palm reading
  if (lastMessage.includes('palm') || lastMessage.includes('hand')) {
    const palmHand = userGender === 'male' ? 'RIGHT' : userGender === 'female' ? 'LEFT' : 'correct';
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
 * Enhanced mock comprehensive report text with dynamic personalization
 * @param {Array} userResponses - User's responses
 * @param {Boolean} palmImageUploaded - Whether palm image was uploaded
 * @param {String} userSeed - User's unique seed
 * @returns {String} - Personalized mock report text
 */
const getMockComprehensiveReportText = (userResponses, palmImageUploaded, userSeed) => {
  const responseText = userResponses.join(' ').toLowerCase();
  
  // Extract personal details for customization
  const hasBirthDate = responseText.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/) || responseText.includes('born');
  const isStressed = responseText.includes('stress') || responseText.includes('anxiety');
  const isSpirituallyActive = responseText.includes('meditat') || responseText.includes('spiritual');
  const hasRelationshipConcerns = responseText.includes('drain') || responseText.includes('toxic');
  
  // Generate dynamic elements based on user seed
  const frequencies = ['432Hz', '528Hz', '741Hz', '852Hz', '963Hz'];
  const auraColors = ['crimson red', 'turquoise blue', 'amber gold', 'violet purple', 'emerald green', 'silver white'];
  const archetypes = ['Quantum Healer', 'Cosmic Teacher', 'Intuitive Mystic', 'Earth Guardian', 'Light Warrior', 'Soul Alchemist', 'Dream Walker', 'Energy Weaver'];
  const crystals = ['amethyst', 'rose quartz', 'citrine', 'black tourmaline', 'selenite', 'labradorite'];
  
  const seedNum = parseInt(userSeed.slice(-3));
  const selectedFrequency = frequencies[seedNum % frequencies.length];
  const selectedAuraColor = auraColors[seedNum % auraColors.length];
  const selectedArchetype = archetypes[seedNum % archetypes.length];
  const selectedCrystal = crystals[seedNum % crystals.length];
  
  // Generate dynamic scores
  const scores = {
    numerology: generateDynamicScore('NUMEROLOGY', userSeed, userResponses),
    archetype: generateDynamicScore('ARCHETYPE', userSeed, userResponses),
    vibrational: generateDynamicScore('VIBRATIONAL', userSeed, userResponses),
    aura: generateDynamicScore('AURA', userSeed, userResponses),
    relationship: generateDynamicScore('RELATIONSHIP', userSeed, userResponses),
    mental: generateDynamicScore('MENTAL', userSeed, userResponses),
    spiritual: generateDynamicScore('SPIRITUAL', userSeed, userResponses),
    palm: palmImageUploaded ? generateDynamicScore('PALM', userSeed, userResponses) : 0,
    health: generateDynamicScore('HEALTH', userSeed, userResponses)
  };

  return `NUMEROLOGY WITH DATE OF BIRTH
${hasBirthDate ? 
  `Based on your birth date analysis, your Life Path Number is ${3 + (seedNum % 6)}, revealing a soul path focused on ${seedNum % 2 === 0 ? 'creative expression and communication' : 'spiritual leadership and healing'}. Your Expression Number ${6 + (seedNum % 4)} indicates ${seedNum % 3 === 0 ? 'strong analytical abilities combined with intuitive wisdom' : 'natural teaching gifts and empathic sensitivity'}. This year (2025) brings a ${seedNum % 2 === 0 ? '7' : '9'} personal year cycle, emphasizing ${seedNum % 2 === 0 ? 'introspection and spiritual development' : 'completion and humanitarian service'}.` :
  `Your numerological profile indicates you're in a powerful transformation phase. Based on your energy signature, your core numbers suggest a Life Path focused on spiritual service and healing others. Your current personal year cycle emphasizes the importance of trusting your intuition and developing your natural psychic abilities.`}
Score: ${scores.numerology}/100

ETERNAL ARCHETYPE PROFILE
You embody the ${selectedArchetype} archetype - a rare spiritual configuration representing ${seedNum % 3 === 0 ? 'ancient wisdom keepers who bridge multiple dimensions' : seedNum % 3 === 1 ? 'evolutionary catalysts who help others awaken to their true purpose' : 'master healers who transform pain into wisdom'}. ${isSpirituallyActive ? 'Your consistent spiritual practices have activated dormant DNA codes, allowing you to access higher dimensional frequencies' : 'Your natural spiritual gifts are awakening, even without formal practices, indicating a soul contract to serve as a spiritual guide'}. Your shadow aspect involves ${isStressed ? 'tendency to absorb others\' negative emotions, requiring stronger energetic boundaries' : 'perfectionism that can block the flow of divine inspiration'}.
Score: ${scores.archetype}/100

VIBRATIONAL FREQUENCY DASHBOARD
Your current vibrational frequency resonates at ${selectedFrequency}, known as the "${selectedFrequency === '528Hz' ? 'Love Frequency' : selectedFrequency === '432Hz' ? 'Nature\'s Frequency' : selectedFrequency === '741Hz' ? 'Awakening Frequency' : selectedFrequency === '852Hz' ? 'Third Eye Frequency' : 'Divine Connection Frequency'}." ${isStressed ? 'Recent stress patterns have created minor frequency fluctuations between 3-7 AM, but your natural resonance quickly restores balance' : 'Your frequency remains remarkably stable, with peak energy occurring during early morning hours and evening twilight'}. Your energy geometric pattern forms ${seedNum % 3 === 0 ? 'sacred spirals' : seedNum % 3 === 1 ? 'crystalline triangles' : 'infinity mandalas'}, indicating ${seedNum % 3 === 0 ? 'evolutionary consciousness' : seedNum % 3 === 1 ? 'manifestation abilities' : 'soul integration mastery'}.
Score: ${scores.vibrational}/100

AURA AND CHAKRA HEALTH
Your dominant aura color is ${selectedAuraColor}, indicating ${selectedAuraColor.includes('crimson') ? 'passionate life force and leadership abilities' : selectedAuraColor.includes('turquoise') ? 'healing gifts and clear communication' : selectedAuraColor.includes('amber') ? 'wisdom keeping and ancient knowledge access' : selectedAuraColor.includes('violet') ? 'psychic abilities and spiritual mastery' : selectedAuraColor.includes('emerald') ? 'heart-centered healing and unconditional love' : 'pure divine connection and angelic communication'}. Your ${isStressed ? 'throat chakra shows mild constriction from recent stress, while your' : 'chakra system displays excellent'} crown chakra radiates brilliant ${selectedAuraColor.split(' ')[1]} light. ${hasRelationshipConcerns ? 'Your heart chakra requires cleansing with rose quartz and rhodochrosite' : `Your ${selectedCrystal} resonates perfectly with your energy field`}. Specific healing: apply ${selectedCrystal} to your solar plexus for 15 minutes daily.
Score: ${scores.aura}/100

RELATIONSHIP RESONANCE MAP
${hasRelationshipConcerns ? 
  'Your empathic nature creates deep soul connections but requires conscious boundary setting to prevent energy depletion. You naturally attract wounded souls seeking healing, which aligns with your spiritual purpose but can be energetically taxing. Your love language combines physical touch with words of affirmation, and you thrive in relationships that support mutual spiritual growth.' :
  'You demonstrate exceptional relationship wisdom, naturally attracting high-vibrational connections that support your spiritual evolution. Your energy signature indicates secure attachment patterns with strong intuitive abilities to discern authentic connections. You serve as an energetic anchor in relationships, providing stability and unconditional love.'} Your relationship archetype is the ${seedNum % 2 === 0 ? 'Sacred Mirror' : 'Divine Catalyst'}, ${seedNum % 2 === 0 ? 'reflecting others\' highest potential' : 'inspiring others\' spiritual awakening'}.
Score: ${scores.relationship}/100

MENTAL EMOTIONAL HEALTH
${isStressed ? 
  'Your highly sensitive nervous system processes emotional and energetic information at accelerated rates, sometimes creating overwhelm. Your stress patterns indicate you absorb environmental energies unconsciously, requiring daily protection rituals. Practice the 4-7-8 breathing technique three times daily and visualize a protective violet flame around your aura.' :
  'You demonstrate remarkable emotional intelligence and energetic sovereignty. Your mental clarity remains stable even during challenging circumstances, indicating strong spiritual resilience. Your emotional patterns show healthy processing and integration of life experiences.'} Your empathic gifts score ${85 + (seedNum % 10)} out of 100, placing you in the highly sensitive person category. Recommended practice: daily grounding meditation for 12 minutes at sunrise.
Score: ${scores.mental}/100

SPIRITUAL ALIGNMENT SCORE
${isSpirituallyActive ? 
  'Excellent alignment with your soul\'s purpose and higher self connection. Your dedication to spiritual practices has activated your light body and opened direct communication channels with your spirit guides. You\'re currently in an acceleration phase of spiritual development, with new psychic abilities emerging.' :
  'Strong natural spiritual connection despite limited formal practices, indicating an old soul with innate wisdom. Your intuitive abilities are highly developed, and you\'re being called to establish more consistent spiritual practices to fully anchor your gifts.'} Your spiritual DNA shows activation of ${3 + (seedNum % 4)} out of 12 strands, with rapid evolution occurring. You have a direct connection to ${seedNum % 3 === 0 ? 'Archangel Michael' : seedNum % 3 === 1 ? 'Ascended Master Buddha' : 'Divine Mother Mary'}.
Score: ${scores.spiritual}/100

PALM READINGS
${palmImageUploaded ? 
  `Your palm reveals extraordinary spiritual markings: a ${seedNum % 2 === 0 ? '72mm' : '68mm'} life line with ${seedNum % 3 + 1} healing crosses, indicating natural healing abilities activated at age ${25 + (seedNum % 15)}. Your heart line curves dramatically toward Jupiter finger, showing your capacity for unconditional love and spiritual leadership. The head line displays a ${seedNum % 2 === 0 ? 'writer\'s fork' : 'mystic cross'}, confirming your gifts in ${seedNum % 2 === 0 ? 'spiritual communication and teaching' : 'psychic abilities and divination'}. Your Mount of Apollo shows a rare star formation, indicating fame or recognition in spiritual/healing work arriving between ages ${40 + (seedNum % 10)}-${50 + (seedNum % 8)}.
Score: ${scores.palm}/100` :
  `Detailed palm reading requires uploaded palm image to reveal your complete destiny map. Your palm would show specific timing for major life events: relationship milestones, career breakthroughs, health challenges, and spiritual awakening periods. The traditional palmistry practice uses your ${responseText.includes('male') && !responseText.includes('female') ? 'right' : responseText.includes('female') ? 'left' : 'dominant'} hand to read active karma and future potentials, while the opposite hand reveals your soul's original blueprint.
Score: ${scores.palm}/100`}

HEALTH INSIGHTS
${responseText.includes('sleep') ? 
  'Your sleep patterns directly impact your psychic abilities and energy field strength. Optimal bedtime for your constitution is 10:15 PM, with awakening between 5:45-6:30 AM to align with your natural circadian rhythm.' : 
  'Your energy system requires specific timing for optimal function.'} Based on your responses, implement these precise protocols: consume 2.1 liters of structured water daily (add pinch of sea salt), walk exactly 7,800 steps daily, and practice breathwork at 6 AM and 6 PM for 8 minutes each session. ${isStressed ? 'Your adrenals require ashwagandha root (600mg) and magnesium glycinate (400mg) before bed' : 'Maintain your excellent health with rhodiola rosea (300mg) for sustained energy'}. Your body temple resonates with ${selectedCrystal} placed on your heart center during rest periods.
Score: ${scores.health}/100`;
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
  generateComprehensiveReport,
  analyzeImage
};