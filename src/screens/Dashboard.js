import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Title, Text, Button, Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import openAIService from '../services/openAIService';
import { sampleNutritionPlan, sampleWorkoutPlan, sampleFeedback } from '../utils/sampleData';

// Flag to use sample data
const USE_SAMPLE_DATA = true;

// Placeholder for hero banner (using a simple view with gradient instead of image)
const HeroBanner = ({ children }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.heroBanner, {backgroundColor: theme.colors.primary}]}>
      <View style={styles.overlay}>
        <Title style={styles.heroTitle}>Welcome to FitCoach AI</Title>
        {children}
      </View>
    </View>
  );
};

function Dashboard({ navigation }) {
  const theme = useTheme();
  const { 
    userPreferences, 
    nutritionPlan, 
    setNutritionPlan,
    workoutPlan,
    setWorkoutPlan,
    progress,
    loading: contextLoading
  } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      // Only fetch recommendations if they don't already exist
      if (!nutritionPlan || !workoutPlan) {
        setLoading(true);
        try {
          if (USE_SAMPLE_DATA) {
            // Use sample data with a slight delay to simulate API call
            setTimeout(() => {
              setNutritionPlan(sampleNutritionPlan);
              setWorkoutPlan(sampleWorkoutPlan);
              setLoading(false);
            }, 1500);
          } else {
            const data = await openAIService.getRecommendations(userPreferences);
            if (data) {
              setNutritionPlan(data.nutrition);
              setWorkoutPlan(data.workout);
            }
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          setLoading(false);
          
          // Fallback to sample data
          setNutritionPlan(sampleNutritionPlan);
          setWorkoutPlan(sampleWorkoutPlan);
        }
      }
    };
    
    const fetchFeedback = async () => {
      try {
        if (USE_SAMPLE_DATA) {
          setFeedback(sampleFeedback);
        } else {
          const data = await openAIService.getFeedback(userPreferences, progress);
          if (data) {
            setFeedback(data);
          }
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        // Fallback to sample feedback
        setFeedback(sampleFeedback);
      }
    };
    
    if (!contextLoading) {
      fetchRecommendations();
      fetchFeedback();
    }
  }, [
    userPreferences, 
    nutritionPlan, 
    setNutritionPlan, 
    workoutPlan, 
    setWorkoutPlan, 
    progress,
    contextLoading
  ]);
  
  if (contextLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Preparing your personalized plan...</Text>
      </View>
    );
  }
  
  // Calculate progress percentage
  const totalWorkoutsTarget = 12; // Example target
  const totalMealsTarget = 30; // Example target
  const progressPercentage = Math.round(
    ((progress.workoutsCompleted + progress.mealsFollowed) / (totalWorkoutsTarget + totalMealsTarget)) * 100
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Hero Banner */}
        <HeroBanner>
          <Text style={styles.heroText}>Your personalized fitness journey starts here</Text>
        </HeroBanner>
        
        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <View style={styles.progressCircleContainer}>
            <Text style={styles.progressPercentText}>{progressPercentage}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.workoutsCompleted}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.mealsFollowed}</Text>
                <Text style={styles.statLabel}>Meals</Text>
              </View>
            </View>
            <Button 
              mode="contained" 
              compact 
              style={styles.trackButton}
              onPress={() => navigation.navigate('Progress')}
            >
              Track Progress
            </Button>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Today's Plan Section */}
        <Title style={styles.sectionTitle}>Today's Plan</Title>
        
        {/* Workout Card */}
        {workoutPlan && (
          <TouchableOpacity 
            style={[styles.gradientCard, {backgroundColor: '#4338CA'}]} 
            onPress={() => navigation.navigate('Fitness')}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              <View style={styles.header}>
                <View>
                  <Title style={styles.cardTitle}>Today's Workout</Title>
                  <Text style={styles.cardSubtitle}>
                    {workoutPlan.duration} mins • {workoutPlan.exercises.length} exercises
                  </Text>
                </View>
                <MaterialCommunityIcons name="dumbbell" size={24} color="white" />
              </View>
              
              <View style={styles.exercisePreview}>
                {workoutPlan.exercises.slice(0, 3).map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <MaterialCommunityIcons name="circle-small" size={20} color="white" />
                    <Text style={styles.exerciseText}>{exercise.name} - {exercise.sets} × {exercise.reps}</Text>
                  </View>
                ))}
                {workoutPlan.exercises.length > 3 && (
                  <Text style={styles.moreExercises}>+{workoutPlan.exercises.length - 3} more exercises</Text>
                )}
              </View>
              
              <View style={styles.cardActions}>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('Fitness')}
                  style={styles.cardButton}
                  labelStyle={styles.cardButtonLabel}
                >
                  Start Workout
                </Button>
                <Button
                  mode="contained"
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Exercise Library')}
                  icon="playlist-edit"
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        
        {/* Nutrition Card */}
        {nutritionPlan && (
          <TouchableOpacity 
            style={[styles.gradientCard, {backgroundColor: '#047857'}]} 
            onPress={() => navigation.navigate('Nutrition')}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              <View style={styles.header}>
                <View>
                  <Title style={styles.cardTitle}>Today's Meals</Title>
                  <Text style={styles.cardSubtitle}>Balanced nutrition plan</Text>
                </View>
                <MaterialCommunityIcons name="food-variant" size={24} color="white" />
              </View>
              
              <View style={styles.mealsPreview}>
                {nutritionPlan.dailyMeals.map((meal, index) => (
                  <View key={index} style={styles.mealItem}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealCalories}>{meal.nutritionFacts.calories} cal</Text>
                  </View>
                ))}
              </View>
              
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Nutrition')}
                style={styles.cardButton}
                labelStyle={styles.cardButtonLabel}
              >
                View Meal Plan
              </Button>
            </View>
          </TouchableOpacity>
        )}
        
        {/* AI Coach Card */}
        <Button
          mode="outlined"
          icon="robot"
          style={styles.coachButton}
          contentStyle={styles.coachButtonContent}
          onPress={() => navigation.navigate('Coach')}
        >
          <View style={styles.coachTextContainer}>
            <Text style={styles.coachTitle}>FitCoach AI Assistant</Text>
            <Text style={styles.coachSubtitle}>
              Have questions? Need motivation? Chat with your AI coach!
            </Text>
          </View>
        </Button>
        
        {/* Feedback Card */}
        {feedback && (
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackHeader}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#4F46E5" />
              <Title style={styles.feedbackTitle}>Coach's Feedback</Title>
            </View>
            <Text style={styles.feedbackText}>{feedback.feedback}</Text>
            
            <View style={styles.suggestionsList}>
              {feedback.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color="#10B981" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.nextStepsContainer}>
              <Text style={styles.nextStepsLabel}>Focus for next steps:</Text>
              <Text style={styles.nextStepsText}>{feedback.nextSteps}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
  heroBanner: {
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  progressOverview: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  progressCircleContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStats: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressPercentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  trackButton: {
    borderRadius: 8,
  },
  divider: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gradientCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  exercisePreview: {
    marginTop: 8,
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseText: {
    color: 'white',
    fontSize: 14,
  },
  moreExercises: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 20,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'white',
    marginRight: 8,
  },
  cardButtonLabel: {
    color: 'white',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
  },
  mealsPreview: {
    marginTop: 8,
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mealCalories: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  coachButton: {
    marginBottom: 16,
    borderRadius: 12,
    height: 80,
  },
  coachButtonContent: {
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  coachTextContainer: {
    marginLeft: 8,
  },
  coachTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coachSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  feedbackContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    marginLeft: 8,
    fontSize: 18,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
    marginBottom: 16,
  },
  suggestionsList: {
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  suggestionText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  nextStepsContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  nextStepsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});

export default Dashboard;