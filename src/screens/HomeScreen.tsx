// /screens/HomeScreen.tsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Animated, ScrollView, View, FlatList, TouchableOpacity, RefreshControl, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { getTrendingArtists, getTrendingEvents, getUserLocation } from '../api/api';
import ArtistCard from '../components/ArtistCard';
import EventCardLarge from '../components/EventCardLarge';
import { NotificationContext } from '../context/NotificationContext';

const LOCATION_HEIGHT = 40;
const SEARCH_HEIGHT = 40;
const HEADER_HEIGHT = LOCATION_HEIGHT + SEARCH_HEIGHT;
const SCROLL_DISTANCE = LOCATION_HEIGHT;

export const allCategories = ["Singer", "Dancer", "Guitarist", "Pianist", "Drummer", "Violinist"];

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const { unreadNotifications } = useContext(NotificationContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingArtists, setTrendingArtists] = useState<any[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState('Loading...');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const scrollY = useRef(new Animated.Value(0)).current;

  // Animate the location header height from full (LOCATION_HEIGHT) to 0 as user scrolls
  const locationHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [LOCATION_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  // Animate header content opacity (for both location and notification icon)
  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const fetchData = async (categoryFilter = '') => {
    setRefreshing(true);
    const artists = await getTrendingArtists({ category: categoryFilter });
    const events = await getTrendingEvents({ category: categoryFilter });
    const userLoc = await getUserLocation();
    setTrendingArtists(artists);
    setTrendingEvents(events);
    setLocation(userLoc);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryPress = (cat: string) => {

    setSelectedCategory(prev => (prev === cat ? '' : cat));

  };

  const handleSearchSubmit = () => {
    fetchData(searchQuery);
  };

  // Render "View All Artists" card at the end of the trending artists list
  const renderViewAllArtists = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Artists')}
      style={styles.viewAllArtists}
    >
      <Ionicons name="people" size={32} color={theme.colors.primary} />
      <Text style={{ color: theme.colors.primary, marginTop: 8 }}>View All Artists</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Animated Header with Location and Notification Bell */}
      <Animated.View style={{ height: HEADER_HEIGHT, backgroundColor: theme.colors.background }}>
        <Animated.View style={[styles.headerRow, { height: locationHeight }]}>
          <TouchableOpacity onPress={() => navigation.navigate('LocationSelection')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-sharp" size={24} color={theme.colors.text} />
            <Text style={{ marginLeft: 8, color: theme.colors.text, fontSize: 16 }}>{location}</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.notificationContainer, { opacity: headerContentOpacity }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color={theme.colors.text} />
              {unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        <View style={{ paddingTop: 4 }}>
          <UnifiedSearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSubmit={handleSearchSubmit} 
          />
        </View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchData(selectedCategory)} />}
      >
        {/* Trending Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding:16, marginTop: 32 }}>
          {allCategories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCategoryPress(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? theme.colors.primary : theme.colors.card,
                padding: 10,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text style={{ color: selectedCategory === cat ? '#fff' : theme.colors.text }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Artists */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={{ color: theme.colors.text, fontSize: 20, marginBottom: 16, fontWeight: 'bold' }}>Trending Artists</Text>
          <FlatList
            data={trendingArtists}
            horizontal
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('ArtistProfile', { artistId: item.id })}>
                <ArtistCard artist={item} />
              </TouchableOpacity>
            )}
            ListFooterComponent={renderViewAllArtists}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Upcoming Events */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16, marginTop: 48 }}>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EventsScreen')}>
            <Text style={{ color: theme.colors.primary, fontSize: 16 }}>View All Events</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trendingEvents}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={{ marginVertical: 8 }}>
              <EventCardLarge event={item} />
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchData(selectedCategory)} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          ListEmptyComponent={<ActivityIndicator color={theme.colors.primary} style={{ margin: 16 }} />}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationButton: {
    padding: 4, position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  viewAllArtists: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 150,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
