import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Import screens
import Onboarding from '../screens/Onboarding';
import Dashboard from '../screens/Dashboard';
import NutritionHub from '../screens/NutritionHub';
import FitnessHub from '../screens/FitnessHub';
import ExerciseLibraryScreen from '../screens/ExerciseLibraryScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import ProgressTrackerScreen from '../screens/ProgressTrackerScreen';
import BodyTransformationScreen from '../screens/BodyTransformationScreen';
import WorkoutPlannerScreen from '../screens/WorkoutPlannerScreen';
import NotificationSetupScreen from '../screens/NotificationSetupScreen';
import MealPlannerScreen from '../screens/MealPlannerScreen';

// Import UI components
import AppHeader from '../components/ui/AppHeader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for main app screens
function MainTabNavigator() {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Nutrition') {
            iconName = 'food-apple';
          } else if (route.name === 'Fitness') {
            iconName = 'dumbbell';
          } else if (route.name === 'Progress') {
            iconName = 'chart-line';
          } else if (route.name === 'Coach') {
            iconName = 'robot';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Nutrition" component={NutritionStack} options={{ title: 'Nutrition' }} />
      <Tab.Screen name="Fitness" component={FitnessStack} options={{ title: 'Fitness' }} />
      <Tab.Screen name="Progress" component={ProgressStack} options={{ title: 'Progress' }} />
      <Tab.Screen name="Coach" component={ChatbotScreen} options={{ title: 'AI Coach' }} />
    </Tab.Navigator>
  );
}

// Dashboard Stack
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route, options }) => (
          <AppHeader title={route.name} />
        ),
      }}
    >
      <Stack.Screen name="My Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

// Nutrition Stack
function NutritionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route, options }) => (
          <AppHeader title={route.name} />
        ),
      }}
    >
      <Stack.Screen name="Nutrition Hub" component={NutritionHub} />
      <Stack.Screen name="Meal Planner" component={MealPlannerScreen} />
    </Stack.Navigator>
  );
}

// Fitness Stack
function FitnessStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route, options }) => (
          <AppHeader title={route.name} />
        ),
      }}
    >
      <Stack.Screen name="Fitness Hub" component={FitnessHub} />
      <Stack.Screen name="Exercise Library" component={ExerciseLibraryScreen} />
      <Stack.Screen name="Workout Planner" component={WorkoutPlannerScreen} />
      <Stack.Screen name="Setup Reminders" component={NotificationSetupScreen} />
    </Stack.Navigator>
  );
}

// Progress Stack
function ProgressStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route, options }) => (
          <AppHeader title={route.name} />
        ),
      }}
    >
      <Stack.Screen name="Track Progress" component={ProgressTrackerScreen} />
      <Stack.Screen name="Body Transformation" component={BodyTransformationScreen} />
    </Stack.Navigator>
  );
}

// Main navigator with conditional rendering based on onboarding status
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Onboarding" 
          component={Onboarding} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;