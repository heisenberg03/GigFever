import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getArtistProfile, getReviews } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function ArtistProfileScreen({ route, navigation }: any) {
  const { artistId } = route.params;
  const theme = useTheme();
  const [artist, setArtist] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchArtistProfile = async () => {
    const data = await getArtistProfile(artistId);
    setArtist(data);
  };

  const fetchReviews = async (pageNum = 1) => {
    const data = await getReviews(artistId);
    if (pageNum === 1) {
      setReviews(data);
    } else {
      setReviews(prev => [...prev, ...data]);
    }
  };

  useEffect(() => {
    fetchArtistProfile();
    fetchReviews();
  }, [artistId]);

  const loadMoreReviews = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchReviews(nextPage);
    setLoadingMore(false);
  };

  const renderPortfolioItem = ({ item }: any) => (
    <View style={{ flex: 1, margin: 2 }}>
      <Image source={{ uri: item.media_url }} style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} />
    </View>
  );

  const renderReview = ({ item }: any) => (
    <View style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="star" size={20} color="#FFD700" />
        <Text style={{ color: theme.colors.text, marginLeft: 4, fontWeight: 'bold' }}> {item.rating}</Text>
      </View>
      <Text style={{ color: theme.colors.text }}>{item.review}</Text>
    </View>
  );

  if (!artist) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.colors.primary, fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ padding: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: artist.profile_picture }} style={{ width: 120, height: 120, borderRadius: 60 }} />
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>{artist.name}</Text>
          <Text style={{ color: theme.colors.text, marginTop: 4 }}>{artist.bio}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={{ color: theme.colors.text, marginLeft: 4, fontSize: 20, fontWeight: 'bold' }}>
              {artist.averageRating ? artist.averageRating.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
        {/* Categories */}
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}>Categories:</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            {artist.categories && artist.categories.map((cat: string, index: number) => (
              <View key={index} style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 8, marginRight: 8 }}>
                <Text style={{ color: '#fff' }}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Portfolio */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Portfolio</Text>
          <FlatList
            data={artist.portfolio}
            renderItem={renderPortfolioItem}
            keyExtractor={(item: any) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
        {/* Reviews */}
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Reviews</Text>
          <FlatList
            data={reviews}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={renderReview}
            onEndReached={loadMoreReviews}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <ActivityIndicator color={theme.colors.primary} /> : null}
          />
        </View>
      </ScrollView>
      {/* Sticky Buttons */}
      <View style={{ position: 'absolute', bottom: 20, right: 20, flexDirection: 'column' }}>
        <TouchableOpacity
          style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 30, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => navigation.navigate('InviteArtist', { artistId })}
        >
          <Ionicons name="mail" size={24} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 8 }}>Invite to Your Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => navigation.navigate('Chat', { chatId: 1, userName: artist.name })}
        >
          <Ionicons name="chatbubbles" size={24} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 8 }}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
