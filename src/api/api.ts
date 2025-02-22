import * as Location from 'expo-location';
import { FiltersType } from '../components/FilterModal';

// Dummy data for artists
const dummyArtists = [
  { id: 1, name: "Alice dravid munitr kadkam", averageRating: 4.5, primary_category: "Singer, cancer", min_budget: 100, profile_picture: "https://via.placeholder.com/150" },
  { id: 2, name: "Bob", averageRating: 4.2, primary_category: "Dancer", min_budget: 120, profile_picture: "https://via.placeholder.com/150" },
  { id: 3, name: "Charlie", averageRating: 4.8, primary_category: "Guitarist", min_budget: 150, profile_picture: "https://via.placeholder.com/150" },
  { id: 4, name: "Diana", averageRating: 4.6, primary_category: "Pianist", min_budget: 130, profile_picture: "https://via.placeholder.com/150" },
  { id: 5, name: "Evan", averageRating: 4.1, primary_category: "Drummer", min_budget: 110, profile_picture: "https://via.placeholder.com/150" },
  { id: 6, name: "Fiona", averageRating: 4.9, primary_category: "Violinist", min_budget: 140, profile_picture: "https://via.placeholder.com/150" },
  { id: 7, name: "Alice dravid munitr kadkam", averageRating: 4.5, primary_category: "Singer, cancer", min_budget: 100, profile_picture: "https://via.placeholder.com/150" },
  { id: 8, name: "Bob", averageRating: 4.2, primary_category: "Dancer", min_budget: 120, profile_picture: "https://via.placeholder.com/150" },
  { id: 9, name: "Charlie", averageRating: 4.8, primary_category: "Guitarist", min_budget: 150, profile_picture: "https://via.placeholder.com/150" },
  { id: 10, name: "Diana", averageRating: 4.6, primary_category: "Pianist", min_budget: 130, profile_picture: "https://via.placeholder.com/150" },
  { id: 11, name: "Evan", averageRating: 4.1, primary_category: "Drummer", min_budget: 110, profile_picture: "https://via.placeholder.com/150" },
  { id: 12, name: "Fiona", averageRating: 4.9, primary_category: "Violinist", min_budget: 140, profile_picture: "https://via.placeholder.com/150" },
  // ... add more dummy artists if needed
];

// Dummy data for events
const dummyEvents = [
  { 
    id: 1, 
    title: "Jazz Night Enjoy an evening of smooth jazz", 
    description: "Enjoy an evening of smooth jazz.", 
    category: "Music", 
    budget: 500, 
    location: "Downtown Enjoy an evening of smooth jazz Enjoy an evening of smooth jazz", 
    image: "https://via.placeholder.com/300", 
    date: "2023-12-01", 
    time: "19:00", 
    host: { id: 1, name: "Host1", averageRating: 4.0, profile_picture: "https://via.placeholder.com/150" },
    media: ["https://via.placeholder.com/300/1", "https://via.placeholder.com/300/2"]
  },
  { 
    id: 2, 
    title: "Art Expo", 
    description: "Explore modern art.", 
    category: "Exhibition", 
    budget: 300, 
    location: "City Hall", 
    image: "https://via.placeholder.com/300", 
    date: "2023-12-05", 
    time: "20:00", 
    host: { id: 2, name: "Host2", averageRating: 4.3, profile_picture: "https://via.placeholder.com/150" },
    media: ["https://via.placeholder.com/300/3"]
  },
  { 
    id: 3, 
    title: "Rock Concert", 
    description: "Rock out with the best bands.", 
    category: "Music", 
    budget: 600, 
    location: "Arena", 
    image: "https://via.placeholder.com/300", 
    date: "2023-12-10", 
    time: "21:00", 
    host: { id: 1, name: "Host1", averageRating: 4.0, profile_picture: "https://via.placeholder.com/150" },
    media: ["https://via.placeholder.com/300/4", "https://via.placeholder.com/300/5"]
  },
  // ... add more dummy events if needed
];

const PAGE_SIZE = 6;

// Artists APIs
export const getAllArtists = async (params: { filters?:FiltersType ; page?: number } = {}): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let artists = dummyArtists;
      if (params.filters?.category) {
        artists = artists.filter(artist =>
          (params.filters?.category?.includes(artist.primary_category.toLowerCase()) || '')
        );
      }
      const page = params.page || 1;
      const startIndex = (page - 1) * PAGE_SIZE;
      const paginatedArtists = artists.slice(startIndex, startIndex + PAGE_SIZE);
      resolve(paginatedArtists);
    }, 500);
  });
};
export const getUserLocation = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return "Permission Denied";
    }
    const location = await Location.getCurrentPositionAsync({});
    return `Lat: ${location.coords.latitude.toFixed(2)}, Lon: ${location.coords.longitude.toFixed(2)}`;
  } catch (error) {
    return "Unknown Location";
  }
};

export const updateUserLocation = async (newLocation: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newLocation);
    }, 500);
  });
};

export const getTrendingArtists = async (params: { category?: string; page?: number } = {}): Promise<any[]> => {
  return getAllArtists(params);
};

// Events APIs
export const getAllEvents = async (page: number = 1, params: { category?: string; location?: string; minBudget?: number; maxBudget?: number } = {}): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let events = dummyEvents;
      if (params.category) {
        events = events.filter(event =>
          event.category.toLowerCase().includes(params.category?.toLowerCase() || '')
        );
      }
      if (params.location) {
        events = events.filter(event =>
          event.location.toLowerCase().includes(params.location?.toLowerCase() || '')
        );
      }
      if (params.minBudget !== undefined) {
        events = events.filter(event => event.budget >= (params.minBudget as number));
      }
      if (params.maxBudget !== undefined) {
        events = events.filter(event => event.budget <= (params.maxBudget as number));
      }
      const startIndex = (page - 1) * PAGE_SIZE;
      const paginatedEvents = events.slice(startIndex, startIndex + PAGE_SIZE);
      resolve(paginatedEvents);
    }, 500);
  });
};

export const getTrendingEvents = async (params: { category?: string; page?: number } = {}): Promise<any[]> => {
  return getAllEvents(params.page || 1, params);
};

// Search API: returns artists, events, and categories
export const searchItems = async (query: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = query.toLowerCase();
      const results: any[] = [];
      // Search in artists
      dummyArtists.forEach(artist => {
        if (artist.name.toLowerCase().includes(lower) || artist.primary_category.toLowerCase().includes(lower)) {
          results.push({ ...artist, type: 'artist' });
        }
      });
      // Search in events
      dummyEvents.forEach(event => {
        if (event.title.toLowerCase().includes(lower) || event.category.toLowerCase().includes(lower)) {
          results.push({ ...event, type: 'event' });
        }
      });
      // Search in categories (simulate)
      const categories = ["Singer", "Dancer", "Guitarist", "Pianist", "Drummer", "Violinist"];
      categories.forEach(cat => {
        if (cat.toLowerCase().includes(lower)) {
          results.push({ id: cat, name: cat, type: 'category' });
        }
      });
      resolve(results);
    }, 500);
  });
};

// User Profile APIs
export const getUserProfile = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "John Doe",
        bio: "An enthusiastic artist and event host.",
        profile_picture: "https://via.placeholder.com/150",
        categories: ["Singer", "Dancer"]
      });
    }, 500);
  });
};

export const updateUserProfile = async (updatedProfile: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, ...updatedProfile });
    }, 500);
  });
};

// Artist Profile API
export const getArtistProfile = async (artistId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: artistId,
        name: artistId === 1 ? "Alice" : `Artist ${artistId}`,
        bio: "A talented performer with years of experience.",
        averageRating: 4.5,
        profile_picture: "https://via.placeholder.com/150",
        portfolio: [
          { id: 1, media_url: "https://via.placeholder.com/100", media_type: "image" },
          { id: 2, media_url: "https://via.placeholder.com/100", media_type: "video" },
        ],
        categories: ["Singer", "Live"],
      });
    }, 500);
  });
};

// Event Details API
export const getEventDetails = async (eventId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: eventId,
        title: "Jazz Night",
        description: "Enjoy an evening of smooth jazz.",
        category: "Music",
        budget: 500,
        location: "Downtown",
        image: "https://via.placeholder.com/300",
        date: "2023-12-01",
        time: "19:00",
        host: { id: 1, name: "Host1", averageRating: 4.0, profile_picture: "https://via.placeholder.com/150" },
        media: ["https://via.placeholder.com/300/1", "https://via.placeholder.com/300/2"]
      });
    }, 500);
  });
};

// Event Applications API
export const getEventApplications = async (eventId: number): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, artistId: 1, artistName: "Alice", artistProfilePic: "https://via.placeholder.com/100", status: "pending" },
        { id: 2, artistId: 2, artistName: "Bob", artistProfilePic: "https://via.placeholder.com/100", status: "pending" },
      ]);
    }, 500);
  });
};

export const sendInvitation = async (eventId: number, artistId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ eventId, artistId, status: "invited" });
    }, 500);
  });
};

export const confirmBooking = async (eventId: number, artistId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ eventId, artistId, status: "confirmed" });
    }, 500);
  });
};

export const submitApplication = async (eventId: number, coverLetter: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ applicationId: Math.floor(Math.random() * 1000), eventId, coverLetter, status: "submitted" });
    }, 500);
  });
};

// My Events API
export const getMyEvents = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, title: "Host Event 1", status: "confirmed", date: "2023-12-01", time: "19:00", location: "Downtown" },
        { id: 102, title: "Host Event 2", status: "pending", date: "2023-12-05", time: "20:00", location: "Uptown" },
      ]);
    }, 500);
  });
};

// My Bookings API
export const getMyBookings = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 201, title: "Booked Event 1", status: "confirmed", date: "2023-12-01", time: "19:00", location: "Downtown" },
        { id: 202, title: "Booked Event 2", status: "pending", date: "2023-12-05", time: "20:00", location: "Uptown" },
      ]);
    }, 500);
  });
};


// Reviews API
export const getReviews = async (artistId: number): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, rating: 4.5, review: "Amazing performance!" },
        { id: 2, rating: 4.0, review: "Great artist, loved it." },
        { id: 3, rating: 5.0, review: "Outstanding!" },
      ]);
    }, 500);
  });
};



// /api/api.ts - Chat and Notification APIs

// Notification APIs
export const getNotifications = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          message: "You have a new message from Alice.",
          target: "Chat",
          params: { chatId: 1, userName: "Alice", profile_picture: "https://via.placeholder.com/150" },
          read: false,
          type: 'message',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          message: "Your event booking is confirmed.",
          target: "EventDetails",
          params: { eventId: 1 },
          read: false,
          type: 'event',
          timestamp: new Date().toISOString()
        },
        {
          id: 3,
          message: "Bob commented on your portfolio.",
          target: "ArtistProfile",
          params: { artistId: 1 },
          read: true,
          type: 'comment',
          timestamp: new Date().toISOString()
        },
      ]);
    }, 500);
  });
};

export const markNotificationAsRead = async (notificationId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real API, this would update the notification's read status.
      resolve({ success: true, notificationId });
    }, 200);
  });
};

// Chat APIs
export const getChatList = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice", lastMessage: "Hey, are you available?", unread: 3, profile_picture: "https://via.placeholder.com/150" },
        { id: 2, name: "Bob", lastMessage: "Looking forward to the gig!", unread: 0, profile_picture: "https://via.placeholder.com/150" },
        { id: 3, name: "Charlie", lastMessage: "Let's schedule a call.", unread: 1, profile_picture: "https://via.placeholder.com/150" },
      ]);
    }, 500);
  });
};

export const getChatMessages = async (chatId: number): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For simulation, return different messages based on chatId
      if (chatId === 1) {
        resolve([
          { id: 1, content: "Hello!", isSent: false, timestamp: new Date().toISOString() },
          { id: 2, content: "Hi, how can I help?", isSent: true, timestamp: new Date().toISOString() },
        ]);
      } else if (chatId === 2) {
        resolve([
          { id: 3, content: "Are you available for a meeting?", isSent: false, timestamp: new Date().toISOString() },
          { id: 4, content: "Yes, let's schedule one.", isSent: true, timestamp: new Date().toISOString() },
        ]);
      } else {
        resolve([]);
      }
    }, 500);
  });
};

export const sendMessage = async (chatId: number, message: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate sending message by returning new message object with a random id
      resolve({
        id: Math.floor(Math.random() * 1000),
        content: message,
        isSent: true,
        timestamp: new Date().toISOString()
      });
    }, 500);
  });
};

export const markChatMessagesAsRead = async (chatId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, this would mark all messages in the chat as read
      resolve({ success: true, chatId });
    }, 200);
  });
};
