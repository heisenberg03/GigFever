import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getUserLocation, updateUserLocation } from '../api/api';
import { useTheme } from '../theme/ThemeProvider';

export default function LocationSelectionScreen({ navigation }: any) {
  const [location, setLocation] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchLocation = async () => {
      const loc = await getUserLocation();
      setLocation(loc);
    };
    fetchLocation();
  }, []);

  const handleSave = async () => {
    await updateUserLocation(location);
    Alert.alert('Location Updated', 'Your location has been updated.');
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16, justifyContent: 'center' }}>
      <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Select Your Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
        placeholderTextColor="#ccc"
        style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
      />
      <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }} onPress={handleSave}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
}
