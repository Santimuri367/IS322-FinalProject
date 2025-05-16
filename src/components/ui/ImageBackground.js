import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function ImageBackgroundCard({ title, children }) {
  const theme = useTheme();
  
  return (
    <View 
      style={[styles.background, { backgroundColor: theme.colors.primary }]}
    >
      <View style={styles.overlay}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 180,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ImageBackgroundCard;