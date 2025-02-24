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
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { updateProfile } from '../api/api';

const availableCategories = [
  'Music', 'Dance', 'Theatre', 'Comedy', 'Painting', 'Sculpture', 'Photography', 'Digital Art'
];

const EditProfileScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
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
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const saveProfileHandler = async () => {
    const updatedProfile = { ...profile, name, bio, profilePicture, categories: selectedCategories };
    const success = await updateProfile(updatedProfile);
    if (success) {
      navigation.goBack();
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
      // Upload new profile picture to cloud here if needed.
    } catch (error) {
      console.error('Profile picture update error:', error);
      Alert.alert('Error', 'Failed to update profile picture.');
    }
  };

  const filteredCategories = availableCategories.filter(cat =>
    cat.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity onPress={pickProfilePicture}>
          <Image source={{ uri: profilePicture }} style={styles.profilePic} />
          <Text style={[styles.changePicText, { color: theme.colors.primary }]}>Change Profile Picture</Text>
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
        <Text style={[styles.label, { color: theme.colors.text }]}>Categories</Text>
        <View style={styles.categoryContainer}>
          {selectedCategories.map((cat, index) => (
            <View key={index} style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.categoryText, { color: '#fff' }]}>{cat}</Text>
              <TouchableOpacity onPress={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}>
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addCategoryButton} onPress={() => setCategoryModalVisible(true)}>
            <Ionicons name="add" size={20} color={theme.colors.primary} />
            <Text style={[styles.addCategoryText, { color: theme.colors.primary }]}>Add Category</Text>
          </TouchableOpacity>
        </View>
        {/* Social Accounts Section */}
        <View style={styles.socialLinkContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social Media Accounts</Text>
          {Object.keys(profile.socialAccounts).map((platform) => (
            <View key={platform} style={styles.socialRow}>
              <Ionicons name={`logo-${platform}`} size={32} color={profile.socialAccounts[platform] ? theme.colors.primary : '#ccc'} />
              <Text style={[styles.socialText, { color: theme.colors.text }]}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
              {!profile.socialAccounts[platform] && (
                <TouchableOpacity style={styles.linkButton} onPress={() => {
                  navigation.navigate('SocialAuth', { platform });
                }}>
                  <Text style={[styles.linkButtonText, { color: theme.colors.primary }]}>Link</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={saveProfileHandler}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: theme.colors.background}]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Categories</Text>
            <TextInput
              style={[styles.searchInput, { borderColor: theme.colors.card, color: theme.colors.text }]}
              placeholder="Search categories"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    selectedCategories.includes(item) && styles.selectedCategoryOption,
                  ]}
                  onPress={() => {
                    if (!selectedCategories.includes(item)) {
                      setSelectedCategories(prev => [...prev, item]);
                    }
                  }}
                >
                  <Text style={{ color: selectedCategories.includes(item) ? '#fff' : theme.colors.text }}>{item}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.colors.primary }]} onPress={() => setCategoryModalVisible(false)}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  categoryText: { marginRight: 4 },
  addCategoryButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4caf50', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  addCategoryText: { marginLeft: 4 },
  socialLinkContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  socialRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  socialText: { flex: 1, marginLeft: 8, fontSize: 16 },
  linkButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  linkButtonText: { fontSize: 16 },
  saveButton: { position: 'absolute', bottom: 20, left: 16, right: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { margin: 16, padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  searchInput: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 16 },
  categoryOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectedCategoryOption: { backgroundColor: '#4caf50' },
  modalButton: { marginTop: 16, padding: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default EditProfileScreen;
