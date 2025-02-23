import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ArtistProfileScreen from '../screens/ArtistProfileScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import ManageEventApplicationsScreen from '../screens/ManageEventApplicationsScreen';
import LocationSelectionScreen from '../screens/LocationSelectionScreen';
import ApplyForEventScreen from '../screens/ApplyForEventScreen';
import BookingInstructionsScreen from '../screens/BookingInstructionsScreen';
import ManageCategoriesScreen from '../screens/ManageCategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';
import EventCreationScreen from '../screens/EventCreationScreen';
import EventMediaManagerScreen from '../screens/EventMediaManagerScreen';
import InviteArtistScreen from '../screens/InviteArtistScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ArtistsScreen from '../screens/ArtistsScreen';
import EventsScreen from '../screens/EventsScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Artists: undefined;
  Events: undefined;
  ArtistProfile: { artistId: number };
  EventDetails: { eventId: number };
  ChatConversation: { chatId: number; userName: string, profile_picture: string };
  MyEvents: undefined;
  MyBookings: undefined;
  Notifications: undefined;
  Reviews: { artistId: number };
  ManageEventApplications: { eventId: number };
  LocationSelection: undefined;
  ApplyForEvent: { eventId: number };
  BookingInstructions: undefined;
  ManageCategories: undefined;
  Settings: undefined;
  SearchScreen: undefined;
  EventCreation: undefined;
  EventMediaManager: { eventId: number };
  InviteArtist: { artistId: number };
  ProfileEdit: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 1000);
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Artists" component={ArtistsScreen} />
          <Stack.Screen name="Events" component={EventsScreen} />
          <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
          <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
          <Stack.Screen name="MyEvents" component={MyEventsScreen} />
          <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
          <Stack.Screen name="ManageEventApplications" component={ManageEventApplicationsScreen} />
          <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
          <Stack.Screen name="ApplyForEvent" component={ApplyForEventScreen} />
          <Stack.Screen name="BookingInstructions" component={BookingInstructionsScreen} />
          <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="EventCreation" component={EventCreationScreen} />
          <Stack.Screen name="EventMediaManager" component={EventMediaManagerScreen} />
          <Stack.Screen name="InviteArtist" component={InviteArtistScreen} />
          <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
