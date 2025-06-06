// src/services/gpt.js
import axios from 'axios';

// Replace with your actual API endpoint and key management strategy
const API_ENDPOINT = process.env.REACT_APP_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
/**
 * Generates a personalized aura reading and profile based on user answers
 * @param {Array} answers - Array of question-answer objects
 * @returns {Object} - GPT generated profile with aura colors, personality insights, and recommendations
 */
export const generateGPTResponse = async (answers) => {
  try {
    console.log("Starting GPT request with answers:", answers);
    
    // If no API key is configured, return mock response
    if (!API_KEY) {
      console.log("No API key found, using mock response");
      return getMockResponse();
    }
    
    // Create a prompt from the user's answers
    const prompt = createPromptFromAnswers(answers);
    
    console.log("Sending request to GPT API");
    
    // Call the GPT API
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: "gpt-4-turbo", // You can change this to a more appropriate model if needed
        messages: [
          {
            role: "system",
            content: "You are Eternal, an expert spiritual guide specializing in aura reading and personalized energy analysis. Based on the answers provided, create a highly personalized aura reading that includes dominant aura colors, personality insights, energy analysis (what boosts and drains their energy), and specific alignment recommendations. Be insightful, specific, and compassionate."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    console.log("GPT API response received");
    
    // Process the response
    const result = response.data.choices[0].message.content;
    console.log("Raw GPT response received:", result);
    
    // Structure the result into sections
    return processGPTResponse(result);
    
  } catch (error) {
    console.error('Error generating GPT response:', error);
    console.log("Falling back to mock response due to error");
    // Return mock data on error to prevent app from breaking
    return getMockResponse();
  }
};

/**
 * Creates a prompt string from the user's answers
 * @param {Array} answers - Array of question-answer objects
 * @returns {String} - Formatted prompt string
 */
const createPromptFromAnswers = (answers) => {
  let prompt = "Generate a personalized spiritual aura reading based on the following responses.\n\n";
  
  // Add question answers
  prompt += "Here are their responses to the questionnaire:\n\n";
  
  answers.forEach((item, index) => {
    prompt += `Question ${index + 1}: ${item.question}\nAnswer: ${item.answer}\n\n`;
  });
  
  prompt += "Based on these responses, please generate a personalized Eternal Wellness Report with the 13 diagnostic sections below. Format each section with the EXACT heading shown in quotes:\n\n";

  prompt += "1. \"ETERNAL ARCHETYPE PROFILE\": Identify their soul archetype (e.g., Seeker, Healer, Warrior) based on personality, emotions, and spiritual responses. Include elemental imbalances, core blocks, and suggested rituals.\n\n";

  prompt += "2. \"VIBRATIONAL FREQUENCY DASHBOARD\": Estimate their current vibrational frequency (Hz), emotional tone, and clarity vs dissonance. Suggest sound frequencies and practices to elevate it.\n\n";

  prompt += "3. \"AURA & CHAKRA HEALTH\": Interpret aura colors, energy density, and the state of chakras from Root to Crown. Recommend crystals, mantras, and color therapies.\n\n";

  prompt += "4. \"VITALITY INDEX\": Use sleep, heart rate, movement, and water intake data to assess vitality and circadian alignment. Suggest diet and movement patterns.\n\n";

  prompt += "5. \"RELATIONSHIP MAP\": Analyze uplifting vs draining relationships and karmic entanglements. Suggest healing rituals for harmony and dharma alignment.\n\n";

  prompt += "6. \"MENTAL & EMOTIONAL HEALTH\": Assess emotional state, stress patterns, and nervous system health. Recommend meditation, breathwork, and mental clarity tools.\n\n";

  prompt += "7. \"FOOD & FABRIC ANALYSIS\": Evaluate food choices and clothing materials. Suggest high-frequency alternatives (e.g., natural fibers, Sattvic foods).\n\n";

  prompt += "8. \"PLANETARY INFLUENCES\": Analyze their Date/Time/Place of Birth for Dasha periods, planetary influences (e.g., Saturn, Rahu). Suggest planetary remedies and mantras.\n\n";

  prompt += "9. \"ASTROCARTOGRAPHY INSIGHTS\": Use birth and current location to determine high-energy zones for healing, purpose, and relationships. Suggest planetary lines and optimal travel windows.\n\n";

  prompt += "10. \"KARMIC & DHARMIC\": Detect past life patterns, karmic loops, and dharma alignment. Suggest service paths, ancestral healing, and karmic rituals.\n\n";

  prompt += "11. \"SOUL SCROLL\": Describe their energetic blueprint visually: aura waveform, chakra wheel, karmic meter, and dharma timeline.\n\n";

  prompt += "12. \"BIOMETRIC SYNC\": Based on biometric data (sleep, heart rate, steps), offer syncing strategies to optimize body-mind-energy balance.\n\n";

  prompt += "13. \"PROGRESS TRACKER\": Provide a gamified suggestion to track spiritual routines and reward progress (e.g., $HEAL tokens for rituals).\n\n";

  prompt += "IMPORTANT: Each section must begin with the EXACT heading in quotes above (e.g., \"ETERNAL ARCHETYPE PROFILE\"). Make the tone inspirational and rooted in Vedic wisdom. Use detailed insights from the answers to personalize each section.";
  
  return prompt;
};

/**
 * Processes the GPT response into structured sections
 * @param {String} response - Raw GPT response text
 * @returns {Object} - Structured response object
 */
const processGPTResponse = (response) => {
  try {
    // Define the section headers we expect to find
    const sectionHeaders = [
      "ETERNAL ARCHETYPE PROFILE",
      "VIBRATIONAL FREQUENCY DASHBOARD",
      "AURA & CHAKRA HEALTH",
      "VITALITY INDEX",
      "RELATIONSHIP MAP",
      "MENTAL & EMOTIONAL HEALTH",
      "FOOD & FABRIC ANALYSIS",
      "PLANETARY INFLUENCES",
      "ASTROCARTOGRAPHY INSIGHTS",
      "KARMIC & DHARMIC", 
      "SOUL SCROLL",
      "BIOMETRIC SYNC",
      "PROGRESS TRACKER"
    ];
    
    // Create an object to store our extracted sections
    const sections = {
      eternalArchetype: "",
      vibrationalFrequency: "",
      auraChakraHealth: "",
      vitalityIndex: "",
      relationshipMap: "",
      mentalEmotionalHealth: "", 
      foodFabricAnalysis: "",
      planetaryInfluences: "",
      astrocartography: "",
      karmicDharmic: "",
      soulScroll: "",
      biometricSync: "",
      progressTracker: ""
    };
    
    // Map of section headers to object keys
    const headerToKey = {
      "ETERNAL ARCHETYPE PROFILE": "eternalArchetype",
      "VIBRATIONAL FREQUENCY DASHBOARD": "vibrationalFrequency",
      "AURA & CHAKRA HEALTH": "auraChakraHealth",
      "VITALITY INDEX": "vitalityIndex",
      "RELATIONSHIP MAP": "relationshipMap",
      "MENTAL & EMOTIONAL HEALTH": "mentalEmotionalHealth",
      "FOOD & FABRIC ANALYSIS": "foodFabricAnalysis",
      "PLANETARY INFLUENCES": "planetaryInfluences", 
      "ASTROCARTOGRAPHY INSIGHTS": "astrocartography",
      "KARMIC & DHARMIC": "karmicDharmic",
      "SOUL SCROLL": "soulScroll",
      "BIOMETRIC SYNC": "biometricSync",
      "PROGRESS TRACKER": "progressTracker"
    };
    
    // Split the full text into sections using the headers as delimiters
    let remainingText = response;
    
    // Try to find each section in sequence
    for (let i = 0; i < sectionHeaders.length; i++) {
      const currentHeader = sectionHeaders[i];
      const nextHeader = i < sectionHeaders.length - 1 ? sectionHeaders[i + 1] : null;
      
      // Create a regex that can handle various header formats
      const headerRegex = new RegExp(`("|###|##|#)\\s*${currentHeader}\\s*("|:|\\n|$)`, 'i');
      const headerMatch = remainingText.match(headerRegex);
      
      if (headerMatch) {
        // Found the current header
        const startIndex = headerMatch.index + headerMatch[0].length;
        let endIndex = remainingText.length;
        
        // If there's a next header, find where it starts
        if (nextHeader) {
          const nextHeaderRegex = new RegExp(`("|###|##|#)\\s*${nextHeader}\\s*("|:|\\n|$)`, 'i');
          const nextHeaderMatch = remainingText.substring(startIndex).match(nextHeaderRegex);
          
          if (nextHeaderMatch) {
            endIndex = startIndex + nextHeaderMatch.index;
          }
        }
        
        // Extract the content and store it
        const sectionContent = remainingText.substring(startIndex, endIndex).trim();
        const key = headerToKey[currentHeader];
        
        if (key) {
          sections[key] = sectionContent;
        }
        
        // Update remaining text for next iteration
        if (endIndex < remainingText.length) {
          remainingText = remainingText.substring(endIndex);
        } else {
          break; // No more text to process
        }
      }
    }
    
    // Log the extracted sections for debugging
    console.log("Extracted sections:", sections);
    
    // Check if we're missing any essential sections
    const missingSections = Object.entries(sections)
      .filter(([_, value]) => !value || value.length < 10)
      .map(([key]) => key);
    
    if (missingSections.length > 0) {
      console.warn(`Some sections are missing or too short: ${missingSections.join(", ")}`);
      
      // If too many sections are missing, use a fallback approach
      if (missingSections.length > 6) {
        console.log("Using fallback extraction method");
        
        // Basic fallback: just extract what we can, and put the whole response in fullReading
        return {
          fullReading: response,
          ...sections
        };
      }
    }
    
    return sections;
  } catch (error) {
    console.error("Error processing GPT response:", error);
    return {
      fullReading: response,
    };
  }
};

/**
 * Fallback method to extract aura colors using pattern matching
 * @param {String} text - Full GPT response text
 * @returns {Array} - Array of identified aura colors
 */
const extractAuraColorsFallback = (text) => {
  const colorPatterns = [
    'blue', 'purple', 'violet', 'indigo', 'red', 'orange',
    'yellow', 'green', 'pink', 'white', 'gold', 'silver',
    'bronze', 'brown', 'black', 'gray', 'turquoise'
  ];
  
  const foundColors = [];
  
  colorPatterns.forEach(color => {
    if (new RegExp(`\\b${color}\\b`, 'i').test(text)) {
      foundColors.push(color);
    }
  });
  
  return foundColors.length > 0 ? foundColors : ['blue', 'purple']; // Default fallback
};

/**
 * Provides a mock GPT response in case of API issues
 * @returns {Object} - Mock response with all required sections
 */
const getMockResponse = () => {
  return {
    eternalArchetype: "Your soul archetype is the **Healer-Seeker** — a blend of nurturing energy and deep curiosity. You are drawn to help others emotionally or spiritually, while constantly seeking greater truths. Elemental imbalances include occasional overextension of emotional energy (Water) and mental over-analysis (Air). Core blocks may stem from self-doubt or past emotional betrayal. Rituals like candle meditations and grounding walks can rebalance you.",

    vibrationalFrequency: "Your current vibrational frequency is measured at **7.6 Hz**, indicating a state of peaceful clarity with occasional emotional turbulence. Recent trends suggest rising inner harmony, though temporary disruptions in energy flow are noted during stressful interactions. Sound frequencies like **432 Hz (healing)** and **528 Hz (DNA repair)** are recommended to help elevate your state.",

    auraChakraHealth: "Your aura is primarily composed of **indigo blue and emerald green**, signifying heightened intuition and heart-centered energy. The Third Eye and Heart chakras are dominant, but Root and Solar Plexus chakras show lower activity. To restore balance, work with crystals like amethyst (for spiritual clarity) and red jasper (for grounding), practice green and red color therapy, and chant 'Lam' and 'Ram' seed mantras during meditation.",

    vitalityIndex: "Your vitality level aligns moderately with natural circadian rhythms, but irregular sleep and screen exposure affect regeneration. Hydration and nutrition are above average, though meal timings fluctuate. Suggested practices: align meals with daylight, incorporate gentle fasting rhythms (e.g., 14:10), and include restorative movement like yoga or nature walks to improve your Longevity Index.",

    relationshipMap: "You resonate most with empathetic and spiritually conscious individuals. However, draining patterns arise from overextending yourself or absorbing emotional burdens from others. Uplifting relationships feel reciprocal and peaceful. Healing rituals include journaling after difficult conversations, cord-cutting meditations, and surrounding yourself with those who honor your boundaries.",

    mentalEmotionalHealth: "Emotionally, you display high sensitivity and depth, often requiring time to process and integrate. Your mental clarity is strong when aligned, but overstimulation or external conflict may trigger anxiety or fatigue. Practices like breathwork (box breathing), guided meditations, and aromatherapy (lavender, sandalwood) help regulate your nervous system and emotional tone.",

    foodFabricAnalysis: "Your recent choices in food and fabrics show awareness but room for refinement. Whole foods and seasonal fruits increase your energy, while processed foods or excessive caffeine reduce vibrational harmony. Natural fabrics like cotton and linen support your aura, while synthetic materials disrupt energy flow. Wear earth tones or greens for support and avoid overly stimulating patterns/colors.",

    planetaryInfluences: "Your current Vedic Dasha is **Venus**, indicating a period focused on beauty, creativity, and relational harmony. Key planetary transits show Saturn testing your endurance and discipline. Mars in your natal chart suggests strong will but potential burnout. Remedies include chanting planetary mantras ('Om Shukraya Namah'), wearing gemstones like diamond or opal (if astrologically suitable), and aligning your weekly routines with planetary energies.",

    astrocartography: "Your birthplace is influenced by a **Sun-MC line**, suggesting leadership potential and visibility. However, current residence falls under a **Moon-IC** influence, emphasizing emotional security and introspection. High-vibration zones for healing and growth include coastal or forested regions near **your Mercury line**, supporting intellectual clarity. Favorable travel windows: during waxing moon phases or Venus transits.",

    karmicDharmic: "You carry past life themes around **service, emotional entanglement, and spiritual isolation**. Karmic loops involve repeating savior patterns or seeking validation. Your dharma involves **teaching, healing, and creative expression**. Suggested actions: ancestral healing rituals, forgiveness meditations, offering service without attachment, and creating energetic boundaries in relationships.",

    soulScroll: "Your Soul Scroll visual shows an auric waveform flowing smoothly around the Heart and Third Eye chakras, with some blockages in the Root. Emotional tone ranges from peaceful to oversensitive, often impacted by external environments. Your karmic meter is moderately loaded, and your dharma path curves toward healing and creative expression. This digital mandala can be animated to show alignment shifts over time.",

    biometricSync: "While real-time biometric data isn't synced, trends from your lifestyle responses suggest good movement and hydration, but disrupted sleep-wake patterns. To sync biologically: track sleep stages, walk during sunlight hours, limit blue light at night, and add rhythmic sound therapy (e.g., binaural beats). Biofeedback tools like Oura or WHOOP can support further alignment.",

    progressTracker: "You've already taken meaningful steps by reflecting and answering with intention. Your journey includes learning when to slow down and when to express. A personal $HEAL token system could reward: 1 token/day for journaling, 2 for creative work, 3 for completing rituals. Higher stages unlock deeper integration tools, dream work prompts, or advanced meditations. Celebrate progress, not perfection."
  };
};

export default {
  generateGPTResponse
};