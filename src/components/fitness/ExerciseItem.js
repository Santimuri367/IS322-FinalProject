import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, Divider } from 'react-native-paper';

function ExerciseItem({ exercise }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.container}>
      <List.Accordion
        title={exercise.name}
        description={`${exercise.sets} sets × ${exercise.reps} reps`}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        style={styles.accordion}
        titleStyle={styles.title}
        descriptionStyle={styles.description}
      >
        <View style={styles.content}>
          <Text style={styles.instructionText}>{exercise.description}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Rest between sets: {exercise.restTime} seconds</Text>
          </View>
        </View>
      </List.Accordion>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
  accordion: {
    backgroundColor: 'white',
    paddingLeft: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  instructionText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ExerciseItem;