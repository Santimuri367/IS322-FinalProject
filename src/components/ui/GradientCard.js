import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Title, Text } from 'react-native-paper';

function GradientCard({ title, subtitle, icon, colors, onPress, children }) {
  // Use the first color as the background if LinearGradient is not available
  const backgroundColor = colors ? colors[0] : '#4F46E5';
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Surface style={styles.card}>
        <View style={[styles.gradient, { backgroundColor }]}>
          <View style={styles.header}>
            <View>
              <Title style={styles.title}>{title}</Title>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {icon}
          </View>
          {children && <View style={styles.content}>{children}</View>}
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  content: {
    marginTop: 12,
  },
});

export default GradientCard;