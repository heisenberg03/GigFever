import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Alert,
  View,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { fetchPortfolio, updatePortfolio } from '../api/api';
import { SocialPost } from '../components/SocialPortfolioManager';

const EditPortfolioScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const [portfolio, setPortfolio] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<SocialPost | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio();
        setPortfolio(data as SocialPost[]);
      } catch (error) {
        Alert.alert('Error', 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  const savePortfolioHandler = async () => {
    try {
      const success = await updatePortfolio(portfolio);
      if (success) {
        Alert.alert('Success', 'Portfolio updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update portfolio');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving portfolio');
    }
  };

  const renderPortfolioItem = ({ item }: { item: SocialPost }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setPreviewItem(item);
        setPreviewVisible(true);
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.itemThumbnail} />
      <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setPortfolio((prev) => prev.filter((post) => post.id !== item.id))}
      >
        <Ionicons name="close-circle" size={20} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Edit Portfolio</Text>
        {loading ? (
          <Text style={{ color: theme.colors.text }}>Loading portfolio...</Text>
        ) : (
          <FlatList
            data={portfolio}
            renderItem={renderPortfolioItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
          />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('SocialMediaSelection', { currentPortfolio: portfolio, setPortfolio })
          }
        >
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>Add Social Content</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={savePortfolioHandler}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setPreviewVisible(false)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {previewItem ? (
            previewItem.media_type === 'image' ? (
              <Image source={{ uri: previewItem.url }} style={styles.previewMedia} />
            ) : (
              <View style={styles.videoWrapper}>
                <Video
                  source={{ uri: previewItem.url }}
                  style={styles.previewMedia}
                  shouldPlay
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  onError={(error) => {
                    console.error('Video error:', error);
                    Alert.alert('Error', 'Failed to load video preview');
                  }}
                />
              </View>
            )
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 80 },
  gridContainer: { padding: 8 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  itemContainer: { flex: 1, margin: 8, alignItems: 'center', position: 'relative' },
  itemThumbnail: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  itemTitle: { marginTop: 4, fontSize: 14, textAlign: 'center' },
  deleteButton: { position: 'absolute', top: 4, right: 4 },
  addButton: {
    backgroundColor: '#eee',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { fontSize: 16 },
  saveButton: { marginTop: 24, padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalClose: { position: 'absolute', top: 40, right: 20 },
  previewMedia: { width: '90%', height: '70%', borderRadius: 12 },
  videoWrapper: { width: '90%', height: '70%' },
});

export default EditPortfolioScreen;
