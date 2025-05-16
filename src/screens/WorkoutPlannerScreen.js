import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { 
  Title, 
  Text, 
  Button, 
  Chip, 
  Card, 
  Checkbox,
  Divider,
  IconButton,
  useTheme,
  SegmentedButtons,
  DataTable
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

// Sample exercises organized by body part
const exercisesByBodyPart = {
  chest: [
    { id: 'c1', name: 'Bench Press', sets: 3, reps: 10, difficulty: 'Intermediate' },
    { id: 'c2', name: 'Push-ups', sets: 3, reps: 15, difficulty: 'Beginner' },
    { id: 'c3', name: 'Dumbbell Flyes', sets: 3, reps: 12, difficulty: 'Intermediate' },
    { id: 'c4', name: 'Incline Press', sets: 3, reps: 8, difficulty: 'Advanced' },
  ],
  back: [
    { id: 'b1', name: 'Pull-ups', sets: 3, reps: 8, difficulty: 'Intermediate' },
    { id: 'b2', name: 'Bent Over Rows', sets: 3, reps: 12, difficulty: 'Intermediate' },
    { id: 'b3', name: 'Lat Pulldowns', sets: 3, reps: 12, difficulty: 'Beginner' },
    { id: 'b4', name: 'Deadlifts', sets: 3, reps: 8, difficulty: 'Advanced' },
  ],
  shoulders: [
    { id: 's1', name: 'Overhead Press', sets: 3, reps: 10, difficulty: 'Intermediate' },
    { id: 's2', name: 'Lateral Raises', sets: 3, reps: 15, difficulty: 'Beginner' },
    { id: 's3', name: 'Front Raises', sets: 3, reps: 12, difficulty: 'Beginner' },
    { id: 's4', name: 'Face Pulls', sets: 3, reps: 15, difficulty: 'Intermediate' },
  ],
  biceps: [
    { id: 'bi1', name: 'Barbell Curls', sets: 3, reps: 12, difficulty: 'Beginner' },
    { id: 'bi2', name: 'Hammer Curls', sets: 3, reps: 12, difficulty: 'Beginner' },
    { id: 'bi3', name: 'Preacher Curls', sets: 3, reps: 10, difficulty: 'Intermediate' },
    { id: 'bi4', name: 'Concentration Curls', sets: 3, reps: 12, difficulty: 'Beginner' },
  ],
  triceps: [
    { id: 't1', name: 'Tricep Dips', sets: 3, reps: 12, difficulty: 'Intermediate' },
    { id: 't2', name: 'Tricep Pushdowns', sets: 3, reps: 15, difficulty: 'Beginner' },
    { id: 't3', name: 'Skull Crushers', sets: 3, reps: 10, difficulty: 'Intermediate' },
    { id: 't4', name: 'Overhead Tricep Extension', sets: 3, reps: 12, difficulty: 'Beginner' },
  ],
  legs: [
    { id: 'l1', name: 'Squats', sets: 3, reps: 10, difficulty: 'Intermediate' },
    { id: 'l2', name: 'Lunges', sets: 3, reps: 12, difficulty: 'Beginner' },
    { id: 'l3', name: 'Leg Press', sets: 3, reps: 12, difficulty: 'Intermediate' },
    { id: 'l4', name: 'Calf Raises', sets: 3, reps: 20, difficulty: 'Beginner' },
  ],
  abs: [
    { id: 'a1', name: 'Crunches', sets: 3, reps: 20, difficulty: 'Beginner' },
    { id: 'a2', name: 'Leg Raises', sets: 3, reps: 15, difficulty: 'Intermediate' },
    { id: 'a3', name: 'Planks', sets: 3, reps: '30 seconds', difficulty: 'Beginner' },
    { id: 'a4', name: 'Russian Twists', sets: 3, reps: 20, difficulty: 'Intermediate' },
  ],
  cardio: [
    { id: 'ca1', name: 'Treadmill', sets: 1, reps: '20 minutes', difficulty: 'Beginner' },
    { id: 'ca2', name: 'Jump Rope', sets: 3, reps: '5 minutes', difficulty: 'Intermediate' },
    { id: 'ca3', name: 'Cycling', sets: 1, reps: '30 minutes', difficulty: 'Beginner' },
    { id: 'ca4', name: 'HIIT Circuit', sets: 5, reps: '1 minute work, 30s rest', difficulty: 'Advanced' },
  ],
};

// Define body part categories with their icons
const bodyParts = [
  { id: 'chest', name: 'Chest', icon: 'pectorals' },
  { id: 'back', name: 'Back', icon: 'human-handsup' },
  { id: 'shoulders', name: 'Shoulders', icon: 'arm-flex' },
  { id: 'biceps', name: 'Biceps', icon: 'arm-flex-outline' },
  { id: 'triceps', name: 'Triceps', icon: 'arm-flex-outline' },
  { id: 'legs', name: 'Legs', icon: 'human-male' },
  { id: 'abs', name: 'Abs', icon: 'stomach' },
  { id: 'cardio', name: 'Cardio', icon: 'run' },
];

// Days of the week
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const WorkoutPlannerScreen = ({ navigation }) => {
  const theme = useTheme();
  const { workoutPlan, setWorkoutPlan } = useUser();
  
  const [plannerMode, setPlannerMode] = useState('day');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedBodyPart, setSelectedBodyPart] = useState('chest');
  const [selectedExercises, setSelectedExercises] = useState({});
  const [weeklyWorkoutPlan, setWeeklyWorkoutPlan] = useState(() => {
    // Initialize with empty plan for each day
    const plan = {};
    days.forEach(day => {
      plan[day] = [];
    });
    return plan;
  });
  
  // Add state to track which exercise items are selected
  const [checkboxStates, setCheckboxStates] = useState({});
  
  // Update checkbox states when selected exercises change
  useEffect(() => {
    // Create a mapping of exercise IDs to boolean selection state
    const newCheckboxStates = {};
    Object.keys(selectedExercises).forEach(exerciseId => {
      newCheckboxStates[exerciseId] = true;
    });
    setCheckboxStates(newCheckboxStates);
  }, [selectedExercises]);
  
  // Toggle exercise selection with improved handling
  const toggleExerciseSelection = (exercise) => {
    console.log('Toggling exercise:', exercise.id); // Debug log
    
    setSelectedExercises(prev => {
      const newState = { ...prev };
      
      if (newState[exercise.id]) {
        // If already selected, remove it
        delete newState[exercise.id];
        console.log(`Removed exercise ${exercise.id}`); // Debug log
      } else {
        // If not selected, add it
        newState[exercise.id] = { 
          ...exercise, 
          bodyPart: selectedBodyPart,
          id: `${exercise.id}-${Date.now()}` // Add timestamp to ensure unique ID
        };
        console.log(`Added exercise ${exercise.id}`); // Debug log
      }
      
      return newState;
    });
    
    // Explicitly toggle checkbox state as well
    setCheckboxStates(prev => ({
      ...prev,
      [exercise.id]: !prev[exercise.id]
    }));
  };
  
  const addToWorkoutPlan = () => {
    // Add with default sets and reps
    const exercisesToAdd = Object.values(selectedExercises);
    console.log('Exercises to add:', exercisesToAdd.length); // Debug log
    
    if (exercisesToAdd.length === 0) {
      Alert.alert('No Exercises Selected', 'Please select at least one exercise to add to your workout.');
      return;
    }
    
    setWeeklyWorkoutPlan(prev => {
      const currentDayExercises = prev[selectedDay] || [];
      const updatedPlan = {
        ...prev,
        [selectedDay]: [...currentDayExercises, ...exercisesToAdd]
      };
      console.log(`Updated plan for ${selectedDay}:`, updatedPlan[selectedDay].length); // Debug log
      return updatedPlan;
    });
    
    // Clear selections after adding to plan
    setSelectedExercises({});
    setCheckboxStates({});
    
    // Show success message
    Alert.alert('Success', `Added ${exercisesToAdd.length} exercise(s) to your ${selectedDay} workout.`);
  };
  
  const removeExerciseFromDay = (day, exerciseId) => {
    setWeeklyWorkoutPlan(prev => ({
      ...prev,
      [day]: prev[day].filter(exercise => exercise.id !== exerciseId)
    }));
  };
  
  const saveWorkoutPlan = () => {
    // Check if there are any exercises in the plan
    const hasExercises = Object.values(weeklyWorkoutPlan).some(dayPlan => dayPlan.length > 0);
    
    if (!hasExercises) {
      Alert.alert('Empty Plan', 'Please add at least one exercise to your workout plan before saving.');
      return;
    }
    
    // In a real app, you would save this to the user's profile
    navigation.navigate('Setup Reminders', { workout: weeklyWorkoutPlan });
  };
  
  const getDayWorkoutSummary = (day) => {
    const exercises = weeklyWorkoutPlan[day];
    if (exercises.length === 0) return 'Rest day';
    
    // Get unique body parts
    const bodyPartCounts = {};
    exercises.forEach(exercise => {
      const bodyPart = exercise.bodyPart;
      bodyPartCounts[bodyPart] = (bodyPartCounts[bodyPart] || 0) + 1;
    });
    
    // Format the summary
    return Object.entries(bodyPartCounts)
      .map(([part, count]) => {
        const bodyPartName = bodyParts.find(bp => bp.id === part)?.name || part;
        return `${bodyPartName} (${count})`;
      })
      .join(', ');
  };
  
  // Render an exercise item with improved touchability
  const renderExerciseItem = ({ item }) => (
    <Card 
      style={styles.exerciseCard}
      onPress={() => toggleExerciseSelection(item)} // Make the entire card touchable
    >
      <Card.Content>
        <View style={styles.exerciseRow}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.exerciseDetail}>{item.sets} sets × {item.reps}</Text>
              <Chip style={styles.difficultyChip}>{item.difficulty}</Chip>
            </View>
          </View>
          <Checkbox
            status={checkboxStates[item.id] ? 'checked' : 'unchecked'}
            onPress={() => toggleExerciseSelection(item)}
          />
        </View>
      </Card.Content>
    </Card>
  );
  
  const renderDayPlanner = () => (
    <>
      {/* Day Selection for Day Planner */}
      <Text style={styles.sectionTitle}>Select Day:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScrollView}>
        {days.map((day) => (
          <Chip
            key={day}
            selected={selectedDay === day}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.dayChip,
              selectedDay === day && { backgroundColor: theme.colors.primary }
            ]}
            textStyle={selectedDay === day ? { color: 'white' } : {}}
          >
            {day}
          </Chip>
        ))}
      </ScrollView>
      
      {/* Body Part Selection */}
      <Text style={styles.sectionTitle}>Select Body Part:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bodyPartScroll}>
        {bodyParts.map((part) => (
          <Chip
            key={part.id}
            icon={part.icon}
            selected={selectedBodyPart === part.id}
            onPress={() => setSelectedBodyPart(part.id)}
            style={[
              styles.bodyPartChip,
              selectedBodyPart === part.id && { backgroundColor: theme.colors.primary }
            ]}
            textStyle={selectedBodyPart === part.id ? { color: 'white' } : {}}
          >
            {part.name}
          </Chip>
        ))}
      </ScrollView>
      
      {/* Exercise Selection */}
      <Text style={styles.sectionTitle}>Available Exercises:</Text>
      <View>
        {exercisesByBodyPart[selectedBodyPart]?.map((exercise) => (
          <TouchableOpacity 
            key={exercise.id}
            onPress={() => toggleExerciseSelection(exercise)}
            activeOpacity={0.7}
          >
            {renderExerciseItem({ item: exercise })}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Add Button */}
      <Button
        mode="contained"
        icon="plus"
        onPress={addToWorkoutPlan}
        style={styles.addButton}
        disabled={Object.keys(selectedExercises).length === 0}
      >
        Add Selected Exercises to {selectedDay}
      </Button>
      
      {/* Current Day's Plan */}
      {weeklyWorkoutPlan[selectedDay].length > 0 && (
        <View style={styles.dayPlanContainer}>
          <Title style={styles.dayTitle}>{selectedDay}'s Workout</Title>
          
          {weeklyWorkoutPlan[selectedDay].map((exercise, index) => (
            <View style={styles.cardContentWrapper} key={`${exercise.id}-${index}`}>
              <Card style={styles.plannedExerciseCard}>
                <Card.Content>
                  <View style={styles.exerciseRow}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.exerciseDetail}>{exercise.sets} sets × {exercise.reps}</Text>
                        <Chip style={styles.bodyPartChip}>
                          {bodyParts.find(part => part.id === exercise.bodyPart)?.name || exercise.bodyPart}
                        </Chip>
                      </View>
                    </View>
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => removeExerciseFromDay(selectedDay, exercise.id)}
                    />
                  </View>
                </Card.Content>
              </Card>
            </View>
          ))}
        </View>
      )}
    </>
  );
  
  const renderWeeklyPlanner = () => (
    <View style={styles.weeklyPlanContainer}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Day</DataTable.Title>
          <DataTable.Title>Workout</DataTable.Title>
          <DataTable.Title numeric>Actions</DataTable.Title>
        </DataTable.Header>
        
        {days.map((day) => (
          <DataTable.Row key={day}>
            <DataTable.Cell>
              <Text style={styles.dayText}>{day}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.workoutSummary}>
                {getDayWorkoutSummary(day)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Button 
                mode="text" 
                icon="pencil" 
                onPress={() => {
                  setSelectedDay(day);
                  setPlannerMode('day');
                }}
                compact
              >
                Edit
              </Button>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Title style={styles.heading}>Workout Planner</Title>
          
          <Text style={styles.description}>
            Plan your workouts for each day of the week.
            Select exercises for specific body parts to create a custom routine.
          </Text>
          
          {/* Mode Selector */}
          <SegmentedButtons
            value={plannerMode}
            onValueChange={setPlannerMode}
            buttons={[
              { value: 'day', label: 'Day View' },
              { value: 'week', label: 'Week View' }
            ]}
            style={styles.modeSelector}
          />
          
          {plannerMode === 'day' ? renderDayPlanner() : renderWeeklyPlanner()}
          
          {/* Save Button */}
          <Button
            mode="contained"
            icon="content-save"
            onPress={saveWorkoutPlan}
            style={styles.saveButton}
          >
            Save Workout Plan
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  modeSelector: {
    marginBottom: 16,
  },
  daysScrollView: {
    marginBottom: 16,
  },
  dayChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  bodyPartScroll: {
    marginBottom: 16,
  },
  bodyPartChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  cardContentWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  exerciseCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  difficultyChip: {
    backgroundColor: '#EEF2FF',
  },
  addButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  dayPlanContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  plannedExerciseCard: {
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
    borderRadius: 8,
  },
  bodyPartChip: {
    backgroundColor: '#E0E7FF',
  },
  weeklyPlanContainer: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayText: {
    fontWeight: '500',
  },
  workoutSummary: {
    fontSize: 12,
    lineHeight: 16,
    color: '#4B5563',
    flexWrap: 'wrap',
    flex: 1,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#10B981',
  },
});

export default WorkoutPlannerScreen;