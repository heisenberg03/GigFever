import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

interface Artist {
  id: number;
  name: string;
  // Additional properties
}

interface Event {
  id: number;
  title: string;
  // Additional properties
}

interface Category {
  id: number;
  name: string;
}

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [eventResults, setEventResults] = useState<Event[]>([]);
  const [categoryResults, setCategoryResults] = useState<Category[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    // Simulate search results (replace with real API calls as needed)
    const dummyArtists: Artist[] = text ? [{ id: 1, name: 'Artist 1' }, { id: 2, name: 'Artist 2' }] : [];
    const dummyEvents: Event[] = text ? [{ id: 1, title: 'Event 1' }] : [];
    const dummyCategories: Category[] = text ? [{ id: 1, name: 'Music' }, { id: 2, name: 'Dance' }] : [];
    setArtistResults(dummyArtists);
    setEventResults(dummyEvents);
    setCategoryResults(dummyCategories);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search artists, events, categories..."
        value={query}
        onChangeText={handleSearch}
      />
      <ScrollView>
        {artistResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artists</Text>
            {artistResults.map((artist) => (
              <Text key={artist.id} style={styles.resultItem}>
                {artist.name}
              </Text>
            ))}
          </View>
        )}
        {eventResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Events</Text>
            {eventResults.map((event) => (
              <Text key={event.id} style={styles.resultItem}>
                {event.title}
              </Text>
            ))}
          </View>
        )}
        {categoryResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {categoryResults.map((category) => (
              <Text key={category.id} style={styles.resultItem}>
                {category.name}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  resultItem: { fontSize: 16, paddingVertical: 5 },
});

export default SearchScreen;
