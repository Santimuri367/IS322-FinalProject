
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { 
  Title, 
  Text, 
  Button, 
  Card, 
  Avatar,
  useTheme,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import ProgressCircle from '../components/ui/ProgressCircle';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not recorded';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

function ProgressTrackerScreen({ navigation }) {
  const theme = useTheme();
  const { progress, setProgress } = useUser();
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [bodyMetrics, setBodyMetrics] = useState({
    weight: 75.2,
    previousWeight: 76.8,
    bodyFat: 22,
    previousBodyFat: 24,
    lastUpdated: new Date().toISOString()
  });
  
  // Load mock analysis result
  useEffect(() => {
    // In a real app, this would be fetched from an API
    // based on the user's progress data
    const mockAnalysisResult = {
      progressPercentage: 65,
      changes: [
        "Noticeable reduction in body fat percentage",
        "Improved muscle definition in shoulders and arms",
        "Visible progress in core definition",
        "Overall improved posture"
      ],
      recommendations: [
        "Continue with your current strength training routine",
        "Consider increasing protein intake to support muscle growth",
        "Add one more cardio session per week for additional fat loss"
      ]
    };
    
    setAnalysisResult(mockAnalysisResult);
  }, []);
  
  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset your progress? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            setProgress({
              workoutsCompleted: 0,
              mealsFollowed: 0,
              lastUpdated: new Date().toISOString()
            });
            Alert.alert('Progress Reset', 'Your progress has been reset.');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Title style={styles.heading}>Track Your Progress</Title>
        
        <Text style={styles.description}>
          Track your workouts, meals, and see your transformation over time.
        </Text>
        
        {/* Progress Tracker Component */}
        <ProgressTracker navigation={navigation} />
        
        {/* Body Metrics Card */}
        <Card style={styles.metricsCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Title style={styles.cardTitle}>Body Metrics</Title>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Body Transformation')}
                style={styles.updateButton}
              >
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Weight</Text>
                <View style={styles.metricValueContainer}>
                  <Text style={styles.metricValue}>{bodyMetrics.weight} kg</Text>
                  <View style={styles.changeContainer}>
                    <MaterialCommunityIcons 
                      name={bodyMetrics.weight < bodyMetrics.previousWeight ? "arrow-down" : "arrow-up"} 
                      size={16} 
                      color={bodyMetrics.weight < bodyMetrics.previousWeight ? "#10B981" : "#EF4444"} 
                    />
                    <Text style={[
                      styles.changeText, 
                      { color: bodyMetrics.weight < bodyMetrics.previousWeight ? "#10B981" : "#EF4444" }
                    ]}>
                      {Math.abs(bodyMetrics.weight - bodyMetrics.previousWeight).toFixed(1)} kg
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Body Fat %</Text>
                <View style={styles.metricValueContainer}>
                  <Text style={styles.metricValue}>{bodyMetrics.bodyFat}%</Text>
                  <View style={styles.changeContainer}>
                    <MaterialCommunityIcons 
                      name={bodyMetrics.bodyFat < bodyMetrics.previousBodyFat ? "arrow-down" : "arrow-up"} 
                      size={16} 
                      color={bodyMetrics.bodyFat < bodyMetrics.previousBodyFat ? "#10B981" : "#EF4444"} 
                    />
                    <Text style={[
                      styles.changeText, 
                      { color: bodyMetrics.bodyFat < bodyMetrics.previousBodyFat ? "#10B981" : "#EF4444" }
                    ]}>
                      {Math.abs(bodyMetrics.bodyFat - bodyMetrics.previousBodyFat)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.lastUpdatedText}>
              Last updated: {formatDate(bodyMetrics.lastUpdated)}
            </Text>
          </Card.Content>
        </Card>
        
        {/* AI Analysis Card */}
        {analysisResult && (
          <Card style={styles.analysisCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>AI Coach Analysis</Title>
              
              <View style={styles.analysisSection}>
                <Avatar.Icon 
                  size={60} 
                  icon="robot" 
                  style={[styles.analysisIcon, {backgroundColor: theme.colors.primary}]} 
                  color="white"
                />
                
                <View style={styles.analysisTextContainer}>
                  <Text style={styles.analysisSummary}>
                    Based on your workout and nutrition data, you're making excellent progress!
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Changes Observed:</Text>
              {analysisResult.changes.map((change, index) => (
                <View key={index} style={styles.bulletItem}>
                  <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
                  <Text style={styles.bulletText}>{change}</Text>
                </View>
              ))}
              
              <Text style={styles.sectionTitle}>Recommendations:</Text>
              {analysisResult.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.bulletItem}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#4F46E5" />
                  <Text style={styles.bulletText}>{recommendation}</Text>
                </View>
              ))}
              
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={() => {
                  // In a real app, would refresh the analysis
                  Alert.alert('Analysis Updated', 'Your progress analysis has been refreshed.');
                }}
              >
                Refresh Analysis
              </Button>
            </Card.Content>
          </Card>
        )}
        
        {/* Achievements Card */}
        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Achievements</Title>
            
            <View style={styles.achievementItem}>
              <MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />
              <View style={styles.achievementTextContainer}>
                <Text style={styles.achievementTitle}>First Week Completed</Text>
                <Text style={styles.achievementDescription}>
                  Completed your first week of consistent workouts and meal plan
                </Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <MaterialCommunityIcons name="medal" size={24} color="#8B5CF6" />
              <View style={styles.achievementTextContainer}>
                <Text style={styles.achievementTitle}>Nutrition Master</Text>
                <Text style={styles.achievementDescription}>
                  Followed your meal plan for 5 consecutive days
                </Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <MaterialCommunityIcons name="star" size={24} color="#EC4899" />
              <View style={styles.achievementTextContainer}>
                <Text style={styles.achievementTitle}>Workout Warrior</Text>
                <Text style={styles.achievementDescription}>
                  Completed 10 workouts in your fitness journey
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Body Transformation Button */}
        <Button 
          mode="contained" 
          icon="account-convert" 
          style={styles.transformationButton}
          onPress={() => navigation.navigate('Body Transformation')}
        >
          Try Body Transformation
        </Button>
        
        {/* Reset Progress Button (with confirmation) */}
        <Button 
          mode="outlined" 
          icon="refresh" 
          style={styles.resetButton}
          onPress={handleResetProgress}
        >
          Reset Progress
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  metricsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
  },
  updateButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  updateText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  analysisCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  analysisSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  analysisIcon: {
    marginRight: 16,
  },
  analysisTextContainer: {
    flex: 1,
  },
  analysisSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletText: {
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 16,
  },
  achievementsCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  achievementTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  transformationButton: {
    marginBottom: 16,
    backgroundColor: '#8B5CF6',  // Different color to differentiate
  },
  resetButton: {
    marginBottom: 16,
  }
});

export default ProgressTrackerScreen;