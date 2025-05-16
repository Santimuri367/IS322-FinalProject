import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import ProgressCircle from '../ui/ProgressCircle';

function ProgressTracker({ navigation }) {
  const { progress, workoutPlan, nutritionPlan } = useUser();
  
  const [dateRange, setDateRange] = useState('week'); // 'week', 'month', 'all'
  const [progressData, setProgressData] = useState({
    workoutProgress: 0,
    nutritionProgress: 0,
    overallProgress: 0,
    workoutsPerWeek: 0,
    streakDays: 0
  });

  // Mock data for weekly activity (in a real app, this would come from a database)
  const mockWeeklyData = [
    { day: 'M', workouts: 1, meals: 3 },
    { day: 'T', workouts: 1, meals: 2 },
    { day: 'W', workouts: 0, meals: 3 },
    { day: 'T', workouts: 1, meals: 2 },
    { day: 'F', workouts: 0, meals: 3 },
    { day: 'S', workouts: 1, meals: 2 },
    { day: 'S', workouts: 0, meals: 1 },
  ];

  // Calculate progress metrics
  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    // and properly calculate based on user's activity history
    
    // For the demo, we'll use the progress from context
    const totalWorkoutsTarget = 12;
    const totalMealsTarget = 30;
    
    const workoutProgress = Math.min(100, Math.round((progress?.workoutsCompleted / totalWorkoutsTarget) * 100) || 0);
    const nutritionProgress = Math.min(100, Math.round((progress?.mealsFollowed / totalMealsTarget) * 100) || 0);
    const overallProgress = Math.round((workoutProgress + nutritionProgress) / 2);
    
    // Calculate workouts per week
    const workoutsCompleted = mockWeeklyData.filter(day => day.workouts > 0).length;
    
    // Calculate streak (consecutive days with activity)
    let streakDays = 0;
    let currentStreak = 0;
    
    mockWeeklyData.forEach(day => {
      if (day.workouts > 0 || day.meals > 0) {
        currentStreak++;
        streakDays = Math.max(streakDays, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    setProgressData({
      workoutProgress,
      nutritionProgress,
      overallProgress,
      workoutsPerWeek: workoutsCompleted,
      streakDays
    });
  }, [progress]);

  const renderDateRangeSelector = () => (
    <View style={styles.dateRangeSelector}>
      <TouchableOpacity 
        style={[styles.dateOption, dateRange === 'week' && styles.activeDateOption]} 
        onPress={() => setDateRange('week')}
      >
        <Text style={[styles.dateOptionText, dateRange === 'week' && styles.activeDateOptionText]}>
          Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.dateOption, dateRange === 'month' && styles.activeDateOption]} 
        onPress={() => setDateRange('month')}
      >
        <Text style={[styles.dateOptionText, dateRange === 'month' && styles.activeDateOptionText]}>
          Month
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.dateOption, dateRange === 'all' && styles.activeDateOption]} 
        onPress={() => setDateRange('all')}
      >
        <Text style={[styles.dateOptionText, dateRange === 'all' && styles.activeDateOptionText]}>
          All
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderActivityChart = () => (
    <View style={styles.activityChart}>
      {mockWeeklyData.map((day, index) => (
        <View key={index} style={styles.dayColumn}>
          <View style={styles.barContainer}>
            {/* Workout bar */}
            {day.workouts > 0 ? (
              <View style={[styles.bar, styles.workoutBar, { height: 40 }]} />
            ) : (
              <View style={[styles.emptyBar, { height: 40 }]} />
            )}
            
            {/* Meals bar - height based on number of meals */}
            <View 
              style={[
                styles.bar, 
                styles.mealBar, 
                { height: day.meals * 20 }
              ]} 
            />
          </View>
          <Text style={styles.dayLabel}>{day.day}</Text>
        </View>
      ))}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progressData.workoutsPerWeek}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progressData.streakDays}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.workoutsCompleted || 0}</Text>
          <Text style={styles.statLabel}>Total workouts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress?.mealsFollowed || 0}</Text>
          <Text style={styles.statLabel}>Meals followed</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Title style={styles.cardTitle}>Progress Overview</Title>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Progress')}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsText}>Details</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
        
        {renderDateRangeSelector()}
        
        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <ProgressCircle 
              progress={progressData.overallProgress} 
              size={100} 
              strokeWidth={10} 
              color="#4F46E5" 
            >
              <Text style={styles.progressPercent}>{progressData.overallProgress}%</Text>
              <Text style={styles.progressLabel}>Overall</Text>
            </ProgressCircle>
          </View>
          
          <View style={styles.progressSubRow}>
            <View style={styles.progressItem}>
              <ProgressCircle 
                progress={progressData.workoutProgress} 
                size={70} 
                strokeWidth={8} 
                color="#10B981" 
              >
                <Text style={styles.progressSubPercent}>{progressData.workoutProgress}%</Text>
                <Text style={styles.progressSubLabel}>Fitness</Text>
              </ProgressCircle>
            </View>
            
            <View style={styles.progressItem}>
              <ProgressCircle 
                progress={progressData.nutritionProgress} 
                size={70} 
                strokeWidth={8} 
                color="#8B5CF6" 
              >
                <Text style={styles.progressSubPercent}>{progressData.nutritionProgress}%</Text>
                <Text style={styles.progressSubLabel}>Nutrition</Text>
              </ProgressCircle>
            </View>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        {renderActivityChart()}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, styles.workoutBar]} />
            <Text style={styles.legendText}>Workouts</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, styles.mealBar]} />
            <Text style={styles.legendText}>Meals</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Stats</Text>
        {renderStats()}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    color: '#4F46E5',
    fontSize: 14,
  },
  dateRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  dateOption: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeDateOption: {
    backgroundColor: '#4F46E5',
  },
  dateOptionText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  activeDateOptionText: {
    color: 'white',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressSubRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressSubPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressSubLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  activityChart: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 100,
  },
  bar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  emptyBar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginBottom: 2,
  },
  workoutBar: {
    backgroundColor: '#10B981',
  },
  mealBar: {
    backgroundColor: '#8B5CF6',
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  }
});

export default ProgressTracker;