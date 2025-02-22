import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface UnifiedSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: () => void;
}

export default function UnifiedSearchBar({ searchQuery, setSearchQuery, onSubmit }: UnifiedSearchBarProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="Search artists, events, categories..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity onPress={onSubmit}>
        <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginHorizontal: 8 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
});
