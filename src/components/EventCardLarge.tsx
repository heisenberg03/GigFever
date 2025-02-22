import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface EventCardLargeProps {
  event: any;
}

// Helper function to format the date string
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  // Format options: e.g., "Mon, 3 March"
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  };
  return date.toLocaleDateString('en-IN', options);
};

export default function EventCardLarge({ event }: EventCardLargeProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {event.media && event.media.length > 0 ? (
          event.media.map((uri: string, index: number) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))
        ) : (
          <Image source={{ uri: event.image }} style={styles.image} />
        )}
      </ScrollView>
      <View style={styles.infoContainer}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{event.title}</Text>
          <Text style={{ color: theme.colors.text }}>{event.location}</Text>
        </View>
        <View style={{ alignItems: 'flex-end'}}>
          <Text style={{ color: theme.colors.text, marginBottom: 8 }}>{event.date ? formatDate(event.date) : 'N/A'}</Text>
          <Text style={{ color: theme.colors.text }}>Budget: ₹ {event.budget}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  infoContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
