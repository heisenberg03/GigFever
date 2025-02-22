import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getEventDetails, updateEventMedia, deleteEventMedia } from '../api/api';
import * as ImagePicker from 'expo-image-picker';
import { trimMediaAsync } from '../utils/mediaUtils';

const MAX_VIDEO_DURATION = 40; // seconds

export default function EventMediaManagerScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const theme = useTheme();
  const [media, setMedia] = useState<string[]>([]);

  const fetchEventMedia = async () => {
    const event = await getEventDetails(eventId);
    setMedia(event.media || []);
  };

  useEffect(() => {
    fetchEventMedia();
  }, [eventId]);

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access media library is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    let finalUri = asset.uri;
    if (asset.type === 'video') {
      const duration = asset.duration || 0;
      if (duration > MAX_VIDEO_DURATION) {
        const startTime = 0; // Simulate user selection
        finalUri = await trimMediaAsync(asset.uri, MAX_VIDEO_DURATION, startTime);
        Alert.alert('Video Trimmed', 'Your video was trimmed to 40 seconds.');
      }
    }
    await updateEventMedia(eventId, finalUri);
    Alert.alert('Upload', 'Event media updated successfully.');
    fetchEventMedia();
  };

  const handleDelete = async (mediaUri: string) => {
    await deleteEventMedia(eventId, mediaUri);
    Alert.alert('Deleted', 'Event media deleted.');
    fetchEventMedia();
  };

  const renderMediaItem = ({ item }: any) => (
    <TouchableOpacity onLongPress={() => handleDelete(item)} style={{ flex: 1, margin: 2 }}>
      <Image source={{ uri: item }} style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Manage Event Media</Text>
        <FlatList
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        <TouchableOpacity
          style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginVertical: 16 }}
          onPress={pickMedia}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Add New Event Media</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
