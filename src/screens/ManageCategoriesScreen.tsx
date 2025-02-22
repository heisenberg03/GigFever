import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getUserProfile, updateUserCategories } from '../api/api';

export default function ManageCategoriesScreen({ navigation }: any) {
  const theme = useTheme();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    getUserProfile().then(profile => {
      setCategories(profile.categories || []);
    });
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    setNewCategory('');
    updateUserCategories(updated);
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    updateUserCategories(updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Manage Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: theme.colors.text, flex: 1 }}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveCategory(item)} style={{ backgroundColor: 'red', padding: 8, borderRadius: 8 }}>
              <Text style={{ color: '#fff' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        value={newCategory}
        onChangeText={setNewCategory}
        placeholder="Add new category"
        placeholderTextColor="#ccc"
        style={{ backgroundColor: theme.colors.card, padding: 12, borderRadius: 8, color: theme.colors.text, marginVertical: 16 }}
      />
      <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }} onPress={handleAddCategory}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Add Category</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: theme.colors.card, padding: 16, borderRadius: 8, marginTop: 16 }} onPress={() => navigation.goBack()}>
        <Text style={{ color: theme.colors.text, textAlign: 'center' }}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}
