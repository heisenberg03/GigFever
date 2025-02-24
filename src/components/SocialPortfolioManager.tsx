import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { fetchSocialMediaPosts } from '../api/api';

export type SocialPost = {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'twitter';
  thumbnail: string;
  title: string;
  url: string;
};

type SocialPortfolioManagerProps = {
  portfolio: SocialPost[];
  setPortfolio: React.Dispatch<React.SetStateAction<SocialPost[]>>;
};

const SocialPortfolioManager: React.FC<SocialPortfolioManagerProps> = ({ portfolio, setPortfolio }) => {
  const theme = useTheme();
  const [platformModalVisible, setPlatformModalVisible] = useState<boolean>(false);
  const [mediaModalVisible, setMediaModalVisible] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'instagram' | 'youtube' | 'twitter' | null>(null);
  const [availablePosts, setAvailablePosts] = useState<SocialPost[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState<SocialPost[]>([]);

  // Renders each portfolio item in a 3-column grid.
  const renderPortfolioItem = ({ item }: { item: SocialPost }) => (
    <View style={[styles.postItem, { backgroundColor: theme.colors.background }]}>
      <Image source={{ uri: item.thumbnail }} style={styles.postThumbnail} />
      <Text style={[styles.postTitle, { color: theme.colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setPortfolio(prev => prev.filter((post) => post.id !== item.id))}
      >
        <Ionicons name="close-circle" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Opens the platform selection modal
  const openPlatformModal = () => {
    setPlatformModalVisible(true);
  };

  // When a platform is chosen, fetch posts and show the media selection modal
  const selectPlatform = async (platform: 'facebook' | 'instagram' | 'youtube' | 'twitter') => {
    setSelectedPlatform(platform);
    setPlatformModalVisible(false);
    // Replace with your actual API call
    const posts = await fetchSocialMediaPosts(platform);
    setAvailablePosts(posts as SocialPost[]);
    setMediaModalVisible(true);
  };

  // Add selected items to the portfolio (duplicates are allowed)
  const addSelectedPosts = () => {
    setPortfolio(prev => [...prev, ...selectedToAdd]);
    setSelectedToAdd([]);
    setMediaModalVisible(false);
  };

  // Renders each post in the media selection modal
  const renderAvailableItem = ({ item }: { item: SocialPost }) => {
    const isSelected = selectedToAdd.some(post => post.id === item.id);
    return (
      <TouchableOpacity
        style={[
          styles.availablePostItem,
          isSelected && styles.selectedItem,
          { backgroundColor: theme.colors.card },
        ]}
        onPress={() => {
          if (isSelected) {
            setSelectedToAdd(prev => prev.filter(post => post.id !== item.id));
          } else {
            setSelectedToAdd(prev => [...prev, item]);
          }
        }}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.availableThumbnail} />
        <Text style={[styles.availableTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Main portfolio grid */}
      <FlatList
        data={portfolio}
        keyExtractor={(item) => item.id}
        renderItem={renderPortfolioItem}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
      {/* Add Social Content Button */}
      <TouchableOpacity style={[styles.addContentButton, { backgroundColor: theme.colors.text }]} onPress={openPlatformModal}>
        <Text style={[styles.addContentText, { color: theme.colors.primary }]}>Add Social Media Content</Text>
      </TouchableOpacity>

      {/* Platform Selection Modal */}
      <Modal
        visible={platformModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlatformModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Social Platform</Text>
            {(['instagram', 'facebook', 'youtube', 'twitter'] as const).map(platform => (
              <TouchableOpacity
                key={platform}
                style={styles.platformButton}
                onPress={() => selectPlatform(platform)}
              >
                <Ionicons name={`logo-${platform}`} size={32} color={theme.colors.primary} />
                <Text style={[styles.platformText, { color: theme.colors.text }]}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setPlatformModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Media Selection Modal */}
      <Modal
        visible={mediaModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMediaModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView style={{ flex: 1 }}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {selectedPlatform
                  ? `Select from ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`
                  : 'Select Media'}
              </Text>
              <FlatList
                data={availablePosts}
                keyExtractor={(item) => item.id}
                renderItem={renderAvailableItem}
                numColumns={2}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.background }]}
                  onPress={() => setMediaModalVisible(false)}
                >
                  <Text style={{ color: theme.colors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                  onPress={addSelectedPosts}
                >
                  <Text style={{ color: theme.colors.text }}>Add Selected</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridContainer: { padding: 8 },
  postItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    position: 'relative',
  },
  postThumbnail: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  postTitle: { marginTop: 4, fontSize: 14, textAlign: 'center' },
  deleteButton: { position: 'absolute', top: 4, right: 4 },
  addContentButton: {
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addContentText: { fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 16 },
  modalContent: { padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  platformButton: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 12 },
  platformText: { marginLeft: 12, fontSize: 18 },
  modalButton: { padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center', marginTop: 12 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  availablePostItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  availableThumbnail: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  availableTitle: { marginTop: 4, fontSize: 14, textAlign: 'center' },
  selectedItem: { borderColor: '#4caf50', borderWidth: 2 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
});

export default SocialPortfolioManager;
