import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  View,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../theme/ThemeProvider';
import CategoryDropdown from '../components/CategoryDropdown';

const availableCategories = [
  'Music',
  'Dance',
  'Art',
  'Theatre',
  'Comedy',
  'Conference',
  'Workshop',
];

const EventCreationScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const [eventProfilePic, setEventProfilePic] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  const pickEventProfilePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access media is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets || result.assets.length === 0) return;
    const asset = result.assets[0];
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        asset.uri,
        [],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setEventProfilePic(manipResult.uri);
      // Optionally upload this image to your backend here.
    } catch (error) {
      console.error('Event profile picture update error:', error);
      Alert.alert('Error', 'Failed to update event profile picture.');
    }
  };

  const showDatePickerModal = () => {
    setDatePickerMode('date');
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDateTime(selectedDate);
      
      // On Android, we need to show the time picker after date is selected
      if (Platform.OS === 'android' && datePickerMode === 'date') {
        setDatePickerMode('time');
        setTimeout(() => {
          setShowDatePicker(true);
        }, 100);
      }
    }
  };

  const handleCreateEvent = async () => {
    if (!title || !location) {
      Alert.alert('Missing Fields', 'Please fill all required fields and select a date/time.');
      return;
    }
    
    try {
      const eventData = {
        title,
        description,
        location,
        categories: selectedCategories,
        dateTime: dateTime.toISOString(),
        eventProfilePic,
      };
      
      // Using a mock success response since the createEvent function is commented out
      const success = true; // await createEvent(eventData);
      
      if (success) {
        Alert.alert('Success', 'Event created successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      Alert.alert('Error', 'An error occurred while creating the event');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Event Profile Picture at the Top */}
        <Text style={[styles.label, { color: theme.colors.text }]}>Event Profile Picture</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickEventProfilePic}>
          {eventProfilePic ? (
            <Image source={{ uri: eventProfilePic }} style={styles.eventImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="image" size={32} color={theme.colors.text} />
              <Text style={{ color: theme.colors.text, marginTop: 4 }}>
                Upload an image (for event card & details)
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.card, color: theme.colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Event title"
          placeholderTextColor="#999"
        />

        {/* Description */}
        <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            { borderColor: theme.colors.card, color: theme.colors.text },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Event description / expectations from artist ( if any specific ) / points to attract artists"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        {/* Location */}
        <Text style={[styles.label, { color: theme.colors.text }]}>Location</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.card, color: theme.colors.text }]}
          value={location}
          onChangeText={setLocation}
          placeholder="Where is it happening?"
          placeholderTextColor="#999"
        />

        {/* Category Dropdown */}
        <CategoryDropdown
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          label="Categories"
        />

        {/* Date & Time */}
        <Text style={[styles.label, { color: theme.colors.text }]}>Date & Time</Text>
        <TouchableOpacity
          style={[styles.datetimeButton, { backgroundColor: theme.colors.card }]}
          onPress={showDatePickerModal}
        >
          <Ionicons name="calendar" size={20} color={theme.colors.text} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.colors.text }}>
            {dateTime ? dateTime.toLocaleString() : 'Select Date & Time'}
          </Text>
        </TouchableOpacity>
        
        {/* Date Time Picker - Android */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateTime}
            mode={datePickerMode}
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
        
        {/* Date Time Picker - iOS */}
        {Platform.OS === 'ios' && (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateTime}
                  mode="datetime"
                  display="inline"
                  onChange={onDateChange}
                />
                <TouchableOpacity 
                  style={styles.modalCloseButton} 
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={{ color: theme.colors.primary, fontSize: 16 }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: { 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16 
  },
  modalCloseButton: { 
    alignSelf: 'center', 
    padding: 16,
    marginVertical: 8
  },
  contentContainer: { 
    padding: 16, 
    paddingBottom: 80 
  },
  label: { 
    fontSize: 16, 
    marginVertical: 8, 
    fontWeight: '500' 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16,
    marginBottom: 8
  },
  multilineInput: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  imagePickerButton: { 
    marginVertical: 12, 
    alignItems: 'center' 
  },
  eventImage: { 
    width: 200, 
    height: 200, 
    borderRadius: 8 
  },
  placeholderImage: { 
    width: 200, 
    height: 200, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 12
  },
  datetimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  createButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});

export default EventCreationScreen;