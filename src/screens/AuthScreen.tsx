import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import * as AuthSession from 'expo-auth-session';

export default function AuthScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [agreed, setAgreed] = useState(false);
  const theme = useTheme();

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid phone number');
      return;
    }
    if (!agreed) {
      Alert.alert('Consent Required', 'Please agree to the Terms & Conditions to proceed.');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else {
      Alert.alert('Invalid OTP');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (!agreed) {
      Alert.alert('Consent Required', 'Please agree to the Terms & Conditions to proceed.');
      return;
    }
    const authUrl =
      provider === 'google'
        ? 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=https://auth.expo.io/@yourusername/gigfever&response_type=token&scope=profile%20email'
        : 'https://appleid.apple.com/auth/authorize?client_id=YOUR_APPLE_CLIENT_ID&redirect_uri=https://auth.expo.io/@yourusername/gigfever&response_type=code%20id_token&scope=name%20email';
    try {
      // Cast AuthSession as any to avoid the TypeScript error
      const result = await (AuthSession as any).startAsync({ authUrl });
      if (result.type === 'success') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('Login cancelled');
      }
    } catch (error: any) {
      Alert.alert('Login error', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: 16 }}>
      {step === 'phone' ? (
        <>
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            Enter your phone number
          </Text>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Switch value={agreed} onValueChange={setAgreed} />
            <Text style={{ marginLeft: 8, color: theme.colors.text }}>I agree to the Terms & Conditions</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }} onPress={handleSendOtp}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Send OTP</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.colors.text, textAlign: 'center', marginTop: 16 }}>Or login with</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
            <TouchableOpacity onPress={() => handleSocialLogin('google')}>
              <Text style={{ color: theme.colors.primary }}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSocialLogin('apple')}>
              <Text style={{ color: theme.colors.primary }}>Apple</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Enter OTP</Text>
          <TextInput
            placeholder="OTP"
            placeholderTextColor="#ccc"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginBottom: 16 }}
          />
          <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }} onPress={handleVerifyOtp}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}
