import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip, Button, IconButton, Text, Divider, Avatar } from 'react-native-paper';

function MealCard({ meal, onMarkComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onMarkComplete && onMarkComplete();
  };
  
  // Get an icon based on meal name
  const getMealIcon = (mealName) => {
    const name = mealName.toLowerCase();
    if (name.includes('breakfast')) {
      return 'coffee';
    } else if (name.includes('lunch')) {
      return 'food';
    } else if (name.includes('dinner')) {
      return 'food-variant';
    } else if (name.includes('snack')) {
      return 'fruit-cherries';
    }
    return 'food-apple';
  };

  return (
    <Card style={[styles.card, completed && styles.completedCard]}>
      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Avatar.Icon 
              size={40} 
              icon={getMealIcon(meal.name)} 
              style={styles.mealIcon} 
              color="white"
            />
            <Title style={styles.title}>{meal.name}</Title>
          </View>
          <View style={styles.nutritionPill}>
            <Text style={styles.caloriesText}>{meal.nutritionFacts.calories} cal</Text>
          </View>
        </View>
        
        {completed && (
          <Chip icon="check-circle" style={styles.completedChip}>
            Completed
          </Chip>
        )}
        
        <Paragraph style={styles.description}>{meal.description}</Paragraph>
        
        <View style={styles.macroRow}>
          <Chip style={styles.macroChip} textStyle={styles.macroText}>
            Protein: {meal.nutritionFacts.protein}
          </Chip>
          <Chip style={styles.macroChip} textStyle={styles.macroText}>
            Carbs: {meal.nutritionFacts.carbs}
          </Chip>
          <Chip style={styles.macroChip} textStyle={styles.macroText}>
            Fats: {meal.nutritionFacts.fats}
          </Chip>
        </View>
        
        <View style={styles.prepRow}>
          <IconButton 
            icon="clock-outline" 
            size={16} 
            color="#6B7280" 
            style={styles.prepIcon}
          />
          <Paragraph style={styles.prepText}>Prep time: {meal.prepTime}</Paragraph>
        </View>
        
        <Button 
          mode="outlined" 
          onPress={() => setExpanded(!expanded)} 
          style={styles.detailsButton}
          labelStyle={styles.detailsButtonLabel}
        >
          {expanded ? 'Hide Details' : 'Show Ingredients'}
        </Button>
        
        {expanded && (
          <View style={styles.ingredientsContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.ingredientsTitle}>Ingredients:</Text>
            <View style={styles.ingredientsList}>
              {meal.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
      
      <Card.Actions style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={handleComplete} 
          style={[styles.actionButton, completed && styles.disabledButton]} 
          disabled={completed}
        >
          {completed ? 'Completed' : 'Mark as Completed'}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  completedCard: {
    opacity: 0.8,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  title: {
    flexShrink: 1,
    fontSize: 20,
  },
  nutritionPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  caloriesText: {
    fontWeight: 'bold',
    color: '#4B5563',
  },
  completedChip: {
    backgroundColor: '#D1FAE5',
    marginBottom: 12,
    width: 120,
  },
  description: {
    marginBottom: 12,
    color: '#4B5563',
  },
  macroRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  macroChip: {
    marginRight: 8,
    backgroundColor: '#EEF2FF',
  },
  macroText: {
    fontSize: 12,
  },
  prepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  prepIcon: {
    margin: 0,
    padding: 0,
  },
  prepText: {
    color: '#6B7280',
    fontSize: 14,
  },
  detailsButton: {
    marginTop: 4,
    borderColor: '#E5E7EB',
  },
  detailsButtonLabel: {
    fontSize: 14,
  },
  ingredientsContainer: {
    marginTop: 12,
  },
  divider: {
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredientsList: {
    paddingLeft: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  ingredientText: {
    color: '#4B5563',
    fontSize: 14,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});

export default MealCard;