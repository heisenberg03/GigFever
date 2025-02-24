import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import SocialPortfolioManager, { SocialPost } from '../components/SocialPortfolioManager';
import { fetchPortfolio, updatePortfolio } from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

const EditPortfolioScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const [portfolio, setPortfolio] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio();
        setPortfolio(data as SocialPost[]);
      } catch (error) {
        Alert.alert('Error', 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  const savePortfolioHandler = async () => {
    try {
      const success = await updatePortfolio(portfolio);
      if (success) {
        Alert.alert('Success', 'Portfolio updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update portfolio');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving portfolio');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flex: 1}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Edit Portfolio</Text>
        </View>
        {loading ? (
          <Text style={{ color: theme.colors.text }}>Loading portfolio...</Text>
        ) : (
          <SocialPortfolioManager portfolio={portfolio} setPortfolio={setPortfolio} />
        )}
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={savePortfolioHandler}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  saveButton: { marginTop: 24, padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  dragNote: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 },
});

export default EditPortfolioScreen;
