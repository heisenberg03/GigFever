import React, { useState, useEffect, useRef } from 'react';
import { Animated, FlatList, TouchableOpacity, RefreshControl, Text, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllEvents, getUserLocation } from '../api/api';
import EventCardLarge from '../components/EventCardLarge';
import { useTheme } from '../theme/ThemeProvider';
import FilterModal from '../components/FilterModal';
import UnifiedSearchBar from '../components/UnifiedSearchBar';

export default function EventsScreen({ navigation }: any) {
  const theme = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<{ category?: string; location?: string; minBudget?: number; maxBudget?: number }>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [location, setLocation] = useState('Loading...');

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const fetchLocation = async () => {
    const loc = await getUserLocation();
    setLocation(loc);
  };

  const fetchEvents = async (pageNum = 1) => {
    if (pageNum === 1) setRefreshing(true);
    const data = await getAllEvents(pageNum, { ...filters, category: searchQuery || filters.category });
    if (pageNum === 1) {
      setEvents(data);
    } else {
      setEvents(prev => [...prev, ...data]);
    }
    setHasMore(data.length === 3);
    if (pageNum === 1) setRefreshing(false);
    else setLoadingMore(false);
  };

  useEffect(() => {
    fetchLocation();
    setPage(1);
    fetchEvents(1);
  }, [filters, searchQuery]);

  const loadMoreEvents = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEvents(nextPage);
    }
  };

  const renderEvent = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={{ marginVertical: 8, marginHorizontal: 16 }}>
      <EventCardLarge event={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Animated Location Header */}
      <Animated.View style={{ opacity: headerOpacity, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: theme.colors.background }}>
        <TouchableOpacity onPress={() => navigation.navigate('LocationSelection')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="location-sharp" size={24} color={theme.colors.text} />
          <Text style={{ marginLeft: 8, color: theme.colors.text, fontSize: 16 }}>{location}</Text>
        </TouchableOpacity>
      </Animated.View>
      <UnifiedSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSubmit={() => fetchEvents(1)} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="filter" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EventCreation')}>
          <Text style={{ color: theme.colors.primary, fontSize: 16 }}>Create Event</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderEvent}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchEvents(1)} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={<ActivityIndicator color={theme.colors.primary} style={{ margin: 16 }} />}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={theme.colors.primary} style={{ margin: 16 }} /> : null}
      />
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(appliedFilters) => {
          setFilters(appliedFilters);
          setFilterVisible(false);
        }}
        includeLocation={true}
      />
    </SafeAreaView>
  );
}
