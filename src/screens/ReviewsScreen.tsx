import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getReviews, submitReview } from '../api/api';
import { useTheme } from '../theme/ThemeProvider';

export default function ReviewsScreen({ route }: any) {
  const { artistId } = route.params;
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const theme = useTheme();

  const fetchReviews = async () => {
    const data = await getReviews(artistId);
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [artistId]);

  const handleSubmitReview = async () => {
    if (!rating || !reviewText) {
      Alert.alert('Error', 'Please provide rating and review.');
      return;
    }
    await submitReview(artistId, parseFloat(rating), reviewText);
    setRating('');
    setReviewText('');
    fetchReviews();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={{ padding: 16, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>Rating: {item.rating}</Text>
            <Text style={{ color: theme.colors.text }}>{item.review}</Text>
          </View>
        )}
      />
      <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Add a Review</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        placeholder="Rating (e.g. 4.5)"
        placeholderTextColor="#ccc"
        keyboardType="decimal-pad"
        style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginTop: 8 }}
      />
      <TextInput
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Your review"
        placeholderTextColor="#ccc"
        multiline
        style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginTop: 8, height: 80 }}
      />
      <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }} onPress={handleSubmitReview}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}
