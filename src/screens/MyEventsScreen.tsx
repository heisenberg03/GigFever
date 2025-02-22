import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getMyEvents } from '../api/api';

export default function MyEventsScreen({ navigation }: any) {
  const theme = useTheme();
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyEvents = async () => {
    setRefreshing(true);
    const data = await getMyEvents();
    setMyEvents(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const renderEvent = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={{ flex: 1, margin: 4 }}>
      <View style={{ backgroundColor: theme.colors.card, padding: 16, borderRadius: 8 }}>
        <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: theme.colors.text }}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Events</Text>
      </View>
      <FlatList
        data={myEvents}
        numColumns={2}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderEvent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMyEvents} />}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </SafeAreaView>
  );
}
