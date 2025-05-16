import axios from 'axios';

// Replace with your actual OpenAI API key - you should store this securely in an environment variable
const OPENAI_API_KEY = 'OpenAI API key';
const API_URL = 'https://api.openai.com/v1/images/generations';

/**
 * Service for generating body transformation images using OpenAI's DALL-E
 */
const bodyTransformationService = {
  /**
   * Generate body transformation images using DALL-E 3
   * 
   * @param {Object} metricsData - User's body metrics
   * @returns {Promise<Object>} - Object containing image URLs
   */
  generateTransformation: async (metricsData) => {
    try {
      // Calculate changes for the prompt
      const weightChange = metricsData.targetWeight - metricsData.currentWeight;
      const isWeightLoss = weightChange < 0;
      const changeAmount = Math.abs(weightChange).toFixed(1);
      
      // Determine gender and physique details
      const gender = metricsData.gender;
      const currentWeight = metricsData.currentWeight;
      const targetWeight = metricsData.targetWeight;
      const desiredPhysique = metricsData.desiredPhysique;
      const timeframe = metricsData.timeframe;
      
      // Create a detailed prompt for DALL-E
      const prompt = `A side-by-side comparison of a ${gender}'s body transformation.
      
Left image: A ${gender} with a ${isWeightLoss ? 'heavier' : 'slimmer'} build weighing ${currentWeight}kg.

Right image: The same ${gender} after transformation to a ${desiredPhysique} physique weighing ${targetWeight}kg after ${timeframe} weeks of fitness training.

${isWeightLoss ? `The transformation shows ${changeAmount}kg of weight loss` : `The transformation shows ${changeAmount}kg of muscle gain`}.
Simple silhouette style, no faces visible, focusing on body shape changes. No text labels.`;

      console.log('Sending prompt to DALL-E:', prompt);

      // Call OpenAI's DALL-E API
      const response = await axios.post(
        API_URL,
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "b64_json"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      console.log('DALL-E response received');
      
      // Extract base64 image data from response
      const imageBase64 = response.data.data[0].b64_json;
      
      return {
        success: true,
        imageData: imageBase64,
        timeframe: timeframe
      };
    } catch (error) {
      console.error('Error generating DALL-E transformation:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to generate transformation'
      };
    }
  },
  
  /**
   * Generate separate before and after images
   * 
   * @param {Object} metricsData - User's body metrics
   * @returns {Promise<Object>} - Object with before and after image data
   */
  generateSeparateImages: async (metricsData) => {
    try {
      // Determine gender and physique details
      const gender = metricsData.gender;
      const currentWeight = metricsData.currentWeight;
      const targetWeight = metricsData.targetWeight;
      const desiredPhysique = metricsData.desiredPhysique;
      const isWeightLoss = targetWeight < currentWeight;
      
      // Before image prompt
      const beforePrompt = `A fitness silhouette of a ${gender} weighing ${currentWeight}kg with a ${isWeightLoss ? 'heavier' : 'slim'} build. 
      Simple fitness illustration style, no face details, focus on body shape only.`;
      
      // After image prompt
      const afterPrompt = `A fitness silhouette of a ${gender} weighing ${targetWeight}kg with a ${desiredPhysique} physique.
      Simple fitness illustration style, no face details, focus on body shape only.`;
      
      // Call OpenAI's DALL-E API for before image
      const beforeResponse = await axios.post(
        API_URL,
        {
          model: "dall-e-3",
          prompt: beforePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "b64_json"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      // Call OpenAI's DALL-E API for after image
      const afterResponse = await axios.post(
        API_URL,
        {
          model: "dall-e-3",
          prompt: afterPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "b64_json"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      return {
        success: true,
        beforeImageData: beforeResponse.data.data[0].b64_json,
        afterImageData: afterResponse.data.data[0].b64_json,
        timeframe: metricsData.timeframe
      };
    } catch (error) {
      console.error('Error generating separate DALL-E images:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to generate transformation images'
      };
    }
  }
};

export default bodyTransformationService;