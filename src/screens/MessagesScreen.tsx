import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { getChatList } from '../api/api';
import { useTheme } from '../theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


export default function MessagesScreen({ navigation }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchChats = async () => {
    setRefreshing(true);
    const data = await getChatList();
    setChats(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Messages</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Ionicons name="notifications" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id, userName: item.name })}>
            <View style={{ padding: 16, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: 12 }}>
              <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: theme.colors.text }}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchChats} />}
      />
    </View>
    </SafeAreaView>
  );
}
