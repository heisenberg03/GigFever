import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function EventCard({ event }: any) {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, margin: 8, width: 200 }}>
      <Image source={{ uri: event.image }} style={{ width: '100%', height: 100, borderRadius: 8 }} />
      <Text style={{ color: theme.colors.text, marginTop: 8, fontWeight: 'bold' }}>{event.title}</Text>
      <Text style={{ color: theme.colors.text }}>{event.category}</Text>
      <Text style={{ color: theme.colors.text }}>Budget: ${event.budget}</Text>
      <Text style={{ color: theme.colors.text }}>{event.location}</Text>
    </View>
  );
}
