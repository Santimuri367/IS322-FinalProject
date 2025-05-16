import React from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Title, List, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import MealCard from '../components/nutrition/MealCard';

function NutritionHub({ navigation }) {
  const { nutritionPlan, progress, setProgress, loading } = useUser();
  
  // Handle when user marks a meal as completed
  const handleMealComplete = (index) => {
    setProgress(prev => ({
      ...prev,
      mealsFollowed: prev.mealsFollowed + 1,
      lastUpdated: new Date().toISOString()
    }));
    
    // Show feedback (you could use a proper toast library in a real app)
    alert('Great job! Your progress has been updated.');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading your nutrition plan...</Text>
      </View>
    );
  }
  
  if (!nutritionPlan) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Nutrition Plan Available</Text>
          <Text style={styles.emptyText}>You need to complete your profile first.</Text>
          <Button 
            mode="contained" 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Onboarding')}
          >
            Set Up Your Profile
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Title style={styles.heading}>Your Nutrition Plan</Title>
        
        <View style={styles.tipsContainer}>
          <Title style={styles.tipsTitle}>Nutrition Tips</Title>
          <List.Section style={styles.tipsList}>
            {nutritionPlan.tips.map((tip, index) => (
              <List.Item
                key={index}
                title={tip}
                left={props => <List.Icon {...props} icon="lightbulb-outline" />}
                titleStyle={styles.tipText}
                titleNumberOfLines={3}
                style={styles.tipItem}
              />
            ))}
          </List.Section>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            icon="food-variant"
            style={styles.plannerButton}
            onPress={() => navigation.navigate('Meal Planner')}
          >
            Customize Meal Plan
          </Button>
        </View>
        
        <Title style={styles.mealsTitle}>Today's Meals</Title>
        
        {nutritionPlan.dailyMeals.map((meal, index) => (
          <MealCard 
            key={index} 
            meal={meal} 
            onMarkComplete={() => handleMealComplete(index)} 
          />
        ))}
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 16,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  tipsList: {
    marginTop: 0,
    paddingTop: 0,
  },
  tipItem: {
    paddingVertical: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  plannerButton: {
    backgroundColor: '#10B981',  // Different color to stand out
  },
  mealsTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
});

export default NutritionHub;