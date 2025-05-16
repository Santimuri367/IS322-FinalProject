import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Button, Card, Title, Paragraph, RadioButton, Chip } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

function Onboarding({ navigation }) {
  const { updateUserPreferences } = useUser();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    goal: '',
    fitnessLevel: '',
    equipment: '',
    dietaryPreferences: [],
    timeAvailability: {
      workout: '',
      mealPrep: ''
    }
  });
  
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleComplete = () => {
    updateUserPreferences(formData);
    navigation.replace('MainApp');
  };

  const toggleDietaryPreference = (preference) => {
    setFormData(prev => {
      const currentPrefs = [...prev.dietaryPreferences];
      
      if (currentPrefs.includes(preference)) {
        return {
          ...prev,
          dietaryPreferences: currentPrefs.filter(pref => pref !== preference)
        };
      } else {
        return {
          ...prev,
          dietaryPreferences: [...currentPrefs, preference]
        };
      }
    });
  };
  
  const steps = [
    // Step 1: Welcome
    <View style={styles.stepContainer} key="welcome">
      <Title style={styles.title}>Welcome to FitCoach AI</Title>
      <Paragraph style={styles.paragraph}>
        Your personal AI-powered nutrition and fitness coach.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        Let's set up your profile to get personalized recommendations tailored just for you.
      </Paragraph>
      <Button 
        mode="contained" 
        style={styles.button}
        onPress={handleNext}
      >
        Get Started
      </Button>
    </View>,
    
    // Step 2: Fitness Goals
    <View style={styles.stepContainer} key="goals">
      <Title style={styles.title}>What's your primary fitness goal?</Title>
      
      <RadioButton.Group
        onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}
        value={formData.goal}
      >
        {[
          { label: 'Lose Weight', value: 'lose_weight' },
          { label: 'Build Muscle', value: 'build_muscle' },
          { label: 'Improve Overall Fitness', value: 'improve_fitness' },
          { label: 'Improve Health', value: 'improve_health' }
        ].map((option) => (
          <Card 
            key={option.value} 
            style={[
              styles.optionCard, 
              formData.goal === option.value && styles.selectedCard
            ]}
            onPress={() => setFormData(prev => ({ ...prev, goal: option.value }))}
          >
            <Card.Content style={styles.cardContent}>
              <RadioButton value={option.value} />
              <Paragraph style={styles.optionText}>{option.label}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </RadioButton.Group>
      
      <View style={styles.navigationButtons}>
        <Button 
          mode="outlined" 
          style={styles.backButton}
          onPress={handleBack}
        >
          Back
        </Button>
        <Button 
          mode="contained" 
          style={styles.nextButton}
          onPress={handleNext}
          disabled={!formData.goal}
        >
          Next
        </Button>
      </View>
    </View>,
    
    // Step 3: Fitness Level
    <View style={styles.stepContainer} key="level">
      <Title style={styles.title}>What's your current fitness level?</Title>
      
      <RadioButton.Group
        onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}
        value={formData.fitnessLevel}
      >
        {[
          { label: 'Beginner - New to exercise', value: 'beginner' },
          { label: 'Intermediate - Exercise regularly', value: 'intermediate' },
          { label: 'Advanced - Very experienced', value: 'advanced' }
        ].map((option) => (
          <Card 
            key={option.value} 
            style={[
              styles.optionCard, 
              formData.fitnessLevel === option.value && styles.selectedCard
            ]}
            onPress={() => setFormData(prev => ({ ...prev, fitnessLevel: option.value }))}
          >
            <Card.Content style={styles.cardContent}>
              <RadioButton value={option.value} />
              <Paragraph style={styles.optionText}>{option.label}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </RadioButton.Group>
      
      <View style={styles.navigationButtons}>
        <Button 
          mode="outlined" 
          style={styles.backButton}
          onPress={handleBack}
        >
          Back
        </Button>
        <Button 
          mode="contained" 
          style={styles.nextButton}
          onPress={handleNext}
          disabled={!formData.fitnessLevel}
        >
          Next
        </Button>
      </View>
    </View>,
    
    // Step 4: Equipment
    <View style={styles.stepContainer} key="equipment">
      <Title style={styles.title}>What equipment do you have access to?</Title>
      
      <RadioButton.Group
        onValueChange={(value) => setFormData(prev => ({ ...prev, equipment: value }))}
        value={formData.equipment}
      >
        {[
          { label: 'No Equipment (Bodyweight Only)', value: 'none' },
          { label: 'Minimal Equipment (Bands, Light Weights)', value: 'minimal' },
          { label: 'Home Gym Setup', value: 'home_gym' },
          { label: 'Full Gym Membership', value: 'full_gym' }
        ].map((option) => (
          <Card 
            key={option.value} 
            style={[
              styles.optionCard, 
              formData.equipment === option.value && styles.selectedCard
            ]}
            onPress={() => setFormData(prev => ({ ...prev, equipment: option.value }))}
          >
            <Card.Content style={styles.cardContent}>
              <RadioButton value={option.value} />
              <Paragraph style={styles.optionText}>{option.label}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </RadioButton.Group>
      
      <View style={styles.navigationButtons}>
        <Button 
          mode="outlined" 
          style={styles.backButton}
          onPress={handleBack}
        >
          Back
        </Button>
        <Button 
          mode="contained" 
          style={styles.nextButton}
          onPress={handleNext}
          disabled={!formData.equipment}
        >
          Next
        </Button>
      </View>
    </View>,
    
    // Step 5: Time Availability
    <View style={styles.stepContainer} key="time">
      <Title style={styles.title}>How much time can you dedicate?</Title>
      
      <Text style={styles.sectionTitle}>Time for workouts:</Text>
      <View style={styles.chipsContainer}>
        {['15', '30', '45', '60'].map((minutes) => (
          <Chip
            key={`workout-${minutes}`}
            selected={formData.timeAvailability.workout === minutes}
            onPress={() => setFormData(prev => ({
              ...prev,
              timeAvailability: {
                ...prev.timeAvailability,
                workout: minutes
              }
            }))}
            style={[
              styles.chip,
              formData.timeAvailability.workout === minutes && styles.selectedChip
            ]}
          >
            {minutes} minutes
          </Chip>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Time for meal prep:</Text>
      <View style={styles.chipsContainer}>
        {['15', '30', '45', '60'].map((minutes) => (
          <Chip
            key={`meal-${minutes}`}
            selected={formData.timeAvailability.mealPrep === minutes}
            onPress={() => setFormData(prev => ({
              ...prev,
              timeAvailability: {
                ...prev.timeAvailability,
                mealPrep: minutes
              }
            }))}
            style={[
              styles.chip,
              formData.timeAvailability.mealPrep === minutes && styles.selectedChip
            ]}
          >
            {minutes} minutes
          </Chip>
        ))}
      </View>
      
      <View style={styles.navigationButtons}>
        <Button 
          mode="outlined" 
          style={styles.backButton}
          onPress={handleBack}
        >
          Back
        </Button>
        <Button 
          mode="contained" 
          style={styles.nextButton}
          onPress={handleNext}
          disabled={!formData.timeAvailability.workout || !formData.timeAvailability.mealPrep}
        >
          Next
        </Button>
      </View>
    </View>,
    
    // Step 6: Dietary Preferences
    <View style={styles.stepContainer} key="diet">
      <Title style={styles.title}>Any dietary preferences?</Title>
      <Paragraph style={styles.paragraph}>Select all that apply</Paragraph>
      
      <View style={styles.chipsContainer}>
        {[
          { label: 'Vegetarian', value: 'vegetarian' },
          { label: 'Vegan', value: 'vegan' },
          { label: 'Gluten-Free', value: 'gluten_free' },
          { label: 'Dairy-Free', value: 'dairy_free' },
          { label: 'Keto', value: 'keto' },
          { label: 'Paleo', value: 'paleo' },
          { label: 'No Restrictions', value: 'none' }
        ].map((option) => (
          <Chip
            key={option.value}
            selected={formData.dietaryPreferences.includes(option.value)}
            onPress={() => toggleDietaryPreference(option.value)}
            style={[
              styles.chip,
              formData.dietaryPreferences.includes(option.value) && styles.selectedChip
            ]}
          >
            {option.label}
          </Chip>
        ))}
      </View>
      
      <View style={styles.navigationButtons}>
        <Button 
          mode="outlined" 
          style={styles.backButton}
          onPress={handleBack}
        >
          Back
        </Button>
        <Button 
          mode="contained" 
          style={styles.nextButton}
          onPress={handleNext}
        >
          Next
        </Button>
      </View>
    </View>,
    
    // Step 7: Final Step
    <View style={styles.stepContainer} key="final">
      <Title style={styles.title}>You're all set!</Title>
      <Paragraph style={styles.paragraph}>
        Based on your preferences, we'll create personalized nutrition and workout plans just for you.
      </Paragraph>
      <Button 
        mode="contained" 
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleComplete}
      >
        Get My Personalized Plan
      </Button>
    </View>,
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot,
                  currentStep >= index ? styles.progressDotActive : {}
                ]}
              />
            ))}
          </View>
          
          {steps[currentStep]}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
  optionCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  selectedCard: {
    borderColor: '#4F46E5',
    borderWidth: 2,
    backgroundColor: '#EEF2FF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#4F46E5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  selectedChip: {
    backgroundColor: '#4F46E5',
  },
});

export default Onboarding;