import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

/**
 * This screen handles both login and sign-up via phone number and OTP.
 * - Initially displays phone number input and "Get OTP" button.
 * - Once phone number is validated, reveals OTP input and changes button to "Login/Sign Up".
 */
export default function AuthScreen({ navigation }: any) {
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState('9784776837');
  const [otp, setOtp] = useState('12345');
  const [showOtpField, setShowOtpField] = useState(false);

  // Minimal validation for demonstration
  const handleGetOtp = () => {
    if (phoneNumber.length < 10) {
      // Show some error or toast in real implementation
      console.log('Please enter a valid phone number.');
      return;
    }
    // In a real app, trigger OTP generation here
    setShowOtpField(true);
  };

  const handleLogin = () => {
    if (otp.length < 4) {
      // Show some error or toast in real implementation
      console.log('Please enter a valid OTP.');
      return;
    }
    // In a real app, verify OTP and log the user in
    console.log('Logged in successfully!');
    navigation.navigate({ name: 'Main', params: { screen: 'Home' }
    });
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            {/* 
              Place your circle-dot inspired logo here.
              Example:
              <Image
                source={require('../assets/gighub_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            */}
            <Text style={[styles.logo, { color: theme.colors.text }]}>GigFever</Text>
            <Text style={[styles.appName, { color: theme.colors.text }]}>What's your Fever ?</Text>
          </View>

          {/* Auth Container */}
          <View style={styles.authContainer}>
            {!showOtpField && (
              <>
                <Text style={[styles.label, { color: theme.colors.text }]}> Let's Get it Started!</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.card,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </>
            )}

            {showOtpField && (
              <>
                <Text style={[styles.label, { color: theme.colors.text }]}>OTP</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.card,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholder="Enter OTP"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.colors.primary }]}
              onPress={!showOtpField ? handleGetOtp : handleLogin}
            >
              <Text style={styles.authButtonText}>
                {!showOtpField ? 'Get OTP' : 'Login / Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Social Login */}
            {!showOtpField && (
              <>
                <Text style={[styles.orText, { color: theme.colors.text }]}>Or login with</Text>
                <View style={styles.socialContainer}>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.card }]}>
                <Ionicons name="logo-google" size={24} color={theme.colors.text} />
                    <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="logo-apple" size={24} color={theme.colors.text} />
                    <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Apple</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 38,
    marginBottom: 10,
    marginTop: 40,
    fontFamily: 'copperplate',
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'light',
    fontFamily: 'copperplate',
  },
  authContainer: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  authButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  socialButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
});
