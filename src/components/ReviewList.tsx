import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function ReviewList({ reviews }: { reviews: any[] }) {
  const theme = useTheme();
  return (
    <View>
      {reviews.map(review => (
        <View key={review.id} style={{ padding: 16, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: 12 }}>
          <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>Rating: {review.rating}</Text>
          <Text style={{ color: theme.colors.text }}>{review.review}</Text>
        </View>
      ))}
    </View>
  );
}
