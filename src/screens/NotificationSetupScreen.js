import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Switch,
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { 
  Title, 
  Text, 
  Button, 
  Card, 
  Divider,
  List,
  TextInput,
  useTheme,
  Chip,
  RadioButton,
  Avatar,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const NotificationSetupScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { workout } = route.params || { workout: [] };
  const { userPreferences } = useUser();
  
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState('weekly'); // 'daily', 'weekly'
  const [selectedDays, setSelectedDays] = useState([1, 3, 5]); // Monday, Wednesday, Friday (0 = Sunday)
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Additional state for AI-powered reminders
  const [notificationType, setNotificationType] = useState('standard');
  const [motivationStyle, setMotivationStyle] = useState('encouraging');
  const [reminderTone, setReminderTone] = useState('friendly');
  const [includeHealthTips, setIncludeHealthTips] = useState(true);
  const [includeProgressStats, setIncludeProgressStats] = useState(true);
  
  // Preview the AI-generated reminders
  const [workoutPreview, setWorkoutPreview] = useState('');
  const [mealPreview, setMealPreview] = useState('');
  const [generatingPreview, setGeneratingPreview] = useState(false);

  const days = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];
  
  // Load preview examples when options change
  useEffect(() => {
    if (enabled) {
      generateReminderPreviews();
    }
  }, [motivationStyle, reminderTone, includeHealthTips, includeProgressStats, notificationType, enabled]);
  
  const toggleDay = (dayId) => {
    setSelectedDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(id => id !== dayId);
      } else {
        return [...prev, dayId].sort();
      }
    });
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setNotificationTime(selectedTime);
    }
  };
  
  // Generate preview of reminders using simple templates based on user preferences
  const generateReminderPreviews = () => {
    setGeneratingPreview(true);
    
    // In a real app, you would call an API to generate these with OpenAI
    // For this example, we'll use templates based on the selected options
    
    // Get greeting based on tone
    const getGreeting = () => {
      switch (reminderTone) {
        case 'friendly': return 'Hey there! 👋';
        case 'motivational': return 'Let\'s crush it today! 💪';
        case 'professional': return 'Good day,';
        case 'humorous': return 'Guess what time it is? 🕒';
        default: return 'Hello!';
      }
    };
    
    // Get motivation based on style
    const getMotivation = () => {
      switch (motivationStyle) {
        case 'encouraging': return 'You\'re making great progress! Every workout counts.';
        case 'challenge': return 'Push yourself today - can you beat your last performance?';
        case 'scientific': return 'Research shows consistent exercise leads to 20% better long-term health outcomes.';
        case 'mindful': return 'Focus on how good your body feels during and after your workout today.';
        default: return 'Keep going with your fitness journey!';
      }
    };
    
    // Get health tip if enabled
    const getHealthTip = () => {
      if (!includeHealthTips) return '';
      
      const tips = [
        'Drinking water before meals can help reduce calorie intake.',
        'Taking short active breaks during work improves productivity and health.',
        'Getting 7-9 hours of sleep improves workout recovery and performance.',
        'Adding 5 minutes of stretching after workouts can improve flexibility by 30%.'
      ];
      
      return `\n\nTIP: ${tips[Math.floor(Math.random() * tips.length)]}`;
    };
    
    // Get progress stats if enabled
    const getProgressStats = () => {
      if (!includeProgressStats) return '';
      
      return '\n\nYour stats: 5 workouts completed this week (25% increase) | 12 meals on plan (80% adherence)';
    };
    
    // Generate workout reminder
    const workoutReminder = `${getGreeting()} Time for your ${userPreferences?.goal?.replace('_', ' ') || 'fitness'} workout!
    
${getMotivation()}${getHealthTip()}${getProgressStats()}

🏋️‍♀️ TAP TO OPEN YOUR WORKOUT PLAN`;
    
    // Generate meal reminder
    const mealReminder = `${getGreeting()} Don't forget your ${new Date().getHours() < 12 ? 'breakfast' : (new Date().getHours() < 17 ? 'lunch' : 'dinner')}!
    
Eating well is ${motivationStyle === 'scientific' ? 'scientifically proven to be' : 'just as'} important as exercise for your ${userPreferences?.goal?.replace('_', ' ') || 'fitness'} goals.${getHealthTip()}

🥗 TAP TO SEE YOUR MEAL PLAN`;
    
    // Set the previews with a slight delay to simulate API call
    setTimeout(() => {
      setWorkoutPreview(workoutReminder);
      setMealPreview(mealReminder);
      setGeneratingPreview(false);
    }, 1000);
  };
  
  const saveNotificationSettings = () => {
    // In a real app, you would save these settings to the user's profile
    // and set up actual notifications
    
    if (enabled) {
      if (selectedDays.length === 0) {
        Alert.alert('Error', 'Please select at least one day for notifications');
        return;
      }
      
      const timeString = notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const daysString = selectedDays.map(dayId => days.find(d => d.id === dayId).name).join(', ');
      
      Alert.alert(
        'AI Reminders Scheduled', 
        `You will receive personalized ${reminderTone} reminders on ${daysString} at ${timeString}.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Fitness Hub') }]
      );
    } else {
      Alert.alert(
        'Notifications Disabled',
        'You have chosen not to receive workout reminders.',
        [{ text: 'OK', onPress: () => navigation.navigate('Fitness Hub') }]
      );
    }
  };
  
  const renderNotificationPreview = (title, content, icon) => (
    <Surface style={styles.previewContainer}>
      <View style={styles.previewHeader}>
        <Avatar.Icon size={40} icon={icon} style={styles.previewIcon} />
        <View style={styles.previewHeaderText}>
          <Text style={styles.previewTitle}>FitCoach AI</Text>
          <Text style={styles.previewTime}>Just now</Text>
        </View>
      </View>
      <Text style={styles.previewContent}>{content}</Text>
    </Surface>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Title style={styles.heading}>AI Reminder Setup</Title>
          
          <Text style={styles.description}>
            Set up personalized AI-generated reminders to keep you on track with your fitness and nutrition goals.
            These reminders adapt to your preferences and progress.
          </Text>
          
          <View style={styles.cardContentWrapper}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Enable AI Reminders</Text>
                  <Switch 
                    value={enabled} 
                    onValueChange={setEnabled}
                    color={theme.colors.primary}
                  />
                </View>
                
                {enabled && (
                  <>
                    <Divider style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Reminder Frequency</Text>
                    <View style={styles.frequencyOptions}>
                      <Button 
                        mode={frequency === 'daily' ? 'contained' : 'outlined'} 
                        onPress={() => setFrequency('daily')}
                        style={styles.frequencyButton}
                      >
                        Daily
                      </Button>
                      <Button 
                        mode={frequency === 'weekly' ? 'contained' : 'outlined'} 
                        onPress={() => setFrequency('weekly')}
                        style={styles.frequencyButton}
                      >
                        Weekly
                      </Button>
                    </View>
                    
                    {frequency === 'weekly' && (
                      <>
                        <Text style={styles.sectionTitle}>Workout Days</Text>
                        <View style={styles.daysContainer}>
                          {days.map((day) => (
                            <Button
                              key={day.id}
                              mode={selectedDays.includes(day.id) ? 'contained' : 'outlined'}
                              onPress={() => toggleDay(day.id)}
                              style={styles.dayButton}
                              labelStyle={styles.dayButtonLabel}
                            >
                              {day.name.substring(0, 3)}
                            </Button>
                          ))}
                        </View>
                      </>
                    )}
                    
                    <Text style={styles.sectionTitle}>Reminder Time</Text>
                    <Button 
                      mode="outlined" 
                      onPress={() => setShowTimePicker(true)}
                      icon="clock-outline"
                      style={styles.timeButton}
                    >
                      {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Button>
                    
                    {showTimePicker && (
                      <DateTimePicker
                        value={notificationTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={handleTimeChange}
                      />
                    )}
                    
                    <Divider style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>AI Personalization</Text>
                    
                    <Text style={styles.subsectionTitle}>Notification Type</Text>
                    <RadioButton.Group
                      onValueChange={value => setNotificationType(value)}
                      value={notificationType}
                    >
                      <View style={styles.radioRow}>
                        <RadioButton value="standard" />
                        <Text style={styles.radioLabel}>
                          Standard (Push Notifications)
                        </Text>
                      </View>
                      <View style={styles.radioRow}>
                        <RadioButton value="email" />
                        <Text style={styles.radioLabel}>
                          Email Reminders
                        </Text>
                      </View>
                      <View style={styles.radioRow}>
                        <RadioButton value="both" />
                        <Text style={styles.radioLabel}>
                          Both Push & Email
                        </Text>
                      </View>
                    </RadioButton.Group>
                    
                    {(notificationType === 'email' || notificationType === 'both') && (
                      <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                      />
                    )}
                    
                    <Text style={styles.subsectionTitle}>Motivation Style</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScrollView}>
                      {[
                        { label: 'Encouraging', value: 'encouraging' },
                        { label: 'Challenge-based', value: 'challenge' },
                        { label: 'Scientific Facts', value: 'scientific' },
                        { label: 'Mindful Approach', value: 'mindful' }
                      ].map((option) => (
                        <Chip
                          key={option.value}
                          selected={motivationStyle === option.value}
                          onPress={() => setMotivationStyle(option.value)}
                          style={styles.styleChip}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </ScrollView>
                    
                    <Text style={styles.subsectionTitle}>Reminder Tone</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScrollView}>
                      {[
                        { label: 'Friendly', value: 'friendly', icon: 'emoticon-outline' },
                        { label: 'Motivational', value: 'motivational', icon: 'arm-flex' },
                        { label: 'Professional', value: 'professional', icon: 'briefcase-outline' },
                        { label: 'Humorous', value: 'humorous', icon: 'emoticon-cool-outline' }
                      ].map((option) => (
                        <Chip
                          key={option.value}
                          selected={reminderTone === option.value}
                          onPress={() => setReminderTone(option.value)}
                          style={styles.styleChip}
                          icon={option.icon}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </ScrollView>
                    
                    <Text style={styles.subsectionTitle}>Additional Content</Text>
                    <View style={styles.switchRow}>
                      <Text style={styles.settingLabel}>Include Health Tips</Text>
                      <Switch 
                        value={includeHealthTips} 
                        onValueChange={setIncludeHealthTips}
                        color={theme.colors.primary}
                      />
                    </View>
                    
                    <View style={styles.switchRow}>
                      <Text style={styles.settingLabel}>Include Progress Stats</Text>
                      <Switch 
                        value={includeProgressStats} 
                        onValueChange={setIncludeProgressStats}
                        color={theme.colors.primary}
                      />
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Reminder Previews</Text>
                    <Text style={styles.previewDescription}>
                      Here's how your AI-generated reminders will look:
                    </Text>
                    
                    {generatingPreview ? (
                      <View style={styles.loadingPreview}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#6B7280" />
                        <Text style={styles.loadingText}>Generating AI previews...</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.previewLabel}>Workout Reminder:</Text>
                        {renderNotificationPreview('Workout Reminder', workoutPreview, 'dumbbell')}
                        
                        <Text style={styles.previewLabel}>Meal Reminder:</Text>
                        {renderNotificationPreview('Meal Reminder', mealPreview, 'food-apple')}
                      </>
                    )}
                  </>
                )}
              </Card.Content>
            </Card>
          </View>
          
          <Button
            mode="contained"
            icon="bell-ring"
            onPress={saveNotificationSettings}
            style={styles.saveButton}
          >
            {enabled ? 'Set Up AI Reminders' : 'Skip Reminders'}
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
    paddingBottom: 24,
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
  cardContentWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingLabel: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#4B5563',
  },
  frequencyOptions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  frequencyButton: {
    flex: 1,
    marginRight: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dayButton: {
    margin: 4,
    minWidth: 0,
  },
  dayButtonLabel: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  timeButton: {
    marginTop: 8,
  },
  input: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  chipsScrollView: {
    marginBottom: 12,
  },
  styleChip: {
    marginRight: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  previewContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewIcon: {
    backgroundColor: '#4F46E5',
    marginRight: 12,
  },
  previewHeaderText: {
    flex: 1,
  },
  previewTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1F2937',
  },
  loadingPreview: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  }
});

export default NotificationSetupScreen;