import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { 
  Searchbar, 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  Button, 
  Text,
  Divider,
  FAB,
  Modal,
  Portal,
  IconButton,
  Avatar,
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

// Get exercise icon based on primary muscle
const getExerciseIcon = (primaryMuscle) => {
  const muscle = primaryMuscle.toLowerCase();
  if (muscle.includes('chest')) {
    return 'pectorals';
  } else if (muscle.includes('back')) {
    return 'human-handsup';
  } else if (muscle.includes('leg') || muscle.includes('quad') || muscle.includes('glute')) {
    return 'human-male';
  } else if (muscle.includes('shoulder')) {
    return 'arm-flex';
  } else if (muscle.includes('core') || muscle.includes('abs')) {
    return 'stomach';
  } else if (muscle.includes('arm') || muscle.includes('bicep') || muscle.includes('tricep')) {
    return 'arm-flex-outline';
  }
  return 'dumbbell';
};

// Sample exercise library - in a real app this would come from your backend
const exerciseLibrary = [
  {
    id: '1',
    name: 'Push-ups',
    category: 'Bodyweight',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    difficulty: 'Beginner',
    equipment: 'None',
    description: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    variations: [
      { id: '1a', name: 'Incline Push-ups', difficulty: 'Easier' },
      { id: '1b', name: 'Decline Push-ups', difficulty: 'Harder' },
      { id: '1c', name: 'Diamond Push-ups', difficulty: 'Harder' }
    ]
  },
  {
    id: '2',
    name: 'Squats',
    category: 'Bodyweight',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
    difficulty: 'Beginner',
    equipment: 'None',
    description: 'Stand with feet shoulder-width apart. Lower your body by bending knees and pushing hips back as if sitting in a chair. Return to standing position.',
    variations: [
      { id: '2a', name: 'Jump Squats', difficulty: 'Harder' },
      { id: '2b', name: 'Bulgarian Split Squats', difficulty: 'Harder' },
      { id: '2c', name: 'Goblet Squats', difficulty: 'Moderate', equipment: 'Dumbbell' }
    ]
  },
  {
    id: '3',
    name: 'Dumbbell Rows',
    category: 'Strength',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    description: 'Place one knee and hand on a bench, with the other foot on the floor. Hold a dumbbell in your free hand, pull it toward your hip while keeping your back flat.',
    variations: [
      { id: '3a', name: 'Bent Over Rows', difficulty: 'Similar' },
      { id: '3b', name: 'Renegade Rows', difficulty: 'Harder' }
    ]
  },
  {
    id: '4',
    name: 'Lunges',
    category: 'Bodyweight',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    difficulty: 'Beginner',
    equipment: 'None',
    description: 'Stand with feet hip-width apart. Step forward with one leg and lower your body until both knees are bent at 90-degree angles. Push back to starting position.',
    variations: [
      { id: '4a', name: 'Walking Lunges', difficulty: 'Similar' },
      { id: '4b', name: 'Reverse Lunges', difficulty: 'Similar' },
      { id: '4c', name: 'Jump Lunges', difficulty: 'Harder' }
    ]
  },
  {
    id: '5',
    name: 'Plank',
    category: 'Bodyweight',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Shoulders', 'Back'],
    difficulty: 'Beginner',
    equipment: 'None',
    description: 'Start in a forearm plank position with elbows directly beneath shoulders. Keep your body in a straight line from head to heels, engaging your core.',
    variations: [
      { id: '5a', name: 'Side Plank', difficulty: 'Similar' },
      { id: '5b', name: 'Plank with Shoulder Taps', difficulty: 'Harder' },
      { id: '5c', name: 'Plank Jacks', difficulty: 'Harder' }
    ]
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All' },
  { id: 'bodyweight', name: 'Bodyweight' },
  { id: 'strength', name: 'Strength' },
  { id: 'cardio', name: 'Cardio' },
  { id: 'flexibility', name: 'Flexibility' }
];

// Muscle groups for filtering
const muscleGroups = [
  { id: 'all', name: 'All Muscles' },
  { id: 'chest', name: 'Chest' },
  { id: 'back', name: 'Back' },
  { id: 'legs', name: 'Legs' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'arms', name: 'Arms' },
  { id: 'core', name: 'Core' }
];

function ExerciseLibraryScreen({ navigation }) {
  const theme = useTheme();
  const { workoutPlan, setWorkoutPlan } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exerciseLibrary);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [customWorkout, setCustomWorkout] = useState([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  
  // Filter exercises when search or filters change
  useEffect(() => {
    let results = exerciseLibrary;
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter(exercise => 
        exercise.name.toLowerCase().includes(lowerCaseQuery) ||
        exercise.category.toLowerCase().includes(lowerCaseQuery) ||
        exercise.primaryMuscle.toLowerCase().includes(lowerCaseQuery) ||
        exercise.secondaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(exercise => 
        exercise.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply muscle filter
    if (selectedMuscle !== 'all') {
      results = results.filter(exercise => 
        exercise.primaryMuscle.toLowerCase() === selectedMuscle.toLowerCase() ||
        exercise.secondaryMuscles.some(muscle => 
          muscle.toLowerCase() === selectedMuscle.toLowerCase()
        )
      );
    }
    
    setFilteredExercises(results);
  }, [searchQuery, selectedCategory, selectedMuscle]);
  
  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };
  
  const addToCustomWorkout = (exercise) => {
    // Add with default sets and reps
    setCustomWorkout(prev => [
      ...prev, 
      {
        ...exercise,
        customId: Date.now().toString(), // Unique ID for the custom workout entry
        sets: 3,
        reps: 12,
        restTime: '60'
      }
    ]);
    setModalVisible(false);
  };
  
  const removeFromCustomWorkout = (customId) => {
    setCustomWorkout(prev => prev.filter(ex => ex.customId !== customId));
  };
  
  const updateExerciseInCustomWorkout = (customId, field, value) => {
    setCustomWorkout(prev => prev.map(ex => 
      ex.customId === customId ? { ...ex, [field]: value } : ex
    ));
  };
  
  const saveCustomWorkout = () => {
    // Format exercises to match the structure expected by the app
    const formattedExercises = customWorkout.map(({ name, description, sets, reps, restTime }) => ({
      name,
      description,
      sets,
      reps,
      restTime
    }));
    
    // Create a new workout plan with the custom exercises
    const newWorkoutPlan = {
      ...workoutPlan,
      name: 'Custom Workout Plan',
      exercises: formattedExercises
    };
    
    // Update the workout plan in the user context
    setWorkoutPlan(newWorkoutPlan);
    
    // Alert user and navigate back
    alert('Your custom workout has been saved!');
    navigation.navigate('Fitness');
  };
  
  const renderExerciseItem = ({ item }) => {
    const icon = getExerciseIcon(item.primaryMuscle);
    
    return (
      <TouchableOpacity onPress={() => handleExercisePress(item)}>
        <Card style={styles.exerciseCard}>
          <View style={[styles.exerciseHeader, { backgroundColor: theme.colors.primary }]}>
            <Avatar.Icon 
              size={60} 
              icon={icon} 
              style={styles.exerciseIcon} 
              color="white"
            />
          </View>
          <Card.Content style={styles.exerciseContent}>
            <Title style={styles.exerciseTitle}>{item.name}</Title>
            <View style={styles.chipContainer}>
              <Chip style={styles.chip} textStyle={styles.chipText}>{item.category}</Chip>
              <Chip style={styles.chip} textStyle={styles.chipText}>{item.primaryMuscle}</Chip>
              <Chip style={styles.chip} textStyle={styles.chipText}>{item.difficulty}</Chip>
            </View>
            <Paragraph style={styles.exerciseDescription} numberOfLines={2}>
              {item.description}
            </Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search exercises"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Category:</Text>
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
              style={styles.filterChip}
              textStyle={selectedCategory === item.id ? styles.selectedChipText : styles.chipText}
            >
              {item.name}
            </Chip>
          )}
          contentContainerStyle={styles.filtersList}
        />
        
        <Text style={styles.filterLabel}>Muscle Group:</Text>
        <FlatList
          data={muscleGroups}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedMuscle === item.id}
              onPress={() => setSelectedMuscle(item.id)}
              style={styles.filterChip}
              textStyle={selectedMuscle === item.id ? styles.selectedChipText : styles.chipText}
            >
              {item.name}
            </Chip>
          )}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      <FlatList
        data={filteredExercises}
        keyExtractor={item => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.exerciseList}
      />
      
      {customWorkout.length > 0 && (
        <FAB
          style={styles.fab}
          icon="check"
          label={`Review Workout (${customWorkout.length})`}
          onPress={() => setSaveModalVisible(true)}
        />
      )}
      
      {/* Exercise Detail Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedExercise && (
            <ScrollView style={styles.modalContent}>
              <View style={[styles.modalImageContainer, { backgroundColor: theme.colors.primary }]}>
                <Avatar.Icon 
                  size={100} 
                  icon={getExerciseIcon(selectedExercise.primaryMuscle)} 
                  style={styles.modalIcon} 
                  color="white"
                />
              </View>
              
              <View style={styles.modalHeader}>
                <Title style={styles.modalTitle}>{selectedExercise.name}</Title>
                <IconButton
                  icon="close"
                  size={24}
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              
              <View style={styles.chipContainer}>
                <Chip style={styles.chip}>{selectedExercise.category}</Chip>
                <Chip style={styles.chip}>{selectedExercise.difficulty}</Chip>
                <Chip style={styles.chip}>{selectedExercise.equipment}</Chip>
              </View>
              
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Target Muscles</Text>
              <Text style={styles.primaryMuscle}>Primary: {selectedExercise.primaryMuscle}</Text>
              <Text style={styles.secondaryMuscles}>
                Secondary: {selectedExercise.secondaryMuscles.join(', ')}
              </Text>
              
              <Text style={styles.sectionTitle}>How to Perform</Text>
              <Text style={styles.modalDescription}>{selectedExercise.description}</Text>
              
              {selectedExercise.variations && selectedExercise.variations.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>Variations</Text>
                  {selectedExercise.variations.map(variation => (
                    <View key={variation.id} style={styles.variationItem}>
                      <Text style={styles.variationName}>{variation.name}</Text>
                      <Text style={styles.variationDifficulty}>
                        {variation.difficulty} {variation.equipment ? `(${variation.equipment})` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <Button 
                mode="contained" 
                onPress={() => addToCustomWorkout(selectedExercise)}
                style={styles.addButton}
              >
                Add to Workout
              </Button>
            </ScrollView>
          )}
        </Modal>
      </Portal>
      
      {/* Custom Workout Review Modal */}
      <Portal>
        <Modal
          visible={saveModalVisible}
          onDismiss={() => setSaveModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Title style={styles.modalTitle}>Your Custom Workout</Title>
              <IconButton
                icon="close"
                size={24}
                style={styles.closeButton}
                onPress={() => setSaveModalVisible(false)}
              />
            </View>
            
            <FlatList
              data={customWorkout}
              keyExtractor={item => item.customId}
              renderItem={({ item }) => (
                <Card style={styles.customExerciseCard}>
                  <Card.Content>
                    <View style={styles.customExerciseHeader}>
                      <Title style={styles.customExerciseTitle}>{item.name}</Title>
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => removeFromCustomWorkout(item.customId)}
                      />
                    </View>
                    
                    <View style={styles.exerciseSettings}>
                      <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Sets</Text>
                        <View style={styles.counterContainer}>
                          <IconButton
                            icon="minus"
                            size={20}
                            onPress={() => updateExerciseInCustomWorkout(
                              item.customId, 
                              'sets', 
                              Math.max(1, item.sets - 1)
                            )}
                          />
                          <Text style={styles.counterValue}>{item.sets}</Text>
                          <IconButton
                            icon="plus"
                            size={20}
                            onPress={() => updateExerciseInCustomWorkout(
                              item.customId, 
                              'sets', 
                              item.sets + 1
                            )}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Reps</Text>
                        <View style={styles.counterContainer}>
                          <IconButton
                            icon="minus"
                            size={20}
                            onPress={() => updateExerciseInCustomWorkout(
                              item.customId, 
                              'reps', 
                              Math.max(1, item.reps - 1)
                            )}
                          />
                          <Text style={styles.counterValue}>{item.reps}</Text>
                          <IconButton
                            icon="plus"
                            size={20}
                            onPress={() => updateExerciseInCustomWorkout(
                              item.customId, 
                              'reps', 
                              item.reps + 1
                            )}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Rest (sec)</Text>
                        <View style={styles.counterContainer}>
                          <IconButton
                            icon="minus"
                            size={20}
                            onPress={() => updateExerciseInCustomWorkout(
                              item.customId, 
                              'restTime', 
                              Math.max(10, parseInt(item.restTime) - 10).toString()
                            )}
                          />
                          <Text style={styles.counterValue}>{item.restTime}</Text>
                          <IconButton
                            icon="plus"
                            size={20}
                            onPress={() => updateExerciseInCustomWorkout(
                              item.customId, 
                              'restTime', 
                              (parseInt(item.restTime) + 10).toString()
                            )}
                          />
                        </View>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              )}
            />
            
            <Button 
              mode="contained" 
              onPress={saveCustomWorkout}
              style={styles.saveButton}
            >
              Save and Use This Workout
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
    backgroundColor: 'white',
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  filtersList: {
    paddingVertical: 4,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  chipText: {
    fontSize: 12,
  },
  selectedChipText: {
    fontSize: 12,
    color: 'white',
  },
  exerciseList: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80, // Space for FAB
  },
  exerciseCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseHeader: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIcon: {
    backgroundColor: 'transparent',
  },
  exerciseContent: {
    padding: 12,
  },
  exerciseTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#EEF2FF',
  },
  exerciseDescription: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4F46E5',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalContent: {
    padding: 16,
    maxHeight: '100%',
  },
  modalImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    backgroundColor: 'transparent',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
  },
  closeButton: {
    margin: 0,
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  primaryMuscle: {
    fontSize: 14,
  },
  secondaryMuscles: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4B5563',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  variationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  variationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  variationDifficulty: {
    fontSize: 12,
    color: '#6B7280',
  },
  addButton: {
    marginVertical: 20,
  },
  customExerciseCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  customExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customExerciseTitle: {
    fontSize: 16,
  },
  exerciseSettings: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  counterValue: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#10B981',
  },
});

export default ExerciseLibraryScreen;