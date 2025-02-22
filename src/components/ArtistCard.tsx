import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface ArtistCardProps {
  artist: {
    id: number;
    name: string;
    profile_picture: string;
    primary_category: string;
  };
}

// We'll do a 2-column layout. This ensures cards are consistent in size.
const { width } = Dimensions.get('window');
const CARD_SPACING = 8; // margin around each card
const CARD_WIDTH = (width - CARD_SPACING * 3) / 2; // 2 columns with spacing

export default function ArtistCard({ artist }: ArtistCardProps) {
  const theme = useTheme();
  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: artist.profile_picture }} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, { color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {artist.name}
        </Text>
        <Text style={[styles.categoryText, { color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {artist.primary_category}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    margin: CARD_SPACING,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // square image
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 14,
    marginTop: 4,
  },
});
