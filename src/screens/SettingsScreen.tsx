import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Switch, Alert, StyleSheet, ScrollView } from 'react-native';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../theme/ThemeProvider';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }: any) {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout', onPress: () =>
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] }))
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: () => {
            // Simulate account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Settings</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>

        <ThemeSelector />

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.card, marginTop: 16 }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, width: '100%' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold' },
  button: { padding: 16, borderRadius: 8, marginTop: 16 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginTop: 16,
  },
  deleteButtonText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
});
