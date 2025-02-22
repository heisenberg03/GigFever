import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getChatMessages, sendMessage } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function ChatConversationScreen({ route, navigation }: any) {
  const { chatId = 0, userName = 'Chat', profile_picture } = route.params || {};
  const theme = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async () => {
    setRefreshing(true);
    const data = await getChatMessages(chatId);
    setMessages(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = await sendMessage(chatId, input);
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    }
  };

  const renderMessage = ({ item }: any) => (
    <View style={[styles.messageContainer, { alignSelf: item.isSent ? 'flex-end' : 'flex-start', backgroundColor: item.isSent ? theme.colors.primary : theme.colors.card }]}>
      <Text style={{ color: item.isSent ? '#fff' : theme.colors.text }}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            {profile_picture ? (
              <Image source={{ uri: profile_picture }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <Text style={{ color: '#ccc' }}>?</Text>
              </View>
            )}
            <Text style={[styles.chatHeaderName, { color: theme.colors.text }]}>{userName}</Text>
          </View>
        </View>
        {refreshing && <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 16 }} />}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => renderMessage({ item })}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMessages} />}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#ccc"
            style={[styles.textInput, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePicPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderName: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    maxWidth: '75%',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    borderRadius: 8,
  },
  sendButton: {
    justifyContent: 'center',
  },
});
