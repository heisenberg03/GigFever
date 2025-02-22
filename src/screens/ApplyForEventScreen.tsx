import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { submitApplication } from '../api/api';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApplyForEventScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [coverLetter, setCoverLetter] = useState('');
  const theme = useTheme();

  const handleApply = async () => {
    if (!coverLetter) {
      Alert.alert('Error', 'Please provide a cover letter.');
      return;
    }
    await submitApplication(eventId, coverLetter);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Application Submitted',
        body: 'Your application for the event has been received!',
      },
      trigger: null,
    });
    Alert.alert('Success', 'Your application has been submitted.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Apply for Event</Text>
      <TextInput
        value={coverLetter}
        onChangeText={setCoverLetter}
        placeholder="Cover Letter"
        placeholderTextColor="#ccc"
        multiline
        style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, height: 150 }}
      />
      <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }} onPress={handleApply}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Submit Application</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}
