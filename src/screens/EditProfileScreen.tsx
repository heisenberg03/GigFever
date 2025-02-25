import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import CategoryDropdown from '../components/CategoryDropdown';
import { updateUserProfile } from '../api/api'; // replace with your API

const availableCategories = [
  'Music',
  'Dance',
  'Art',
  'Theatre',
  'Comedy',
  'Conference',
  'Workshop',
];

const EditProfileScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  // Simulated initial profile data; replace with real data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    bio: 'Artist, Musician & Performer.',
    profilePicture: 'https://via.placeholder.com/150',
    categories: ['Music', 'Dance'],
    socialAccounts: {
      instagram: true,
      facebook: false,
      youtube: true,
      twitter: false,
    },
  });
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(profile.categories);

  const saveProfileHandler = async () => {
    const updatedProfile = { ...profile, name, bio, profilePicture, categories: selectedCategories };
    try {
      // Replace with your actual update API call
      await updateUserProfile(updatedProfile);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const pickProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access media is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets || result.assets.length === 0) return;
    const asset = result.assets[0];
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        asset.uri,
        [],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setProfilePicture(manipResult.uri);
      // Optionally upload the new picture to your backend
    } catch (error) {
      console.error('Profile picture update error:', error);
      Alert.alert('Error', 'Failed to update profile picture.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={pickProfilePicture}>
          <Image source={{ uri: profilePicture }} style={styles.profilePic} />
          <Text style={[styles.changePicText, { color: theme.colors.primary }]}>
            Change Profile Picture
          </Text>
        </TouchableOpacity>
        <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.card, color: theme.colors.text }]}
          value={name}
          onChangeText={setName}
        />
        <Text style={[styles.label, { color: theme.colors.text }]}>Bio</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.card, color: theme.colors.text }]}
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <CategoryDropdown
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          label="Categories"
        />
      </ScrollView>
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={saveProfileHandler}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 80 },
  profilePic: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center' },
  changePicText: { textAlign: 'center', marginTop: 8 },
  label: { fontSize: 16, marginVertical: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  saveButton: { position: 'absolute', bottom: 20, left: 16, right: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EditProfileScreen;
