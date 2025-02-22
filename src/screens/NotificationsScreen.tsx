import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity, Text, RefreshControl, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getNotifications } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen({ navigation }: any) {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    setRefreshing(true);
    const data = await getNotifications();
    setNotifications(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = (notification: any) => {
    // Mark the notification as read
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    // Navigate to target screen if available
    if (notification.target) {
      navigation.navigate(notification.target, notification.params);
    } else {
      alert(notification.message);
    }
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.notification, { backgroundColor: item.read ? theme.colors.card : theme.colors.primary }]}
      onPress={() => handleNotificationPress(item)}
    >
      <Text style={[styles.notificationText, { color: theme.colors.text, fontWeight: item.read ? 'normal' : 'bold' }]}>
        {item.message}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={30} color={theme.colors.primary} />
      </TouchableOpacity>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Notifications</Text>     
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderNotification}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 16, color: theme.colors.text }}>
            No notifications
          </Text>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notification: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationText: {
    fontSize: 16,
  },
});
