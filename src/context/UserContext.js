import React, { createContext, useContext } from 'react';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { demoPreferences } from '../utils/samplePreferences';

const UserContext = createContext();

// Use this for development to skip onboarding
const USE_DEMO_PREFS = false;

export function UserProvider({ children }) {
  // Then update the userPreferences initialization
  const [userPreferences, setUserPreferences, preferencesLoading] = useAsyncStorage(
    'userPreferences', 
    USE_DEMO_PREFS ? demoPreferences : {
      goal: '',
      fitnessLevel: '',
      equipment: '',
      dietaryPreferences: [],
      timeAvailability: {
        workout: '',
        mealPrep: ''
      }
    }
  );
  
  const [nutritionPlan, setNutritionPlan, nutritionLoading] = useAsyncStorage('nutritionPlan', null);
  const [workoutPlan, setWorkoutPlan, workoutLoading] = useAsyncStorage('workoutPlan', null);
  const [progress, setProgress, progressLoading] = useAsyncStorage('progress', {
    workoutsCompleted: 0,
    mealsFollowed: 0,
    lastUpdated: null
  });

  const updateUserPreferences = (newPreferences) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const loading = preferencesLoading || nutritionLoading || workoutLoading || progressLoading;

  const value = {
    userPreferences,
    updateUserPreferences,
    nutritionPlan,
    setNutritionPlan,
    workoutPlan,
    setWorkoutPlan,
    progress,
    setProgress,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}