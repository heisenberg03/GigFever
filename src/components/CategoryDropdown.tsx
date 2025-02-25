import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

type CategoryDropdownProps = {
  availableCategories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  label?: string;
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  availableCategories,
  selectedCategories,
  setSelectedCategories,
  label,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const filteredCategories = availableCategories.filter((cat) =>
    cat.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ color: theme.colors.text, fontSize: 16, marginVertical: 8 }}>{label}</Text>
      )}
        <View style={styles.categoryContainer}>

                {selectedCategories.map((cat, index) => (
                  <View key={index} style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.categoryText, { color: theme.colors.text }]}>{cat}</Text>
                    <TouchableOpacity onPress={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}>
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addCategoryButton} onPress={() => setModalVisible(true)}>
                  <Ionicons name="add" size={20} color={theme.colors.primary} />
                  <Text style={[styles.addCategoryText, { color: theme.colors.primary }]}>Add Category</Text>
                </TouchableOpacity>
                </View>
      {/* Modal for category selection */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Categories
            </Text>
            <TextInput
              style={[
                styles.searchInput,
                { borderColor: theme.colors.card, color: theme.colors.text },
              ]}
              placeholder="Search categories"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    selectedCategories.includes(item) && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => toggleCategory(item)}
                >
                  <Text
                    style={{
                      color: selectedCategories.includes(item) ? '#fff' : theme.colors.text,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 16 },
  modalContent: {
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryOption: {
    padding: 12,
    marginBottom: 4,
    borderRadius: 8,
  },
  doneButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  categoryText: { marginRight: 4 },
  addCategoryButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4caf50', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  addCategoryText: { marginLeft: 4 },
});

export default CategoryDropdown;
