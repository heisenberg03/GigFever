import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeProvider';

const themeOptions = [
  { label: "System Default", value: "system" },
  { label: "Light Mode", value: "light" },
  { label: "Dark Mode", value: "dark" },
];

export default function ThemeSelector() {
  const { themeMode, setThemeMode, theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      {themeOptions.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            themeMode === option.value && styles.selectedOption,
          ]}
          onPress={() => setThemeMode(option.value)}
        >
          <Text style={[
            styles.optionText,
            themeMode === option.value && styles.selectedText
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#ff3366',
  },
  optionText: { fontSize: 14, color: '#333' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
});
