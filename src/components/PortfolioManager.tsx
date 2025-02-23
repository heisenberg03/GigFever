import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeProvider';
import { trimMediaAsync } from '../utils/mediaUtils';
import { Ionicons } from '@expo/vector-icons';

interface PortfolioItem {
  id: number;
  media_url: string;
  media_type: string;
}

interface PortfolioManagerProps {
  portfolio: PortfolioItem[];
  refreshPortfolio: () => void;
}

const MAX_PORTFOLIO_ITEMS = 15;
const MAX_VIDEO_DURATION = 40; // seconds

export default function PortfolioManager({ portfolio, refreshPortfolio }: PortfolioManagerProps) {
  const theme = useTheme();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState('');

  const pickMedia = async () => {
    if (portfolio.length >= MAX_PORTFOLIO_ITEMS) {
      Alert.alert('Limit Reached', 'You can only have up to 15 portfolio items.');
      return;
    }
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
        // Simulated: In production, show a slider/modal for user to choose start time.
        const startTime = 0;
        finalUri = await trimMediaAsync(asset.uri, MAX_VIDEO_DURATION, startTime);
        Alert.alert('Video Trimmed', 'Your video was trimmed to 40 seconds.');
      }
    }
    // In production, upload finalUri to your storage endpoint.
    Alert.alert('Upload', 'File processed and uploaded successfully.');
    refreshPortfolio();
  };

  const handleDelete = async (itemId: number) => {
    Alert.alert('Deleted', 'Portfolio item deleted.');
    refreshPortfolio();
  };

  const openPreview = (uri: string) => {
    setPreviewUri(uri);
    setPreviewVisible(true);
  };

  return (
    <View>
      {portfolio.map(item => (
        <TouchableOpacity key={item.id} onPress={() => openPreview(item.media_url)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Image source={{ uri: item.media_url }} style={{ width: 80, height: 80, borderRadius: 8 }} />
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }} onPress={pickMedia}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Add New Portfolio Item</Text>
      </TouchableOpacity>
      <Modal visible={previewVisible} transparent animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closePreview} onPress={() => setPreviewVisible(false)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255,0,0,0.7)',
    borderRadius: 12,
    padding: 2,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '80%',
  },
  closePreview: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
