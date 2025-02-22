import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { searchItems } from '../api/api';

export default function SearchScreen({ navigation }: any) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setRefreshing(true);
    const data = await searchItems(query);
    setResults(data);
    setRefreshing(false);
  };

  const renderResult = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        if (item.type === 'artist') {
          navigation.navigate('ArtistProfile', { artistId: item.id });
        } else if (item.type === 'event') {
          navigation.navigate('EventDetails', { eventId: item.id });
        } else if (item.type === 'category') {
          navigation.navigate('ArtistsScreen', { filterCategory: item.name });
        }
      }}
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
    >
      <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
        {item.name || item.title} ({item.type})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <UnifiedSearchBar searchQuery={query} setSearchQuery={setQuery} onSubmit={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderResult}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 16, color: theme.colors.text }}>No results found</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleSearch} />}
      />
    </SafeAreaView>
  );
}
