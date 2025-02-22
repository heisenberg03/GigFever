import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function BookingInstructionsScreen({ navigation }: any) {
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Booking Instructions</Text>
      <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
        1. Negotiate fee, advance payment, and timeline clearly before confirming the booking.
      </Text>
      <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
        2. The platform is not responsible for any disputes post-booking.
      </Text>
      <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
        3. Confirm that both parties are fully informed of payment terms, event plan, and performance expectations.
      </Text>
      <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
        4. After confirmation, phone numbers are exchanged for direct communication.
      </Text>
      <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginTop: 16 }} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
