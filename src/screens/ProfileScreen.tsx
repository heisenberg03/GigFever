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
  Linking,
  View,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { fetchProfile } from '../api/api';

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
      }
    };
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  const handleSocialPress = (platform: string, account: { linked: boolean; url: string }) => {
    if (account.linked) {
      Linking.openURL(account.url).catch(() =>
        Alert.alert('Error', 'Failed to open URL')
      );
    } else {
      navigation.navigate('SocialAuth', { platform });
    }
  };

  const openPreview = (item: any) => {
    setPreviewItem(item);
    setPreviewVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: profile.profilePicture }} style={styles.profilePic} />
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{profile.name}</Text>
            <Text style={[styles.rating, { color: theme.colors.text }]}>Rating: {profile.averageRating.toFixed(1)}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Bio & Categories */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.bio, { color: theme.colors.text }]}>{profile.bio}</Text>
          <View style={styles.categoriesRow}>
            {profile.categories.map((cat: string, index: number) => (
              <View key={index} style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Profiles */}
        <View style={styles.socialRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social Profiles</Text>
          <Text style={styles.socialNote}>Link your social accounts to boost engagement and trust.</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('instagram', profile.socialAccounts.instagram)}>
              <Ionicons name="logo-instagram" size={32} color={profile.socialAccounts.instagram.linked ? theme.colors.primary : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('facebook', profile.socialAccounts.facebook)}>
              <Ionicons name="logo-facebook" size={32} color={profile.socialAccounts.facebook.linked ? theme.colors.primary : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('youtube', profile.socialAccounts.youtube)}>
              <Ionicons name="logo-youtube" size={32} color={profile.socialAccounts.youtube.linked ? theme.colors.primary : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('twitter', profile.socialAccounts.twitter)}>
              <Ionicons name="logo-twitter" size={32} color={profile.socialAccounts.twitter.linked ? theme.colors.primary : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Preview */}
        <View style={styles.portfolioSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Portfolio</Text>
          <ScrollView horizontal contentContainerStyle={styles.portfolioScroll}>
            {profile.portfolio.map((item: any) => (
              <TouchableOpacity key={item.id} onPress={() => openPreview(item)}>
                <Image source={{ uri: item.thumbnail }} style={styles.portfolioThumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.editPortfolioButton} onPress={() => navigation.navigate('EditPortfolio')}>
            <Text style={[styles.editPortfolioText, { color: theme.colors.primary }]}>Edit Portfolio</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Options */}
        <View style={styles.bottomOptions}>
          <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MyEvents')}>
            <Ionicons name="calendar" size={24} color={theme.colors.primary} />
            <Text style={[styles.bottomOptionText, { color: theme.colors.text }]}>My Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('MyBookings')}>
            <Ionicons name="book" size={24} color={theme.colors.primary} />
            <Text style={[styles.bottomOptionText, { color: theme.colors.text }]}>My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomOption} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color={theme.colors.primary} />
            <Text style={[styles.bottomOptionText, { color: theme.colors.text }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
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
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  profilePic: { width: 80, height: 80, borderRadius: 40 },
  headerText: { flex: 1, marginLeft: 12 },
  name: { fontSize: 20, fontWeight: 'bold' },
  rating: { fontSize: 14 },
  editButton: { padding: 8 },
  detailsContainer: { marginBottom: 16 },
  bio: { fontSize: 16, marginBottom: 8 },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginRight: 8, marginBottom: 4 },
  categoryText: { color: '#fff' },
  socialNote: { fontSize: 12, color: '#999', marginBottom: 8 },
  socialIcon: { marginRight: 16 },
  socialRow: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  socialIcons: { flexDirection: 'row', marginBottom: 4 },
  bottomOptions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#ccc' },
  bottomOption: { alignItems: 'center' },
  bottomOptionText: { marginTop: 4, fontSize: 14 },
  portfolioSection: { marginBottom: 16 },
  portfolioScroll: { alignItems: 'center' },
  portfolioThumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  editPortfolioButton: { alignSelf: 'center', marginTop: 8 },
  editPortfolioText: { fontSize: 16, textDecorationLine: 'underline' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalClose: { position: 'absolute', top: 40, right: 20 },
  previewMedia: { width: '90%', height: '70%', borderRadius: 12 },
  videoWrapper: { width: '90%', height: '70%' },
});

export default ProfileScreen;
