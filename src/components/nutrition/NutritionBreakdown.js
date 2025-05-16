import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, useTheme } from 'react-native-paper';
import ProgressCircle from '../ui/ProgressCircle';

/**
 * NutritionBreakdown - A component that displays a visual breakdown of macronutrients 
 * and calorie information for a meal or daily nutrition plan.
 * 
 * @param {Object} props
 * @param {Object} props.nutritionData - Object containing nutrition values
 * @param {number} props.nutritionData.calories - Total calories
 * @param {string} props.nutritionData.protein - Protein amount (e.g., "25g")
 * @param {string} props.nutritionData.carbs - Carbohydrates amount (e.g., "40g")
 * @param {string} props.nutritionData.fats - Fats amount (e.g., "10g")
 * @param {string} props.title - Optional card title
 * @param {boolean} props.compact - If true, renders a more compact version
 */
function NutritionBreakdown({ nutritionData, title = "Nutrition Breakdown", compact = false }) {
  const theme = useTheme();
  
  // Parse macronutrient values
  const parseGrams = (value) => {
    if (!value) return 0;
    return parseInt(value.replace('g', ''));
  };
  
  const protein = parseGrams(nutritionData?.protein);
  const carbs = parseGrams(nutritionData?.carbs);
  const fats = parseGrams(nutritionData?.fats);
  
  // Calculate total grams and percentages
  const totalGrams = protein + carbs + fats;
  const proteinPercentage = totalGrams > 0 ? Math.round((protein / totalGrams) * 100) : 0;
  const carbsPercentage = totalGrams > 0 ? Math.round((carbs / totalGrams) * 100) : 0;
  const fatsPercentage = totalGrams > 0 ? Math.round((fats / totalGrams) * 100) : 0;
  
  // Calculate calories from each macronutrient
  // Protein: 4 calories per gram, Carbs: 4 calories per gram, Fats: 9 calories per gram
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatsCalories = fats * 9;
  const calculatedCalories = proteinCalories + carbsCalories + fatsCalories;

  // Use either provided calories or calculated calories
  const totalCalories = nutritionData?.calories || calculatedCalories;
  
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.caloriesContainer}>
          <Text style={styles.compactCalories}>{totalCalories}</Text>
          <Text style={styles.compactLabel}>calories</Text>
        </View>
        
        <View style={styles.compactMacros}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.colors.primary }]}>{nutritionData?.protein}</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#10B981' }]}>{nutritionData?.carbs}</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#F59E0B' }]}>{nutritionData?.fats}</Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        
        <View style={styles.content}>
          <View style={styles.calorieCircle}>
            <ProgressCircle 
              size={120} 
              strokeWidth={10} 
              progress={100} 
              color={theme.colors.primary}
            >
              <Text style={styles.caloriesValue}>{totalCalories}</Text>
              <Text style={styles.caloriesLabel}>calories</Text>
            </ProgressCircle>
          </View>
          
          <View style={styles.macroBreakdown}>
            <View style={styles.macroRow}>
              <View style={[styles.macroColor, { backgroundColor: theme.colors.primary }]} />
              <View style={styles.macroTextContainer}>
                <Text style={styles.macroText}>Protein</Text>
                <Text style={styles.macroGrams}>{nutritionData?.protein}</Text>
              </View>
              <Text style={styles.macroPercentage}>{proteinPercentage}%</Text>
            </View>
            
            <View style={styles.macroRow}>
              <View style={[styles.macroColor, { backgroundColor: '#10B981' }]} />
              <View style={styles.macroTextContainer}>
                <Text style={styles.macroText}>Carbs</Text>
                <Text style={styles.macroGrams}>{nutritionData?.carbs}</Text>
              </View>
              <Text style={styles.macroPercentage}>{carbsPercentage}%</Text>
            </View>
            
            <View style={styles.macroRow}>
              <View style={[styles.macroColor, { backgroundColor: '#F59E0B' }]} />
              <View style={styles.macroTextContainer}>
                <Text style={styles.macroText}>Fats</Text>
                <Text style={styles.macroGrams}>{nutritionData?.fats}</Text>
              </View>
              <Text style={styles.macroPercentage}>{fatsPercentage}%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.macroBar}>
          <View 
            style={[
              styles.macroBarSegment, 
              { backgroundColor: theme.colors.primary, flex: proteinPercentage }
            ]} 
          />
          <View 
            style={[
              styles.macroBarSegment, 
              { backgroundColor: '#10B981', flex: carbsPercentage }
            ]} 
          />
          <View 
            style={[
              styles.macroBarSegment, 
              { backgroundColor: '#F59E0B', flex: fatsPercentage }
            ]} 
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  macroBreakdown: {
    flex: 1,
    marginLeft: 16,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  macroTextContainer: {
    flex: 1,
  },
  macroText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  macroGrams: {
    fontSize: 12,
    color: '#6B7280',
  },
  macroPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  macroBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  macroBarSegment: {
    height: '100%',
  },
  // Compact view styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  caloriesContainer: {
    alignItems: 'center',
  },
  compactCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  compactLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  compactMacros: {
    flexDirection: 'row',
  },
  macroItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 12,
    color: '#6B7280',
  }
});

export default NutritionBreakdown;