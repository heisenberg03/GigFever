import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  SectionList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { fetchUserEvents, Event } from '../api/api';

const MyEventsScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<'upcoming' | 'created'>('upcoming');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchUserEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const now = new Date();

  let sections = [];
  if (sortMode === 'upcoming') {
    // Group events into upcoming (event time in future) and past (event time in past)
    const upcoming = events
      .filter(e => new Date(e.dateTime) >= now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    const past = events
      .filter(e => new Date(e.dateTime) < now)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    sections = [
      { title: 'Upcoming Events', data: upcoming },
      { title: 'Past Events', data: past },
    ];
  } else {
    // Sort all events by createdAt descending
    const sorted = [...events].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    sections = [{ title: 'All Events (Latest Created First)', data: sorted }];
  }

  const renderEventCard = ({ item, section }: { item: Event; section: { title: string } }) => {
    const eventDate = new Date(item.dateTime);
    const eventDateString = eventDate.toLocaleString();
    const isPast = section.title === 'Past Events';

    let cardStyle = [styles.card];
    let titleStyle = [styles.cardTitle];
    let dateStyle = [styles.cardDate];
    let locationStyle = [styles.cardLocation];

    if (isPast) {
      cardStyle.push(styles.cardPast);
      titleStyle.push({ color: '#999' });
      dateStyle.push({ color: '#999' });
      locationStyle.push({ color: '#999' });
    }
    else{
      titleStyle.push({ color: theme.colors.text });
      dateStyle.push({ color: theme.colors.text });
      locationStyle.push({ color: theme.colors.text });
    }

    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={() => navigation.navigate('EventCreation')}
      >
        <View style={styles.cardHeader}>
          <Text style={titleStyle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={dateStyle}>{eventDateString}</Text>
        <Text style={locationStyle}>{item.location}</Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeaderText, { color: theme.colors.primary }]}>{section.title}</Text>
    </View>
  );

  const SegmentedControl = () => {
    return (
      <View style={[styles.segmentContainer, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            sortMode === 'upcoming' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setSortMode('upcoming')}
        >
          <Text style={{ color: sortMode === 'upcoming' ? '#fff' : theme.colors.text }}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            sortMode === 'created' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setSortMode('created')}
        >
          <Text style={{ color: sortMode === 'created' ? '#fff' : theme.colors.text }}>
            Latest Created
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>My Events</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('EventCreation')}
        >
          <Ionicons name="add-circle" size={28} color={theme.colors.primary} />
          <Text style={[styles.createButtonText, { color: theme.colors.primary }]}>
            Create New Event
          </Text>
        </TouchableOpacity>
      </View>
      <SegmentedControl />
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderEventCard}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={{ color: theme.colors.text, textAlign: 'center' }}>No events available.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

// Helper to return a color for event status
function getStatusColor(status: 'open' | 'confirmed' | 'cancelled') {
  switch (status) {
    case 'open':
      return 'orange';
    case 'confirmed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  screenTitle: { fontSize: 24, fontWeight: 'bold' },
  createButton: { flexDirection: 'row', alignItems: 'center' },
  createButtonText: { marginLeft: 8, fontSize: 16 },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  segmentButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  loadingIndicator: { marginTop: 50 },
  listContainer: { paddingBottom: 80 },
  sectionHeader: { paddingVertical: 6, paddingHorizontal: 16, marginTop: 12 },
  sectionHeaderText: { fontSize: 18, fontWeight: 'bold' },
  // Event Card Styles
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardPast: {
    backgroundColor: '#f2f2f2',
    shadowOpacity: 0,
    borderColor: '#ddd',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDate: { fontSize: 14, marginBottom: 4 },
  cardLocation: { fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

export default MyEventsScreen;
