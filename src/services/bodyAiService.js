import axios from 'axios';

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = 'OpenAI API key';

/**
 * Service for generating AI body transformations
 */
const bodyAiService = {
  /**
   * Generate body transformation images using OpenAI's DALL-E 3
   * 
   * @param {Object} metricsData - User's body metrics
   * @returns {Promise<Object>} - Object containing image URLs
   */
  generateBodyTransformation: async (metricsData) => {
    try {
      // Calculate changes for the prompt
      const weightChange = metricsData.targetWeight - metricsData.currentWeight;
      const isWeightLoss = weightChange < 0;
      const changeAmount = Math.abs(weightChange).toFixed(1);
      
      // Create a detailed prompt for DALL-E
      const prompt = `A side-by-side comparison showing a ${metricsData.gender}'s body transformation.
      
Left image: ${metricsData.gender}, ${metricsData.currentHeight}cm tall, ${metricsData.currentWeight}kg, 
${isWeightLoss ? 'with some extra weight' : 'with a slim build'}.

Right image: Same ${metricsData.gender}, transformed to a ${metricsData.desiredPhysique} physique at ${metricsData.targetWeight}kg 
after ${metricsData.timeframe} weeks of consistent training.

${isWeightLoss ? `The transformation shows ${changeAmount}kg of weight loss` : `The transformation shows ${changeAmount}kg of muscle gain`}.
The images should be fitness photography style, showing the same person before and after. 
No text or labels on the images. Background should be neutral.`;

      // Call OpenAI's DALL-E API
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      // Extract image URL from response
      const imageUrl = response.data.data[0].url;
      
      return {
        success: true,
        imageUrl: imageUrl,
        timeframe: metricsData.timeframe
      };
    } catch (error) {
      console.error('Error generating AI body transformation:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate AI transformation'
      };
    }
  },
  
  /**
   * Generate separate before and after images
   * 
   * @param {Object} metricsData - User's body metrics
   * @returns {Promise<Object>} - Object with before and after image URLs
   */
  generateSeparateTransformationImages: async (metricsData) => {
    try {
      // Before image prompt
      const beforePrompt = `A fitness photograph of a ${metricsData.gender}, 
      ${metricsData.currentHeight}cm tall, ${metricsData.currentWeight}kg, 
      ${metricsData.currentWeight > metricsData.targetWeight ? 'with some extra weight' : 'with a slim build'}.
      The image should be from front view, neutral background, fitness style photography.`;
      
      // After image prompt
      const afterPrompt = `A fitness photograph of a ${metricsData.gender}, 
      ${metricsData.currentHeight}cm tall, ${metricsData.targetWeight}kg, 
      with a ${metricsData.desiredPhysique} physique.
      The image should be from front view, neutral background, fitness style photography.`;
      
      // Call OpenAI's DALL-E API for before image
      const beforeResponse = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: "dall-e-3",
          prompt: beforePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
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
        'https://api.openai.com/v1/images/generations',
        {
          model: "dall-e-3",
          prompt: afterPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
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
        beforeImageUrl: beforeResponse.data.data[0].url,
        afterImageUrl: afterResponse.data.data[0].url,
        timeframe: metricsData.timeframe
      };
    } catch (error) {
      console.error('Error generating separate transformation images:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate transformation images'
      };
    }
  }
};

export default bodyAiService;