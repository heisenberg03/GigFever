import React, { useState, useEffect, useRef } from 'react';
import { Animated, FlatList, TouchableOpacity, RefreshControl, Text, StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { getAllArtists, getUserLocation } from '../api/api';
import ArtistCard from '../components/ArtistCard';
import FilterModal, { FiltersType } from '../components/FilterModal';
import SortModal from '../components/SortModal';

export default function ArtistsScreen({ navigation, route }: any) {
  const theme = useTheme();
  const [artists, setArtists] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Use filters from route if available
  const [filters, setFilters] = useState<FiltersType>(
    route.params?.filterCategory ? { category: route.params.filterCategory } : {}
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<'averageRating' | 'popularity' | 'budget' | ''>('');
  const [location, setLocation] = useState('Loading...');
  // Trending categories now support multi-selection
  const trendingCategories = ["Music", "Exhibition", "Dance", "Comedy", "Theatre"];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    route.params?.filterCategory ? [route.params.filterCategory] : []
  );
  // Header animation constants
  const LOCATION_HEIGHT = 50;
  const SEARCH_HEIGHT = 50;
  const FILTERS_ROW_HEIGHT = 60;
  const HEADER_HEIGHT = LOCATION_HEIGHT + SEARCH_HEIGHT + FILTERS_ROW_HEIGHT;
  const SCROLL_DISTANCE = LOCATION_HEIGHT + FILTERS_ROW_HEIGHT; // location + trending filters collapse

  const scrollY = useRef(new Animated.Value(0)).current;
  const locationHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [LOCATION_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const fetchLocation = async () => {
    const loc = await getUserLocation();
    setLocation(loc);
  };

  const fetchArtists = async () => {
    setRefreshing(true);
    // Construct applied filters: if explicit filters exist, use them; otherwise, if trending selections exist, use those.
    const appliedFilters: FiltersType =
      Object.keys(filters).length > 0 ? filters : (selectedCategories.length > 0 ? { category: selectedCategories } : {});
    const data = await getAllArtists({
      filters: appliedFilters,
      page: 1,
    });
    setArtists(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLocation();
    fetchArtists();
  }, [filters, searchQuery, selectedCategories]);

  const handleSearchSubmit = () => {
    fetchArtists();
  };

  const handleTrendingPress = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]
    );
  };
  

  const applySort = (criteria: 'averageRating' | 'popularity' | 'budget') => {
    setSortCriteria(criteria);
    const sorted = [...artists].sort((a, b) => {
      if (criteria === 'averageRating') return b.rating - a.rating;
      if (criteria === 'popularity') return b.popularity - a.popularity;
      if (criteria === 'budget') return a.budget - b.budget;
      return 0;
    });
    setArtists(sorted);
  };

  const renderArtist = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ArtistProfile', { artistId: item.id })}
      style={styles.artistTouchable}
    >
      <ArtistCard artist={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { height: HEADER_HEIGHT, backgroundColor: theme.colors.background }]}>
        {/* Location Row */}
        <Animated.View style={[styles.locationRow, { height: locationHeight }]}>
          <TouchableOpacity onPress={() => navigation.navigate('LocationSelection')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-sharp" size={24} color={theme.colors.text} />
            <Text style={{ marginLeft: 8, color: theme.colors.text, fontSize: 16 }}>{location}</Text>
          </TouchableOpacity>
        </Animated.View>
        {/* Search Row */}
        <View style={styles.searchRow}>
          <UnifiedSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearchSubmit}
          />
        </View>

        <Animated.View style={[styles.trendingRow]}>
          <TouchableOpacity onPress={() => setFilterVisible(true)} style={[styles.filterButton, {backgroundColor: theme.colors.card}]}>
            <Ionicons name="filter" size={30} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortVisible(true)} style={[styles.filterButton, {backgroundColor: theme.colors.card}]}>
            <Ionicons name="swap-vertical" size={30} color={theme.colors.text} />
          </TouchableOpacity>
        {/* Trending Filters Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {trendingCategories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTrendingPress(cat)}
                style={[
                  styles.trendingItem,
                  {
                    backgroundColor: selectedCategories.includes(cat)
                      ? theme.colors.primary
                      : theme.colors.card,
                  },
                ]}
              >
                <Text style={{ color: selectedCategories.includes(cat) ? '#fff' : theme.colors.text }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          </Animated.View>
          </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchArtists} />}
      >
        <FlatList
          data={artists}
          numColumns={2}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderArtist}
          contentContainerStyle={styles.flatListContent}
        />
      </Animated.ScrollView>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(appliedFilters) => {
          setFilters(appliedFilters);
          setFilterVisible(false);
        }}
        includeLocation={false}
      />
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onSelectSort={applySort}
        currentSort={sortCriteria}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 999,
  },
  locationRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  filterButton: {
    marginLeft: 8,
    paddingHorizontal:4
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  trendingItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  flatListContent: {
    paddingTop: 16,
  },
  artistTouchable: {
    flex: 1,
  },
});
