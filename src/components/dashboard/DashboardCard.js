import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, IconButton } from 'react-native-paper';

function DashboardCard({ title, icon, children, onPress }) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.titleContainer}>
          <IconButton icon={icon} size={24} color="#4F46E5" style={styles.icon} />
          <Title style={styles.title}>{title}</Title>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    margin: 0,
    padding: 0,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
  },
  content: {
    paddingLeft: 4,
  },
});

export default DashboardCard;