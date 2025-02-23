import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getUserProfile, getArtistProfile } from '../api/api';
import PortfolioManager from '../components/PortfolioManager';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);

  const fetchProfile = async () => {
    const data = await getUserProfile();
    setProfile(data);
  };

  const fetchPortfolio = async () => {
    const data = await getArtistProfile(1); // current user's artist ID is 1
    setPortfolio(data.portfolio);
  };

  useEffect(() => {
    fetchProfile();
    fetchPortfolio();
  }, []);

  const renderPortfolioItem = ({ item }: any) => (
    <TouchableOpacity style={styles.portfolioItem}>
      <Image source={{ uri: item.media_url }} style={styles.portfolioImage} />
    </TouchableOpacity>
  );

  if (!profile) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={[styles.headerCard, { borderColor: theme.colors.card }]}>
          <Image source={{ uri: profile.profile_picture }} style={styles.profilePic} />
          <View style={styles.headerTextContainer}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{profile.name}</Text>
            <Text style={[styles.rating, { color: theme.colors.text }]}>
              Average Rating: {profile.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Categories & Bio Section */}
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
          <View style={styles.categoriesRow}>
            {profile.categories && profile.categories.map((cat: string, index: number) => (
              <View
                key={index}
                style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.bioText, { color: theme.colors.text }]}>{profile.bio}</Text>
        </View>

        {/* Portfolio Management Section */}
        <View style={styles.portfolioSection}>
          <View style={styles.portfolioHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>My Portfolio</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditPortfolio')}>
              <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>
          <PortfolioManager portfolio={portfolio} refreshPortfolio={fetchPortfolio} />
        </View>

        {/* My Events & My Bookings */}
        <View style={styles.eventsBookingsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('MyEvents')}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>My Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('MyBookings')}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>My Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Floating Settings Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={[styles.settingsButton, { backgroundColor: theme.colors.primary }]}
      >
        <Ionicons name="settings" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
  },
  profilePic: { width: 80, height: 80, borderRadius: 40 },
  headerTextContainer: { marginLeft: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  rating: { fontSize: 14 },
  detailsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  categoryBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  categoryText: { color: '#fff', fontSize: 14 },
  bioText: { fontSize: 16, lineHeight: 22 },
  portfolioSection: { marginBottom: 20 },
  portfolioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  editText: { fontSize: 16 },
  eventsBookingsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  actionButton: { flex: 1, padding: 16, borderRadius: 8, marginHorizontal: 8 },
  actionButtonText: { fontSize: 16, textAlign: 'center' },
  settingsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
  portfolioItem: { flex: 1, margin: 2 },
  portfolioImage: { width: '100%', aspectRatio: 1, borderRadius: 8 },
});

