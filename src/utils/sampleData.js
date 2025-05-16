export const sampleNutritionPlan = {
    dailyMeals: [
      {
        name: "Protein-Packed Breakfast",
        description: "A quick, filling breakfast with plenty of protein to start your day",
        ingredients: ["1/2 cup rolled oats", "1 scoop protein powder", "1 tbsp chia seeds", "1/2 banana", "1 cup almond milk"],
        prepTime: "10 minutes",
        nutritionFacts: {
          calories: 350,
          protein: "25g",
          carbs: "40g",
          fats: "10g"
        }
      },
      {
        name: "Energizing Lunch Bowl",
        description: "Balanced lunch bowl with vegetables, protein and complex carbs",
        ingredients: ["1 cup quinoa", "1/2 cup black beans", "1 cup mixed vegetables", "1/4 avocado", "2 tbsp lime dressing"],
        prepTime: "15 minutes",
        nutritionFacts: {
          calories: 420,
          protein: "18g",
          carbs: "65g",
          fats: "12g"
        }
      },
      {
        name: "Satisfying Dinner",
        description: "Light yet satisfying dinner with lean protein and vegetables",
        ingredients: ["4 oz tofu", "2 cups mixed vegetables", "1 tbsp olive oil", "1 tsp herbs and spices", "1/2 cup brown rice"],
        prepTime: "20 minutes",
        nutritionFacts: {
          calories: 380,
          protein: "22g",
          carbs: "35g",
          fats: "15g"
        }
      }
    ],
    tips: [
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Eat slowly and mindfully to better recognize fullness signals",
      "Aim for a colorful plate to ensure varied nutrient intake",
      "Prepare meals in advance to avoid unhealthy convenience options"
    ]
  };
  
  export const sampleWorkoutPlan = {
    name: "Beginner Weight Loss Circuit",
    duration: "30",
    exercises: [
      {
        name: "Bodyweight Squats",
        sets: 3,
        reps: 12,
        restTime: "30",
        description: "Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing position."
      },
      {
        name: "Modified Push-ups",
        sets: 3,
        reps: 8,
        restTime: "30",
        description: "Place hands shoulder-width apart on elevated surface (counter, bench), lower chest toward surface, then push back up."
      },
      {
        name: "Resistance Band Rows",
        sets: 3,
        reps: 12,
        restTime: "30",
        description: "Secure band to door handle, hold ends with arms extended, pull band toward body keeping elbows close to sides."
      },
      {
        name: "Glute Bridges",
        sets: 3,
        reps: 15,
        restTime: "30",
        description: "Lie on back with knees bent, feet flat on floor. Push through heels to lift hips toward ceiling, then lower."
      },
      {
        name: "Standing Lateral Raises",
        sets: 3,
        reps: 10,
        restTime: "30",
        description: "Hold resistance bands or light dumbbells at sides, raise arms out to shoulder height, then lower slowly."
      }
    ],
    tips: [
      "Focus on proper form rather than speed",
      "Breathe out during the exertion phase of each exercise",
      "If you can't complete all reps, that's okay - build up gradually",
      "Try to increase either reps or resistance each week for progression"
    ]
  };
  
  export const sampleFeedback = {
    feedback: "You're making steady progress! You've completed 3 workouts and followed 7 meals from your plan.",
    suggestions: [
      "Try to increase your workout frequency to 4 times per week",
      "Consider adding more protein to your breakfast to feel fuller longer",
      "Track your water intake to ensure proper hydration"
    ],
    nextSteps: "Focus on consistency with your workouts this week, and try to prepare your lunches in advance to avoid unplanned meals."
  };