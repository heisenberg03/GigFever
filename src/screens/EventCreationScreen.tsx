import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';
import { trimMediaAsync } from '../utils/mediaUtils';
import { createEvent } from '../api/api';

const MAX_VIDEO_DURATION = 40; // seconds

export default function EventCreationScreen({ navigation }: any) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [media, setMedia] = useState<string[]>([]);

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access media library is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Updated here
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    let finalUri = asset.uri;
    if (asset.type === 'video') {
      const duration = asset.duration || 0;
      if (duration > MAX_VIDEO_DURATION) {
        // Simulate user selecting start time; here default to 0.
        const startTime = 0;
        finalUri = await trimMediaAsync(asset.uri, MAX_VIDEO_DURATION, startTime);
        Alert.alert('Video Trimmed', 'Your video was trimmed to 40 seconds.');
      }
    }
    setMedia(prev => [...prev, finalUri]);
  };

  const handleSubmit = async () => {
    if (!title || !location || !budget || !date || !time) {
      Alert.alert('Error', 'Please fill in all mandatory fields.');
      return;
    }
    const eventData = {
      title,
      description,
      location,
      budget,
      date,
      time,
      media,
      host: {
        name: 'Current Host', // Replace with actual data
        profile_picture: 'https://via.placeholder.com/150',
      },
    };
    const createdEvent = await createEvent(eventData);
    if (createdEvent && createdEvent.id) {
      Alert.alert('Event Created', 'Your event has been created successfully.');
      navigation.navigate('EventDetails', { eventId: createdEvent.id });
    } else {
      Alert.alert('Error', 'Event creation failed.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Create Event</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Event Title"
          placeholderTextColor="#ccc"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Event Location"
          placeholderTextColor="#ccc"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TextInput
          value={budget}
          onChangeText={setBudget}
          placeholder="Budget"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#ccc"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TextInput
          value={time}
          onChangeText={setTime}
          placeholder="Time (HH:MM)"
          placeholderTextColor="#ccc"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Event Description"
          placeholderTextColor="#ccc"
          multiline
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, height: 150, marginBottom: 16 }}
        />
        <Text style={{ color: theme.colors.text, marginBottom: 8 }}>Media:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {media.map((uri, index) => (
            <Image key={index} source={{ uri }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>
        <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginBottom: 16 }} onPress={pickMedia}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Add Media</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }} onPress={handleSubmit}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
