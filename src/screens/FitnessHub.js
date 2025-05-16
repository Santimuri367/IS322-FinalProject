import React from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Title, Button, Chip, Card, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import ExerciseItem from '../components/fitness/ExerciseItem';

function FitnessHub({ navigation }) {
  const { workoutPlan, progress, setProgress, loading } = useUser();
  
  const handleWorkoutComplete = () => {
    setProgress(prev => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1,
      lastUpdated: new Date().toISOString()
    }));
    
    // Show feedback
    alert('Great job! Your workout has been logged.');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading your workout plan...</Text>
      </View>
    );
  }
  
  if (!workoutPlan) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Workout Plan Available</Text>
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
        <View style={styles.headerContainer}>
          <View>
            <Title style={styles.heading}>{workoutPlan.name}</Title>
          </View>
          <Chip icon="clock-outline" style={styles.durationChip}>
            {workoutPlan.duration} mins
          </Chip>
        </View>
        
        <Card style={styles.tipsCard}>
          <View style={styles.cardContentWrapper}>
            <Card.Content>
              <Title style={styles.tipsTitle}>Workout Tips</Title>
              <List.Section style={styles.tipsList}>
                {workoutPlan.tips.map((tip, index) => (
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
            </Card.Content>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            icon="calendar-edit"
            style={styles.plannerButton}
            onPress={() => navigation.navigate('Workout Planner')}
          >
            Plan Custom Workout
          </Button>
        </View>
        
        <Title style={styles.exercisesTitle}>Exercises</Title>
        
        <Card style={styles.exercisesCard}>
          <View style={styles.cardContentWrapper}>
            {workoutPlan.exercises.map((exercise, index) => (
              <ExerciseItem key={index} exercise={exercise} />
            ))}
          </View>
        </Card>
        
        <Button 
          mode="contained" 
          icon="check-circle"
          style={styles.completeButton}
          labelStyle={styles.completeButtonLabel}
          onPress={handleWorkoutComplete}
        >
          Complete Workout
        </Button>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  durationChip: {
    backgroundColor: '#4F46E5',
    paddingVertical: 4,
  },
  cardContentWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
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
  tipsCard: {
    marginBottom: 20,
    borderRadius: 12,
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
  exercisesTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  exercisesCard: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  completeButton: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  completeButtonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default FitnessHub;