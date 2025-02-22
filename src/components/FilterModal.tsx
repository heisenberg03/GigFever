import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext, useTheme } from '../theme/ThemeProvider';
export interface FiltersType {
  // For now, filtering by category (string or array)
  category?: string | string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (selectedCategories: string[]) => void;
  selectedCategories: string[];
  availableCategories?: string[];
}

const defaultCategories = ["Music", "Exhibition", "Dance", "Comedy", "Theatre"];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  selectedCategories,
  availableCategories = defaultCategories,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCategories);
  const theme = useTheme();
  useEffect(() => {
    if (visible) {
      setLocalSelected(selectedCategories);
    }
  }, [selectedCategories, visible]);

  const toggleCategory = (cat: string) => {
    setLocalSelected(prev =>
      prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    onApplyFilters(localSelected);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Filter Categories</Text>
          <ScrollView contentContainerStyle={styles.categoriesContainer}>
            {availableCategories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,  {backgroundColor:theme.colors.background},
                  localSelected.includes(cat) && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => toggleCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,{color:theme.colors.text},
                    localSelected.includes(cat) && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.cancelButton,{backgroundColor:theme.colors.border}]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.applyButton, {backgroundColor:theme.colors.primary}]} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    margin: 20, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 20, 
    maxHeight: '80%' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  categoriesContainer: { 
    paddingVertical: 10 
  },
  categoryButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  categoryText: { 
    fontSize: 16, 
    textAlign: 'center' 
  },
  selectedCategoryText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },
  cancelButton: { 
    flex: 1, 
    marginRight: 10, 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  applyButton: { 
    flex: 1, 
    marginLeft: 10, 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default FilterModal;
