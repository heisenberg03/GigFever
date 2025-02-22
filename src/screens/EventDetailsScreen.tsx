import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getEventDetails, getEventApplications } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const theme = useTheme();
  const [event, setEvent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const currentUserId = 1; // Simulated current user ID

  const fetchEventDetails = async () => {
    const data = await getEventDetails(eventId);
    setEvent(data);
  };

  const fetchApplications = async () => {
    const apps = await getEventApplications(eventId);
    setApplications(apps);
  };

  useEffect(() => {
    fetchEventDetails();
    fetchApplications();
  }, [eventId]);

  const renderApplication = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('ArtistProfile', { artistId: item.artistId })} style={{ marginRight: 8 }}>
      <View style={{ width: 100, alignItems: 'center' }}>
        <Image source={{ uri: item.artistProfilePic || 'https://via.placeholder.com/100' }} style={{ width: 80, height: 80, borderRadius: 40 }} />
        <Text style={{ color: theme.colors.text, marginTop: 4 }}>{item.artistName}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const isHost = event.host && event.host.id === currentUserId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ padding: 16 }}>
        <Image source={{ uri: event.image }} style={{ width: '100%', height: 200, borderRadius: 8 }} />
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>{event.title}</Text>
        <Text style={{ color: theme.colors.text, marginTop: 8 }}>{event.description}</Text>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>Category: <Text style={{ color: theme.colors.text }}>{event.category}</Text></Text>
          <Text style={{ color: theme.colors.text, fontWeight: 'bold', marginTop: 4 }}>Budget: <Text style={{ color: theme.colors.text }}>${event.budget}</Text></Text>
          <Text style={{ color: theme.colors.text, fontWeight: 'bold', marginTop: 4 }}>Location: <Text style={{ color: theme.colors.text }}>{event.location}</Text></Text>
          <Text style={{ color: theme.colors.text, fontWeight: 'bold', marginTop: 4 }}>Date: <Text style={{ color: theme.colors.text }}>{event.date || 'N/A'}</Text></Text>
          <Text style={{ color: theme.colors.text, fontWeight: 'bold', marginTop: 4 }}>Time: <Text style={{ color: theme.colors.text }}>{event.time || 'N/A'}</Text></Text>
        </View>
        {/* Event Media Carousel */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Event Media</Text>
          <FlatList
            data={event.media || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width: 300, height: 200, borderRadius: 8, marginRight: 8 }} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {isHost ? (
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Applied Artists</Text>
            <FlatList
              data={applications}
              horizontal
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={renderApplication}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }}
            onPress={() => navigation.navigate('ApplyForEvent', { eventId })}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Apply for Event</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
