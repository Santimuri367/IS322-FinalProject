import axios from 'axios';

// Replace with your actual OpenAI API key
const API_KEY = 'OpenAI API key';
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Body type images for transformation visualization
const bodyTypeImages = {
  male: {
    slim: 'https://via.placeholder.com/300x450/4F46E5/FFFFFF?text=Male+Slim',
    athletic: 'https://via.placeholder.com/300x450/3B82F6/FFFFFF?text=Male+Athletic',
    muscular: 'https://via.placeholder.com/300x450/2563EB/FFFFFF?text=Male+Muscular',
    bulky: 'https://via.placeholder.com/300x450/1D4ED8/FFFFFF?text=Male+Bulky'
  },
  female: {
    slim: 'https://via.placeholder.com/300x450/10B981/FFFFFF?text=Female+Slim',
    athletic: 'https://via.placeholder.com/300x450/059669/FFFFFF?text=Female+Athletic',
    toned: 'https://via.placeholder.com/300x450/047857/FFFFFF?text=Female+Toned',
    muscular: 'https://via.placeholder.com/300x450/065F46/FFFFFF?text=Female+Muscular'
  }
};

const openAIService = {
  // Get personalized recommendations based on user preferences
  getRecommendations: async (userPreferences) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-4", // You can use "gpt-3.5-turbo" for a more economical option
          temperature: 0.7,
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content: "You are a professional fitness and nutrition coach that creates personalized plans. Always provide your response in valid JSON format. Make your recommendations specific, actionable, and based on scientific evidence."
            },
            {
              role: "user",
              content: `Based on the following user preferences, generate personalized nutrition and workout recommendations:
              
              Fitness Goal: ${userPreferences.goal}
              Fitness Level: ${userPreferences.fitnessLevel}
              Available Equipment: ${userPreferences.equipment}
              Dietary Preferences: ${userPreferences.dietaryPreferences.join(', ')}
              Time Available for Workouts: ${userPreferences.timeAvailability.workout} minutes
              Time Available for Meal Prep: ${userPreferences.timeAvailability.mealPrep} minutes
              
              Format the response as JSON with the following structure:
              {
                "nutrition": {
                  "dailyMeals": [
                    {
                      "name": "meal name",
                      "description": "brief description",
                      "ingredients": ["ingredient1", "ingredient2"],
                      "prepTime": "time in minutes",
                      "nutritionFacts": {
                        "calories": 0,
                        "protein": "0g",
                        "carbs": "0g",
                        "fats": "0g"
                      }
                    }
                  ],
                  "tips": ["tip1", "tip2"]
                },
                "workout": {
                  "name": "workout name",
                  "duration": "time in minutes",
                  "exercises": [
                    {
                      "name": "exercise name",
                      "sets": 0,
                      "reps": 0,
                      "restTime": "time in seconds",
                      "description": "how to perform"
                    }
                  ],
                  "tips": ["tip1", "tip2"]
                }
              }`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      // Parse and return the recommendations from OpenAI's response
      const content = response.data.choices[0].message.content;
      
      try {
        // Attempt to parse the JSON directly
        return JSON.parse(content);
      } catch (error) {
        // If direct parsing fails, try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```json([\s\S]*?)```/) || content.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1] ? jsonMatch[1].trim() : jsonMatch[0]);
        }
        throw new Error('Failed to parse JSON response');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },

  // Get feedback on user's progress
  getFeedback: async (userPreferences, progress) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-4",
          temperature: 0.7,
          max_tokens: 600,
          messages: [
            {
              role: "system",
              content: "You are a supportive fitness and nutrition coach providing personalized feedback. Always respond in valid JSON format with encouraging, actionable advice."
            },
            {
              role: "user",
              content: `Based on the user's progress and preferences, provide encouraging feedback and suggestions for improvement:
              
              User Progress:
              Workouts Completed: ${progress.workoutsCompleted}
              Meals Followed: ${progress.mealsFollowed}
              Last Updated: ${progress.lastUpdated}
              
              User Goals: ${userPreferences.goal}
              
              Format the response as JSON with the following structure:
              {
                "feedback": "encouraging message",
                "suggestions": ["suggestion1", "suggestion2"],
                "nextSteps": "what to focus on next"
              }`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      // Parse and return the feedback from OpenAI's response
      const content = response.data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (error) {
        const jsonMatch = content.match(/```json([\s\S]*?)```/) || content.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1] ? jsonMatch[1].trim() : jsonMatch[0]);
        }
        throw new Error('Failed to parse JSON response');
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw error;
    }
  },

  // Get AI chatbot response
  getChatResponse: async (message, userPreferences) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-4",
          temperature: 0.8,
          max_tokens: 800,
          messages: [
            {
              role: "system",
              content: `You are a friendly and supportive AI fitness and nutrition coach named FitCoach. 
              You provide personalized advice based on the user's profile and goals. Be conversational, helpful, and encouraging.
              
              User Profile:
              Fitness Goal: ${userPreferences.goal || 'Not specified'}
              Fitness Level: ${userPreferences.fitnessLevel || 'Not specified'}
              Available Equipment: ${userPreferences.equipment || 'Not specified'}
              Dietary Preferences: ${userPreferences.dietaryPreferences?.join(', ') || 'Not specified'}
              
              When giving advice, focus on:
              1. Being positive and motivational
              2. Providing evidence-based information
              3. Tailoring responses to the user's specific goals and fitness level
              4. Suggesting specific, actionable steps
              5. Acknowledging challenges while offering solutions
              
              Your tone should be conversational but professional.`
            },
            {
              role: "user",
              content: message
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      return { 
        message: response.data.choices[0].message.content 
      };
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw error;
    }
  },

  // Analyze before and after progress images
  analyzeProgressImages: async (beforeImageUri, afterImageUri) => {
    try {
      // In a real implementation, you would:
      // 1. Convert image URIs to base64 or upload to a cloud storage
      // 2. Send to OpenAI's vision API (GPT-4 with Vision capability)
      
      // This is a placeholder structure for what the API call would look like
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4-vision-preview",
          max_tokens: 800,
          messages: [
            {
              role: "system",
              content: "You are a fitness coach analyzing before and after photos. Provide constructive, encouraging feedback about visible changes and progress. Focus on positive observations while being honest. Suggest next steps based on visible progress."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "I'm tracking my fitness progress. Here are my before and after photos. What changes do you notice, and what suggestions do you have for my continued progress?"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: beforeImageUri,
                    detail: "high"
                  }
                },
                {
                  type: "image_url",
                  image_url: {
                    url: afterImageUri,
                    detail: "high"
                  }
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      // Process the response into structured data
      // For now, we'll use mock data since we can't actually call the API in this example
      return {
        progressPercentage: 65,
        changes: [
          "Noticeable reduction in body fat percentage",
          "Improved muscle definition in shoulders and arms",
          "Visible progress in core definition",
          "Overall improved posture"
        ],
        recommendations: [
          "Continue with your current strength training routine",
          "Consider increasing protein intake to support muscle growth",
          "Add one more cardio session per week for additional fat loss"
        ]
      };
    } catch (error) {
      console.error('Error analyzing progress images:', error);
      throw error;
    }
  },

  // Generate body transformation from metrics
  generateBodyTransformationFromMetrics: async (metricsData, fitnessGoal) => {
    try {
      // For this prototype, we'll use a mock response
      // In a real app, you would integrate with an AI image generation model
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Determine weight change direction and amount
      const weightChange = metricsData.targetWeight - metricsData.currentWeight;
      const isWeightLoss = weightChange < 0;
      const changePercent = Math.abs((weightChange / metricsData.currentWeight) * 100).toFixed(1);
      
      // Select appropriate body type images based on the user's data
      const currentBodyImage = isWeightLoss 
        ? bodyTypeImages[metricsData.gender].bulky 
        : bodyTypeImages[metricsData.gender].slim;
      
      const resultBodyImage = bodyTypeImages[metricsData.gender][metricsData.desiredPhysique];
      
      // Generate custom recommendations based on goals
      let expectedChanges, recommendations;
      
      if (isWeightLoss) {
        expectedChanges = [
          `Potential reduction of ${Math.abs(weightChange)} kg (${changePercent}% of current weight)`,
          `Decreased body fat percentage, especially in ${metricsData.gender === 'male' ? 'abdominal' : 'hip and thigh'} areas`,
          `More defined ${metricsData.desiredPhysique === 'muscular' ? 'musculature' : 'body contours'}`,
          "Improved body proportions with a more balanced silhouette"
        ];
        
        recommendations = [
          `Maintain a calorie deficit of 500-750 calories per day for sustainable fat loss`,
          `Focus on high-protein foods (${metricsData.gender === 'male' ? '1.8-2.2g' : '1.6-2.0g'} per kg of bodyweight) to preserve muscle`,
          `Incorporate ${metricsData.desiredPhysique === 'muscular' ? 'heavy resistance training' : 'resistance training'} 3-4 times per week`,
          `Add 2-3 cardio sessions (20-30 minutes) weekly for additional calorie burn`,
          `Stay consistent - this transformation will take approximately ${metricsData.timeframe} weeks`
        ];
      } else {
        expectedChanges = [
          `Potential gain of ${weightChange} kg (${changePercent}% of current weight)`,
          `Increased muscle mass, particularly in ${metricsData.gender === 'male' ? 'chest, shoulders, and arms' : 'glutes, legs, and shoulders'}`,
          `More ${metricsData.desiredPhysique === 'athletic' ? 'athletic' : 'muscular'} physique with better definition`,
          "Enhanced overall proportions with a stronger physical presence"
        ];
        
        recommendations = [
          `Consume a calorie surplus of 300-500 calories above maintenance`,
          `Prioritize protein intake (${metricsData.gender === 'male' ? '1.8-2.2g' : '1.6-2.0g'} per kg of bodyweight)`,
          `Focus on progressive overload in your ${metricsData.desiredPhysique === 'bulky' ? 'compound exercises' : 'strength training'}`,
          `Allow adequate recovery between workouts (at least 48 hours per muscle group)`,
          `Be patient - building quality muscle takes time, expect this transformation to take ${metricsData.timeframe} weeks or more`
        ];
      }
      
      // This is a simplified response for the prototype
      return {
        currentBodyImage,
        resultBodyImage,
        timeframe: metricsData.timeframe,
        expectedChanges,
        recommendations
      };
    } catch (error) {
      console.error('Error generating body transformation from metrics:', error);
      throw error;
    }
  }
};

export default openAIService;