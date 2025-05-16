import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Card, 
  Title, 
  Text, 
  Button, 
  Divider, 
  IconButton, 
  Avatar,
  ProgressBar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ExerciseItem from './ExerciseItem';

/**
 * WorkoutCard - A component that displays a workout plan with exercises
 * 
 * @param {Object} props
 * @param {Object} props.workout - Workout data object
 * @param {string} props.workout.name - Name of the workout
 * @param {string} props.workout.duration - Duration in minutes
 * @param {Array} props.workout.exercises - Array of exercise objects
 * @param {Array} props.workout.tips - Array of workout tips
 * @param {Function} props.onStart - Function to call when starting the workout
 * @param {Function} props.onComplete - Function to call when completing the workout
 * @param {boolean} props.active - Whether this workout is active
 */
function WorkoutCard({ workout, onStart, onComplete, active = false }) {
  const [expanded, setExpanded] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  
  // Calculate total exercises and workout progress
  const totalExercises = workout?.exercises?.length || 0;
  const progress = totalExercises > 0 ? currentExercise / totalExercises : 0;
  
  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setCurrentExercise(0);
    if (onStart) {
      onStart();
    }
  };
  
  const handleCompleteWorkout = () => {
    setWorkoutCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleNextExercise = () => {
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      handleCompleteWorkout();
    }
  };
  
  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };
  
  // Get icon for active workout
  const renderWorkoutIcon = () => (
    <Avatar.Icon 
      size={36} 
      icon="dumbbell" 
      style={styles.workoutIcon} 
      color="white"
    />
  );
  
  // Render the workout in progress state
  const renderWorkoutInProgress = () => (
    <>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Exercise {currentExercise + 1} of {totalExercises}
        </Text>
        <ProgressBar 
          progress={progress} 
          color="#10B981" 
          style={styles.progressBar} 
        />
      </View>
      
      <View style={styles.currentExerciseContainer}>
        {workout?.exercises && workout.exercises[currentExercise] && (
          <Card style={styles.currentExerciseCard}>
            <Card.Content>
              <Title style={styles.exerciseTitle}>
                {workout.exercises[currentExercise].name}
              </Title>
              
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseInstruction}>
                  {workout.exercises[currentExercise].sets} sets × {workout.exercises[currentExercise].reps}
                </Text>
                <Text style={styles.exerciseDetail}>
                  Rest: {workout.exercises[currentExercise].restTime} seconds
                </Text>
              </View>
              
              <Text style={styles.exerciseDescription}>
                {workout.exercises[currentExercise].description}
              </Text>
            </Card.Content>
          </Card>
        )}
        
        <View style={styles.navigationButtons}>
          <Button
            mode="outlined"
            onPress={handlePreviousExercise}
            style={styles.navButton}
            icon="arrow-left"
            disabled={currentExercise === 0}
          >
            Prev
          </Button>
          
          {currentExercise < totalExercises - 1 ? (
            <Button
              mode="contained"
              onPress={handleNextExercise}
              style={[styles.navButton, styles.nextButton]}
              icon="arrow-right"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleCompleteWorkout}
              style={[styles.navButton, styles.completeButton]}
              icon="check"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              Complete
            </Button>
          )}
        </View>
      </View>
    </>
  );
  
  // Render completed state
  const renderWorkoutCompleted = () => (
    <View style={styles.completedContainer}>
      <MaterialCommunityIcons name="check-circle-outline" size={48} color="#10B981" />
      <Title style={styles.completedTitle}>Workout Completed!</Title>
      <Text style={styles.completedText}>
        Great job! You've completed all {totalExercises} exercises.
      </Text>
    </View>
  );
  
  // Render initial workout card state
  const renderWorkoutOverview = () => (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {renderWorkoutIcon()}
          <View style={styles.headerTextContainer}>
            <Title style={styles.title}>{workout?.name}</Title>
            <Text style={styles.subtitle}>
              {workout?.duration} mins • {totalExercises} exercises
            </Text>
          </View>
        </View>
      </View>
      
      {expanded && (
        <>
          <Divider style={styles.divider} />
          
          {workout?.tips && workout.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips:</Text>
              {workout.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#F59E0B" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
          
          <Text style={styles.exercisesTitle}>Exercises:</Text>
          {workout?.exercises && workout.exercises.map((exercise, index) => (
            <ExerciseItem key={index} exercise={exercise} />
          ))}
        </>
      )}
      
      <View style={styles.cardActions}>
        <Button 
          mode="contained" 
          icon="play"
          onPress={handleStartWorkout}
          style={styles.startButton}
        >
          Start Workout
        </Button>
        
        <IconButton
          icon={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          onPress={() => setExpanded(!expanded)}
          style={styles.expandButton}
        />
      </View>
    </>
  );
  
  return (
    <Card style={[styles.card, active && styles.activeCard]}>
      <Card.Content style={styles.cardContent}>
        {workoutCompleted ? (
          renderWorkoutCompleted()
        ) : workoutStarted ? (
          renderWorkoutInProgress()
        ) : (
          renderWorkoutOverview()
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardContent: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    backgroundColor: '#4F46E5',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    marginVertical: 12,
  },
  tipsContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  exercisesTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  startButton: {
    flex: 1,
    marginRight: 8,
  },
  expandButton: {
    margin: 0,
  },
  // Workout in progress styles
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  currentExerciseContainer: {
    marginBottom: 16,
  },
  currentExerciseCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  exerciseTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exerciseInstruction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: '#3B82F6',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  // Completed workout styles
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#10B981',
  },
  completedText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#4B5563',
  }
});

export default WorkoutCard;