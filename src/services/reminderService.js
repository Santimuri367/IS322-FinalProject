import axios from 'axios';

// Replace with your actual OpenAI API key - you should store this securely
const OPENAI_API_KEY = 'OpenAI API key';
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Service for generating AI-powered fitness reminders and notifications
 */
const reminderService = {
  /**
   * Generate personalized workout and meal reminders based on user preferences
   * 
   * @param {Object} userPreferences - User fitness preferences and goals
   * @param {Object} reminderOptions - Customization options for the reminders
   * @param {Object} progressData - User's current progress data
   * @returns {Promise<Object>} - Object containing reminder messages
   */
  generateReminders: async (userPreferences, reminderOptions, progressData) => {
    try {
      // Create a detailed context for OpenAI to generate personalized reminders
      const systemPrompt = `You are FitCoach AI, a personalized fitness assistant that creates engaging reminders.
      
Generate two separate reminders: one for workouts and one for meals. 
Make these reminders personalized to the user's fitness goals, preferences, and current progress.

User fitness goal: ${userPreferences.goal || 'general fitness improvement'}
User fitness level: ${userPreferences.fitnessLevel || 'intermediate'}
Motivation style: ${reminderOptions.motivationStyle || 'encouraging'}
Tone of voice: ${reminderOptions.reminderTone || 'friendly'}
${reminderOptions.includeHealthTips ? 'Include a relevant health tip.' : 'Do not include health tips.'}
${reminderOptions.includeProgressStats ? 'Include a brief mention of their progress stats.' : 'Do not include progress stats.'}

Current progress:
- Workouts completed: ${progressData.workoutsCompleted || 0}
- Meals on plan: ${progressData.mealsFollowed || 0}
- Days active this week: ${progressData.daysActive || 0}

Please format each reminder to be concise (under 200 characters) but motivating, and end with a call to action.
Each reminder should feel like a mobile push notification.`;

      // Call OpenAI API to generate reminders
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: "Generate workout and meal reminders for today based on my preferences."
            }
          ],
          max_tokens: 600,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      // Extract the response text
      const responseText = response.data.choices[0].message.content;
      
      // Parse the output to extract workout and meal reminders
      const workoutRegex = /Workout Reminder:([^]*?)(?=Meal Reminder:|$)/i;
      const mealRegex = /Meal Reminder:([^]*?)(?=$)/i;
      
      const workoutMatch = responseText.match(workoutRegex);
      const mealMatch = responseText.match(mealRegex);
      
      const workoutReminder = workoutMatch ? workoutMatch[1].trim() : "Time for your workout! 💪 Stay consistent to reach your goals.";
      const mealReminder = mealMatch ? mealMatch[1].trim() : "Don't forget your nutrition! 🥗 Proper fuel powers your fitness journey.";
      
      return {
        success: true,
        workoutReminder,
        mealReminder
      };
    } catch (error) {
      console.error('Error generating AI reminders:', error.response?.data || error.message);
      
      // Return fallback reminders if the API call fails
      return {
        success: false,
        workoutReminder: "Time for your workout! 💪 Stay consistent to reach your goals.",
        mealReminder: "Don't forget your nutrition! 🥗 Proper fuel powers your fitness journey.",
        error: error.response?.data?.error?.message || error.message || 'Failed to generate reminders'
      };
    }
  },
  
  /**
   * Schedule reminders based on user preferences
   * 
   * @param {Object} reminderSettings - User's reminder preferences
   * @param {Array} workoutDays - Days when workouts are scheduled
   * @returns {Promise<Object>} - Result of the scheduling operation
   */
  scheduleReminders: async (reminderSettings, workoutDays) => {
    try {
      // In a real app, you would implement platform-specific notification scheduling
      // This would typically involve native modules or a backend service
      
      // For this example, we're just simulating a successful scheduling
      
      // Calculate how many notifications will be scheduled
      const daysCount = reminderSettings.frequency === 'daily' ? 7 : reminderSettings.selectedDays.length;
      const notificationCount = daysCount * (reminderSettings.notificationType === 'both' ? 2 : 1);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        scheduledCount: notificationCount,
        notificationType: reminderSettings.notificationType,
        frequency: reminderSettings.frequency,
        message: `Successfully scheduled ${notificationCount} AI-powered reminders.`
      };
    } catch (error) {
      console.error('Error scheduling reminders:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to schedule reminders'
      };
    }
  }
};

export default reminderService;