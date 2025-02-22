// /components/FilterModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { allCategories } from '../screens/HomeScreen';


export interface FiltersType {
  minBudget?: string;
  category?: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FiltersType) => void;
  includeLocation?: boolean;
}

export default function FilterModal({ visible, onClose, onApplyFilters }: FilterModalProps) {
  const theme = useTheme();
  const [minBudget, setMinBudget] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(allCategories);

  // Filter the categories list based on search input
  useEffect(() => {
    if (categorySearch === '') {
      setFilteredCategories(allCategories);
    } else {
      const filtered = allCategories.filter(cat =>
        cat.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearch]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApply = () => {
    onApplyFilters({ minBudget, category: selectedCategories });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filter Artists</Text>

          <Text style={[styles.label, { color: theme.colors.text }]}>Minimum Budget</Text>
          <TextInput
            value={minBudget}
            onChangeText={setMinBudget}
            placeholder="Enter minimum budget"
            placeholderTextColor="#ccc"
            style={[styles.textInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Categories</Text>
          <TextInput
            value={categorySearch}
            onChangeText={setCategorySearch}
            placeholder="Search categories..."
            placeholderTextColor="#ccc"
            style={[styles.textInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />

          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleCategory(item)}
                style={styles.categoryItem}
              >
                <Text style={{ color: theme.colors.text }}>{item}</Text>
                {selectedCategories.includes(item) && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
            style={{ maxHeight: 150, marginTop: 8 }}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: theme.colors.border }]}>
              <Text style={{ color: theme.colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ color: '#fff' }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
});
