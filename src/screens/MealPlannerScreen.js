import React, { useState } from 'react';
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
  Card, 
  Divider, 
  Chip,
  Avatar,
  IconButton,
  Menu,
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

// Sample meals by category
const mealsByCategory = {
  breakfast: [
    {
      id: 'b1',
      name: 'Protein Oatmeal',
      description: 'Oatmeal with protein powder, berries, and nuts',
      ingredients: ['Oats', 'Protein powder', 'Berries', 'Nuts', 'Almond milk'],
      prepTime: '10 minutes',
      nutritionFacts: {
        calories: 380,
        protein: '24g',
        carbs: '45g',
        fats: '12g'
      }
    },
    {
      id: 'b2',
      name: 'Veggie Omelette',
      description: 'Egg omelette with spinach, tomatoes, and feta cheese',
      ingredients: ['Eggs', 'Spinach', 'Tomatoes', 'Feta cheese', 'Olive oil'],
      prepTime: '15 minutes',
      nutritionFacts: {
        calories: 320,
        protein: '22g',
        carbs: '8g',
        fats: '22g'
      }
    },
    {
      id: 'b3',
      name: 'Avocado Toast',
      description: 'Whole grain toast with avocado, eggs, and seasoning',
      ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Salt', 'Pepper', 'Red pepper flakes'],
      prepTime: '12 minutes',
      nutritionFacts: {
        calories: 350,
        protein: '15g',
        carbs: '30g',
        fats: '18g'
      }
    }
  ],
  lunch: [
    {
      id: 'l1',
      name: 'Chicken & Quinoa Bowl',
      description: 'Grilled chicken with quinoa and mixed vegetables',
      ingredients: ['Chicken breast', 'Quinoa', 'Bell peppers', 'Zucchini', 'Olive oil'],
      prepTime: '20 minutes',
      nutritionFacts: {
        calories: 420,
        protein: '35g',
        carbs: '40g',
        fats: '12g'
      }
    },
    {
      id: 'l2',
      name: 'Tuna Salad Wrap',
      description: 'Tuna mixed with Greek yogurt in a whole grain wrap with vegetables',
      ingredients: ['Tuna', 'Greek yogurt', 'Whole grain wrap', 'Lettuce', 'Tomato', 'Cucumber'],
      prepTime: '10 minutes',
      nutritionFacts: {
        calories: 380,
        protein: '30g',
        carbs: '35g',
        fats: '10g'
      }
    },
    {
      id: 'l3',
      name: 'Lentil Soup',
      description: 'Hearty lentil soup with vegetables and herbs',
      ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Garlic', 'Vegetable broth'],
      prepTime: '30 minutes',
      nutritionFacts: {
        calories: 310,
        protein: '18g',
        carbs: '50g',
        fats: '3g'
      }
    }
  ],
  dinner: [
    {
      id: 'd1',
      name: 'Baked Salmon',
      description: 'Baked salmon with roasted vegetables and quinoa',
      ingredients: ['Salmon fillet', 'Broccoli', 'Carrots', 'Quinoa', 'Lemon', 'Olive oil'],
      prepTime: '25 minutes',
      nutritionFacts: {
        calories: 450,
        protein: '35g',
        carbs: '30g',
        fats: '20g'
      }
    },
    {
      id: 'd2',
      name: 'Turkey Chili',
      description: 'Lean turkey chili with beans and vegetables',
      ingredients: ['Ground turkey', 'Kidney beans', 'Black beans', 'Tomatoes', 'Bell peppers', 'Onion'],
      prepTime: '40 minutes',
      nutritionFacts: {
        calories: 380,
        protein: '30g',
        carbs: '40g',
        fats: '8g'
      }
    },
    {
      id: 'd3',
      name: 'Stir-Fry Tofu',
      description: 'Tofu stir-fried with mixed vegetables and brown rice',
      ingredients: ['Tofu', 'Broccoli', 'Carrots', 'Snow peas', 'Brown rice', 'Soy sauce'],
      prepTime: '20 minutes',
      nutritionFacts: {
        calories: 340,
        protein: '20g',
        carbs: '45g',
        fats: '10g'
      }
    }
  ],
  snacks: [
    {
      id: 's1',
      name: 'Greek Yogurt & Berries',
      description: 'Greek yogurt with mixed berries and honey',
      ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Chia seeds'],
      prepTime: '5 minutes',
      nutritionFacts: {
        calories: 180,
        protein: '15g',
        carbs: '20g',
        fats: '3g'
      }
    },
    {
      id: 's2',
      name: 'Protein Smoothie',
      description: 'Protein shake with banana, peanut butter, and almond milk',
      ingredients: ['Protein powder', 'Banana', 'Peanut butter', 'Almond milk', 'Ice'],
      prepTime: '5 minutes',
      nutritionFacts: {
        calories: 250,
        protein: '25g',
        carbs: '25g',
        fats: '8g'
      }
    },
    {
      id: 's3',
      name: 'Hummus & Veggies',
      description: 'Hummus with carrot and cucumber sticks',
      ingredients: ['Hummus', 'Carrots', 'Cucumber', 'Bell peppers'],
      prepTime: '5 minutes',
      nutritionFacts: {
        calories: 150,
        protein: '6g',
        carbs: '15g',
        fats: '8g'
      }
    }
  ]
};

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

// Meal categories with icons
const mealCategories = [
  { id: 'breakfast', name: 'Breakfast', icon: 'coffee' },
  { id: 'lunch', name: 'Lunch', icon: 'food-variant' },
  { id: 'dinner', name: 'Dinner', icon: 'food' },
  { id: 'snacks', name: 'Snacks', icon: 'fruit-cherries' }
];

const MealPlannerScreen = ({ navigation }) => {
  const theme = useTheme();
  const { nutritionPlan, setNutritionPlan } = useUser();
  
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedCategory, setSelectedCategory] = useState('breakfast');
  const [weeklyMealPlan, setWeeklyMealPlan] = useState(() => {
    // Initialize with empty plan for each day
    const plan = {};
    days.forEach(day => {
      plan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: null
      };
    });
    return plan;
  });
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [currentMealSlot, setCurrentMealSlot] = useState({ day: '', category: '' });
  
  const getMealIcon = (category) => {
    const found = mealCategories.find(cat => cat.id === category);
    return found ? found.icon : 'food-apple';
  };
  
  const openMealMenu = (day, category, event) => {
    // Get the position of the touch event for the menu
    const { locationX, locationY } = event.nativeEvent;
    setMenuPosition({ x: locationX, y: locationY });
    setCurrentMealSlot({ day, category });
    setMenuVisible(true);
  };
  
  const closeMealMenu = () => {
    setMenuVisible(false);
  };
  
  const selectMeal = (meal) => {
    const { day, category } = currentMealSlot;
    setWeeklyMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: meal
      }
    }));
    closeMealMenu();
  };
  
  const removeMeal = () => {
    const { day, category } = currentMealSlot;
    setWeeklyMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: null
      }
    }));
    closeMealMenu();
  };
  
  const saveWeeklyMealPlan = () => {
    // Check if the plan has at least some meals
    const hasMeals = Object.values(weeklyMealPlan).some(dayPlan => 
      Object.values(dayPlan).some(meal => meal !== null)
    );
    
    if (!hasMeals) {
      Alert.alert('Empty Plan', 'Please add at least one meal to your plan before saving.');
      return;
    }
    
    // In a real app, you would save this to the user's profile
    Alert.alert(
      'Success', 
      'Your custom meal plan has been saved!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };
  
  const renderMealSlot = (day, category) => {
    const meal = weeklyMealPlan[day][category];
    
    return (
      <Card 
        style={styles.mealSlot}
        onPress={(event) => openMealMenu(day, category, event)}
      >
        <Card.Content style={styles.mealSlotContent}>
          <Avatar.Icon 
            size={24} 
            icon={getMealIcon(category)}
            style={styles.mealIcon} 
            color="white"
          />
          <Text style={styles.mealCategoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          
          {meal ? (
            <View style={styles.selectedMealContainer}>
              <Text style={styles.selectedMealName}>{meal.name}</Text>
              <Text style={styles.mealCalories}>{meal.nutritionFacts.calories} cal</Text>
            </View>
          ) : (
            <View style={styles.emptyMealContainer}>
              <Text style={styles.emptyMealText}>Tap to select a meal</Text>
              <IconButton icon="plus" size={16} style={styles.addButton} />
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Title style={styles.heading}>Meal Planner</Title>
          
          <Text style={styles.description}>
            Plan your meals for each day of the week. 
            Tap on a meal slot to select a meal from our recommendations.
          </Text>
          
          {/* Day Selection */}
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
          
          {/* Meal Plan for Selected Day */}
          <View style={styles.dayPlanContainer}>
            <Title style={styles.dayTitle}>{selectedDay}'s Meals</Title>
            
            {mealCategories.map(category => (
              <View key={category.id}>
                {renderMealSlot(selectedDay, category.id)}
              </View>
            ))}
          </View>
          
          <Button
            mode="contained"
            icon="content-save"
            onPress={saveWeeklyMealPlan}
            style={styles.saveButton}
          >
            Save Weekly Meal Plan
          </Button>
        </View>
      </ScrollView>
      
      {/* Meal Selection Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMealMenu}
        anchor={menuPosition}
        style={styles.menu}
      >
        <Menu.Item 
          title="Remove meal" 
          icon="delete"
          onPress={removeMeal}
        />
        <Divider />
        
        {currentMealSlot.category && mealsByCategory[currentMealSlot.category]?.map(meal => (
          <Menu.Item
            key={meal.id}
            title={meal.name}
            description={`${meal.nutritionFacts.calories} cal`}
            onPress={() => selectMeal(meal)}
          />
        ))}
      </Menu>
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
  daysScrollView: {
    marginBottom: 16,
  },
  dayChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dayPlanContainer: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  mealSlot: {
    marginBottom: 12,
    borderRadius: 8,
  },
  mealSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  mealIcon: {
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  mealCategoryText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  selectedMealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedMealName: {
    fontSize: 14,
    color: '#4B5563',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  emptyMealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  emptyMealText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  addButton: {
    margin: 0,
  },
  menu: {
    maxWidth: 300,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#10B981',
  },
});

export default MealPlannerScreen;