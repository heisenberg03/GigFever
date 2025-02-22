import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getMyBookings } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function MyBookingsScreen({ navigation }: any) {
  const theme = useTheme();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    setRefreshing(true);
    const data = await getMyBookings();
    setBookings(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const renderBooking = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={{ padding: 16, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: 12 }}>
      <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ color: theme.colors.text }}>Date: {item.date || 'N/A'}</Text>
      <Text style={{ color: theme.colors.text }}>Time: {item.time || 'N/A'}</Text>
      <Text style={{ color: theme.colors.text }}>Location: {item.location}</Text>
      <Text style={{ color: theme.colors.text }}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row', padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Bookings</Text>
      </View>      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
        {['all', 'pending', 'confirmed'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilter(status)}
            style={{
              backgroundColor: filter === status ? theme.colors.primary : theme.colors.card,
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: filter === status ? '#fff' : theme.colors.text, textTransform: 'capitalize' }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredBookings}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderBooking}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBookings} />}
      />
    </SafeAreaView>
  );
}
