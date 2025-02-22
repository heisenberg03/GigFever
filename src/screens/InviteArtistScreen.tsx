import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getMyEvents } from '../api/api';

export default function InviteArtistScreen({ route, navigation }: any) {
  const { artistId } = route.params;
  const theme = useTheme();
  const [hostEvents, setHostEvents] = useState<any[]>([]);

  const fetchHostEvents = async () => {
    const events = await getMyEvents();
    setHostEvents(events);
  };

  useEffect(() => {
    fetchHostEvents();
  }, []);

  const handleInvite = (eventId: number) => {
    // In production, send an invitation API call here
    Alert.alert('Invitation Sent', `Artist ${artistId} invited for event ${eventId}`);
    navigation.goBack();
  };

  const renderEvent = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleInvite(item.id)} style={{ padding: 16, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: 8 }}>
      <Text style={{ color: theme.colors.text }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Select Event to Invite Artist</Text>
      <FlatList
        data={hostEvents}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderEvent}
      />
      <TouchableOpacity
        style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }}
        onPress={() => navigation.navigate('EventCreation')}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Create New Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.goBack()}>
        <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
