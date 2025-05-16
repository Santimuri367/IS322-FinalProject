import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, useTheme, Avatar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function AppHeader({ title, right }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          {/* Using Avatar instead of Image */}
          <Avatar.Icon 
            size={28} 
            icon="dumbbell" 
            style={styles.logo} 
            color="white"
            backgroundColor="transparent"
          />
          <Title style={styles.title}>{title}</Title>
        </View>
        {right && <View>{right}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 8,
  },
  title: {
    color: 'white',
    margin: 0,
  },
});

export default AppHeader;