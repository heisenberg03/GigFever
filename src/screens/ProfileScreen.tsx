import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
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
    <TouchableOpacity style={{ flex: 1, margin: 2 }}>
      <Image source={{ uri: item.media_url }} style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} />
    </TouchableOpacity>
  );

  if (!profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header with floating settings icon at bottom right */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: profile.profile_picture }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }}>{profile.name}</Text>
            <Text style={{ color: theme.colors.text }}>Average Rating: {profile.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}</Text>
          </View>
        </View>
      </View>
      <ScrollView style={{ padding: 16 }}>
        {/* Categories */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}>Categories:</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            {profile.categories && profile.categories.map((cat: string, index: number) => (
              <View key={index} style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 8, marginRight: 8 }}>
                <Text style={{ color: '#fff' }}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={{ color: theme.colors.text }}>{profile.bio}</Text>

        {/* Portfolio Management */}
        <View>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>My Portfolio</Text>
          <PortfolioManager portfolio={portfolio} refreshPortfolio={fetchPortfolio} />
        </View>
        {/* My Events & My Bookings */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 }}>
          <TouchableOpacity
            style={{ backgroundColor: theme.colors.card, padding: 16, borderRadius: 8, flex: 1, marginRight: 8 }}
            onPress={() => navigation.navigate('MyEvents')}
          >
            <Text style={{ color: theme.colors.text, textAlign: 'center' }}>My Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: theme.colors.card, padding: 16, borderRadius: 8, flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate('MyBookings')}
          >
            <Text style={{ color: theme.colors.text, textAlign: 'center' }}>My Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: theme.colors.primary,
          padding: 12,
          borderRadius: 30,
          elevation: 5,
        }}
      >
        <Ionicons name="settings" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
