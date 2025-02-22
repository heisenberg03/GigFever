import React, { useState, useEffect, useRef } from 'react';
import { Animated, FlatList, TouchableOpacity, RefreshControl, Text, StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { getAllEvents, getUserLocation } from '../api/api';
import EventCardLarge from '../components/EventCardLarge';
import FilterModal, { FiltersType } from '../components/FilterModal';
import SortModal, { SortOption, SelectedSort } from '../components/SortModal';

export default function EventsScreen({ navigation, route }: any) {
  const theme = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    route.params?.filterCategory ? [route.params.filterCategory] : []
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SelectedSort>({ field: '', order: 'asc' });
  const [location, setLocation] = useState('Loading...');
  
  const trendingCategories = ['Concert', 'Workshop', 'Conference', 'Exhibition'];
  const sortOptions: SortOption[] = [
    { label: 'Date', value: 'date' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Budget', value: 'budget' },
  ];

  // Header animation constants (reverting to original styling)
  const LOCATION_HEIGHT = 40;
  const SEARCH_HEIGHT = 70;
  const FILTERS_ROW_HEIGHT = 30;
  const HEADER_HEIGHT = LOCATION_HEIGHT + SEARCH_HEIGHT + FILTERS_ROW_HEIGHT;
  const SCROLL_DISTANCE = LOCATION_HEIGHT + FILTERS_ROW_HEIGHT;

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

  const fetchEvents = async () => {
    setRefreshing(true);
    const appliedFilters: FiltersType =
      selectedCategories.length > 0 ? { category: selectedCategories } : {};
    const data = await getAllEvents({ filters: appliedFilters, page: 1 });
    let sortedData = data;
    if (selectedSort.field) {
      sortedData = [...data].sort((a, b) => {
        if (selectedSort.order === 'asc') {
          return a[selectedSort.field] - b[selectedSort.field];
        } else {
          return b[selectedSort.field] - a[selectedSort.field];
        }
      });
    }
    setEvents(sortedData);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLocation();
    fetchEvents();
  }, [selectedCategories, searchQuery, selectedSort]);

  const handleSearchSubmit = () => {
    fetchEvents();
  };

  const handleTrendingPress = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]
    );
  };

  const renderEvent = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={styles.eventTouchable}>
      <EventCardLarge event={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { height: HEADER_HEIGHT, backgroundColor: theme.colors.background }]}>
        <Animated.View style={[styles.locationRow, { height: locationHeight }]}>
          <TouchableOpacity onPress={() => navigation.navigate('LocationSelection')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-sharp" size={24} color={theme.colors.text} />
            <Text style={{ marginLeft: 8, color: theme.colors.text, fontSize: 16 }}>{location}</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.searchRow}>
          <UnifiedSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearchSubmit}
          />
        </View>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.actionButton}>
            <Ionicons name="filter" size={30} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortVisible(true)} style={styles.actionButton}>
            <Ionicons name="swap-vertical" size={30} color={theme.colors.text} />
          </TouchableOpacity>
        <View style={styles.trendingRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {trendingCategories.map((cat, index) => (
              <TouchableOpacity key={index} onPress={() => handleTrendingPress(cat)} style={[
                styles.trendingItem,
                { backgroundColor: selectedCategories.includes(cat) ? theme.colors.primary : theme.colors.card }
              ]}>
                <Text style={{ color: selectedCategories.includes(cat) ? '#fff' : theme.colors.text }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </View>

      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />}
      >
        <FlatList
          data={events}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderEvent}
          contentContainerStyle={styles.flatListContent}
        />
      </Animated.ScrollView>
      {/* Floating Create Event Button */}
      <TouchableOpacity style={[styles.createEventButton, {backgroundColor:theme.colors.primary}]} onPress={() => navigation.navigate('EventCreation')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(updatedCategories) => setSelectedCategories(updatedCategories)}
        selectedCategories={selectedCategories}
      />
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onApplySort={(newSort) => setSelectedSort(newSort)}
        currentSort={selectedSort}
        sortOptions={sortOptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { zIndex: 999 },
  locationRow: { flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'flex-start', alignItems: 'center', overflow: 'hidden' },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 4 },
  actionButtonsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  actionButton: { padding: 8 },
  trendingRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 8 },
  trendingItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 8 },
  scrollContent: { paddingBottom: 30 },
  flatListContent: { paddingTop: 16, paddingHorizontal: 8 },
  eventTouchable: { flex: 1},
  createEventButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4caf50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
