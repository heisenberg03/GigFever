import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeProvider';
import { updateUserProfile, getUserProfile } from '../api/api';

export default function ProfileEditScreen({ navigation }: any) {
  const theme = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [categories, setCategories] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const fetchProfile = async () => {
    const data = await getUserProfile();
    setProfile(data);
    setName(data.name);
    setBio(data.bio);
    setCategories(data.categories.join(', '));
    setProfilePic(data.profile_picture);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const pickProfilePic = async () => {
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
    setProfilePic(asset.uri);
  };

  const handleSave = async () => {
    const updatedProfile = { name, bio, categories: categories.split(',').map(c => c.trim()), profile_picture: profilePic };
    await updateUserProfile(updatedProfile);
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    navigation.goBack();
  };

  if (!profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Edit Profile</Text>
        <TouchableOpacity onPress={pickProfilePic}>
          <Image source={{ uri: profilePic }} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 }} />
          <Text style={{ textAlign: 'center', color: theme.colors.primary }}>Change Profile Picture</Text>
        </TouchableOpacity>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#ccc"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Bio"
          placeholderTextColor="#ccc"
          multiline
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, height: 100, marginBottom: 16 }}
        />
        <TextInput
          value={categories}
          onChangeText={setCategories}
          placeholder="Categories (comma separated)"
          placeholderTextColor="#ccc"
          style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
        />
        <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }} onPress={handleSave}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
