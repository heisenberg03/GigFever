import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getEventApplications, sendInvitation, confirmBooking } from '../api/api';

export default function ManageEventApplicationsScreen({ route }: any) {
  const { eventId } = route.params;
  const theme = useTheme();
  const [applications, setApplications] = useState<any[]>([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const fetchApplications = async () => {
    const apps = await getEventApplications(eventId);
    setApplications(apps);
  };

  useEffect(() => {
    fetchApplications();
  }, [eventId]);

  const handleInvite = async (artistId: number) => {
    await sendInvitation(eventId, artistId);
    Alert.alert('Invitation Sent', `Artist ${artistId} invited.`);
    fetchApplications();
  };

  const handleConfirmBooking = async (artistId: number) => {
    await confirmBooking(eventId, artistId);
    Alert.alert('Booking Confirmed', `Booking confirmed for artist ${artistId}.`);
    fetchApplications();
  };

  const handleRejectApplication = (artistId: number) => {
    Alert.alert('Rejected', `Application for artist ${artistId} rejected.`);
    // Simulate rejection here
    fetchApplications();
  };

  const handleShowContact = (application: any) => {
    setSelectedApplication(application);
    setContactModalVisible(true);
  };

  const renderApplication = ({ item }: any) => (
    <View style={{ padding: 16, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: 12 }}>
      <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>{item.artistName}</Text>
      <Text style={{ color: theme.colors.text }}>Status: {item.status}</Text>
      {item.status === 'pending' && (
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 8, marginRight: 8 }} onPress={() => handleInvite(item.artistId)}>
            <Text style={{ color: '#fff' }}>Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'orange', padding: 8, borderRadius: 8, marginRight: 8 }} onPress={() => handleConfirmBooking(item.artistId)}>
            <Text style={{ color: '#fff' }}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'gray', padding: 8, borderRadius: 8 }} onPress={() => handleRejectApplication(item.artistId)}>
            <Text style={{ color: '#fff' }}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {item.status === 'confirmed' && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: 'green' }}>Seat Filled</Text>
          <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 8, marginTop: 8 }} onPress={() => handleShowContact(item)}>
            <Text style={{ color: '#fff' }}>View Contact</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Manage Applications</Text>
      <FlatList
        data={applications}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderApplication}
      />
      <Modal visible={contactModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.background, padding: 24, borderRadius: 12, width: '80%' }}>
            <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Contact Information</Text>
            <Text style={{ color: theme.colors.text }}>Host Phone: 123-456-7890</Text>
            <Text style={{ color: theme.colors.text, marginTop: 8 }}>Artist Phone: 987-654-3210</Text>
            <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }} onPress={() => setContactModalVisible(false)}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
