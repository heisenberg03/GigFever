import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity, Text, RefreshControl, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getChatList } from '../api/api';
import { NotificationContext } from '../context/NotificationContext';
import { Ionicons } from '@expo/vector-icons';
import { styles as notificationStyles } from './HomeScreen';

export default function ChatListScreen({ navigation }: any) {
    const theme = useTheme();
    const [chats, setChats] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { updateUnreadCounts, unreadNotifications } = useContext(NotificationContext);

    const fetchChats = async () => {
        setRefreshing(true);
        const data = await getChatList();
        setChats(data);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleChatPress = (chat: any) => {
        console.log("Chat pressed:", chat);
        if (!chat.id) {
            console.error("Chat ID is missing!");
            return;
        }
        // Mark chat as read locally
        setChats(prev => prev.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c)));
        updateUnreadCounts();
        // Navigate to the dedicated ChatConversation route
        navigation.navigate('ChatConversation', { chatId: chat.id, userName: chat.name, profile_picture: chat.profile_picture });
    };

    const renderChat = ({ item }: any) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
            <View style={styles.chatInfo}>
                <View style={styles.profilePicContainer}>
                    {/* Replace with an Image component in production */}
                    <Ionicons name="person" size={40} color="#ccc" />
                </View>
                <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={[styles.chatName, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={{ color: theme.colors.text }}>{item.lastMessage}</Text>
                </View>
                {item.unread > 0 && (
                    <View style={styles.chatBadge}>
                        <Text style={styles.badgeText}>{item.unread}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal:16, backgroundColor: theme.colors.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Messages</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={notificationStyles.notificationButton}>
                    <Ionicons name="notifications" size={24} color={theme.colors.text} />
                    {unreadNotifications > 0 && (
                        <View style={notificationStyles.badge}>
                            <Text style={styles.badgeText}>{unreadNotifications}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            <FlatList
                data={chats}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderChat}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 16, color: theme.colors.text }}>No chats available</Text>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchChats} />}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    chatItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 8,
    },
    chatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatBadge: {
        backgroundColor: 'red',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
    },
});
