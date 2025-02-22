import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
export type SortOption = {
  label: string;
  value: string;
};

export type SelectedSort = {
  field: string;
  order: 'asc' | 'desc';
};

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onApplySort: (selectedSort: SelectedSort) => void;
  currentSort: SelectedSort;
  sortOptions: SortOption[];
}

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onApplySort,
  currentSort,
  sortOptions,
}) => {
  const [localSort, setLocalSort] = useState<SelectedSort>(currentSort);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      setLocalSort(currentSort);
    }
  }, [currentSort, visible]);

  const handleOptionPress = (option: SortOption) => {
    if (localSort.field === option.value) {
      // Toggle order
      setLocalSort({
        field: option.value,
        order: localSort.order === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setLocalSort({ field: option.value, order: 'asc' });
    }
  };

  const handleApply = () => {
    onApplySort(localSort);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Sort Options</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton, {backgroundColor:theme.colors.background},
                localSort.field === option.value && { backgroundColor: theme.colors.primary } ,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <Text
                style={[
                  styles.optionText,{color:theme.colors.text},
                  localSort.field === option.value && styles.selectedText,
                ]}
              >
                {option.label} {localSort.field === option.value ? (localSort.order === 'asc' ? '↑' : '↓') : ''}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.cancelButton,{backgroundColor:theme.colors.border}]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.applyButton,{backgroundColor:theme.colors.primary}]} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply Sort</Text>
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
    borderRadius: 10, 
    padding: 20, 
    maxHeight: '80%' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  optionButton: { 
    padding: 10, 
    marginVertical: 5, 
    borderRadius: 5 
  },
  selectedOption: { 
    backgroundColor: '#4caf50' 
  },
  optionText: { 
    fontSize: 16, 
    textAlign: 'center' 
  },
  selectedText: { 
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

export default SortModal;
