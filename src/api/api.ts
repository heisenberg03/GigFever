import * as Location from 'expo-location';
import { FiltersType } from '../components/FilterModal';

// Dummy data for artists
const dummyArtists = [
  { id: 1, name: "Alice dravid munitr kadkam", averageRating: 4.5, primary_category: "Singer, cancer", budget: 100, profile_picture: "https://via.placeholder.com/150" },
  { id: 2, name: "Bob", averageRating: 4.2, primary_category: "Dancer", budget: 120, profile_picture: "https://via.placeholder.com/150" },
  { id: 3, name: "Charlie", averageRating: 4.8, primary_category: "Guitarist", budget: 150, profile_picture: "https://via.placeholder.com/150" },
  { id: 4, name: "Diana", averageRating: 4.6, primary_category: "Pianist", budget: 130, profile_picture: "https://via.placeholder.com/150" },
  { id: 5, name: "Evan", averageRating: 4.1, primary_category: "Drummer", budget: 110, profile_picture: "https://via.placeholder.com/150" },
  { id: 6, name: "Fiona", averageRating: 4.9, primary_category: "Violinist", budget: 140, profile_picture: "https://via.placeholder.com/150" },
  { id: 7, name: "Alice dravid munitr kadkam", averageRating: 4.5, primary_category: "Singer, cancer", budget: 100, profile_picture: "https://via.placeholder.com/150" },
  { id: 8, name: "Bob", averageRating: 4.2, primary_category: "Dancer", budget: 120, profile_picture: "https://via.placeholder.com/150" },
  { id: 9, name: "Charlie", averageRating: 4.8, primary_category: "Guitarist", budget: 150, profile_picture: "https://via.placeholder.com/150" },
  { id: 10, name: "Diana", averageRating: 4.6, primary_category: "Pianist", budget: 130, profile_picture: "https://via.placeholder.com/150" },
  { id: 11, name: "Evan", averageRating: 4.1, primary_category: "Drummer", budget: 110, profile_picture: "https://via.placeholder.com/150" },
  { id: 12, name: "Fiona", averageRating: 4.9, primary_category: "Violinist", budget: 140, profile_picture: "https://via.placeholder.com/150" },
  // ... add more dummy artists if needed
];

// Dummy data for events
// /api/api.ts

// Dummy events data for simulation
const dummyEvents = [
  { id: 1, title: 'Concert A', category: 'Concert', date: 1640995200, popularity: 80, budget: 500 },
  { id: 2, title: 'Workshop B', category: 'Workshop', date: 1641081600, popularity: 60, budget: 300 },
  { id: 3, title: 'Conference C', category: 'Conference', date: 1641168000, popularity: 90, budget: 700 },
  { id: 4, title: 'Exhibition D', category: 'Exhibition', date: 1641254400, popularity: 50, budget: 200 },
  // ...more dummy events
];


interface GetAllEventsParams {
  filters?: FiltersType;
  page: number;
}
// dummyApi.ts

export const fetchProfile = async () => {
  // Simulated API delay
  await new Promise(res => setTimeout(res, 500));
  return {
    name: 'John Doe',
    bio: 'Artist, Musician & Performer. I create unique visual and audio experiences.',
    profilePicture: 'https://via.placeholder.com/150',
    averageRating: 4.5,
    categories: ['Music', 'Dance'],
    socialAccounts: {
      instagram: { linked: true, url: 'https://instagram.com/johndoe' },
      facebook: { linked: false, url: '' },
      youtube: { linked: true, url: 'https://youtube.com/channel/XYZ' },
      twitter: { linked: false, url: '' },
    },
    // Correct dummy data example for portfolio items:
    portfolio: [
      {
        id: 'p1',
        platform: 'youtube',
        thumbnail: 'https://via.placeholder.com/150/0000FF',
        media_type: 'video',
        title: 'YouTube Video 1',
        url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      },
      {
        id: 'p2',
        platform: 'instagram',
        thumbnail: 'https://via.placeholder.com/150/FF00FF',
        media_type: 'image',
        title: 'Instagram Post 1',
        url: 'https://instagram.com/p/ABC',
      },
      {
        id: 'p3',
        platform: 'facebook',
        media_type: 'image',
        thumbnail: 'https://via.placeholder.com/150/00FF00',
        title: 'Facebook Photo 1',
        url: 'https://facebook.com/photo/123',
      },
    ]

  };
};

export const updateProfile = async (updatedProfile: any) => {
  // Simulate saving profile data
  await new Promise(res => setTimeout(res, 500));
  console.log('Profile updated:', updatedProfile);
  return true;
};

export const fetchPortfolio = async () => {
  // Return portfolio data; here we assume it's part of profile
  const profile = await fetchProfile();
  return profile.portfolio;
};

export const updatePortfolio = async (portfolio: any[]) => {
  // Simulate saving portfolio order
  await new Promise(res => setTimeout(res, 500));
  console.log('Portfolio updated:', portfolio);
  return true;
};

export const fetchSocialMediaPosts = async (platform: 'instagram' | 'facebook' | 'youtube' | 'twitter') => {
  // Return dummy posts for each platform
  const dummyPosts = {
    instagram: [
      { id: 'ig1', platform: 'instagram', thumbnail: 'https://via.placeholder.com/150/FF00FF', title: 'Insta Reel 1', url: 'https://instagram.com/p/IG1' },
      { id: 'ig2', platform: 'instagram', thumbnail: 'https://via.placeholder.com/150/FF00FF', title: 'Insta Reel 2', url: 'https://instagram.com/p/IG2' },
      { id: 'ig3', platform: 'instagram', thumbnail: 'https://via.placeholder.com/150/FF00FF', title: 'Insta Reel 3', url: 'https://instagram.com/p/IG3' },
      { id: 'ig4', platform: 'instagram', thumbnail: 'https://via.placeholder.com/150/FF00FF', title: 'Insta Reel 4', url: 'https://instagram.com/p/IG4' },
    ],
    facebook: [
      { id: 'fb1', platform: 'facebook', thumbnail: 'https://via.placeholder.com/150/00FF00', title: 'FB Post 1', url: 'https://facebook.com/post/FB1' },
    ],
    youtube: [
      { id: 'yt1', platform: 'youtube', thumbnail: 'https://via.placeholder.com/150/0000FF', title: 'YouTube Video 1', url: 'https://youtube.com/embed/YT1' },
      { id: 'yt2', platform: 'youtube', thumbnail: 'https://via.placeholder.com/150/0000FF', title: 'YouTube Video 2', url: 'https://youtube.com/embed/YT2' },
    ],
    twitter: [
      { id: 'tw1', platform: 'twitter', thumbnail: 'https://via.placeholder.com/150/FF9900', title: 'Tweet 1', url: 'https://twitter.com/status/TW1' },
    ],
  };
  await new Promise(res => setTimeout(res, 500));
  return dummyPosts[platform] || [];
};


export const getAllEvents = async (params: { filters?: FiltersType; page?: number } = {}): Promise<any[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const { filters, page = 1 } = params;
  let events = dummyEvents;

  // Apply category filters if provided
  if (filters && filters.category) {
    if (Array.isArray(filters.category)) {
      events = events.filter(event => filters.category?.includes(event.category));
    } else {
      events = events.filter(event => event.category === filters.category);
    }
  }

  // Implement simple pagination (page size = 10)
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return events.slice(start, end);
};


const PAGE_SIZE = 6;

// Artists APIs
export const getAllArtists = async (params: { filters?: FiltersType; page?: number } = {}): Promise<any[]> => {
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

export const getTrendingEvents = async (params: { category?: string; page?: number } = {}): Promise<any[]> => {
  return getAllEvents(params);
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

export type EventStatus = 'open' | 'confirmed' | 'cancelled';

export type Event = {
  id: string;
  title: string;
  dateTime: string;   // scheduled event time (ISO string)
  createdAt: string;  // event creation time (ISO string)
  status: EventStatus;
  location: string;   // new field for location
};

export const fetchUserEvents = async (): Promise<Event[]> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 500));
  
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Summer Concert',
      dateTime: new Date(now.getTime() + 3600000).toISOString(),  // +1 hour
      createdAt: new Date(now.getTime() - 86400000).toISOString(), // -1 day
      status: 'confirmed',
      location: 'Central Park, NY',
    },
    {
      id: '2',
      title: 'Art Expo',
      dateTime: new Date(now.getTime() + 7200000).toISOString(),  // +2 hours
      createdAt: new Date(now.getTime() - 43200000).toISOString(), // -12 hours
      status: 'open',
      location: 'Gallery 42, LA',
    },
    {
      id: '3',
      title: 'Past Festival',
      dateTime: new Date(now.getTime() - 3600000).toISOString(),  // -1 hour
      createdAt: new Date(now.getTime() - 172800000).toISOString(), // -2 days
      status: 'confirmed',
      location: 'Old Town Square, Prague',
    },
    {
      id: '4',
      title: 'Cancelled Show',
      dateTime: new Date(now.getTime() + 10800000).toISOString(),  // +3 hours
      createdAt: new Date(now.getTime() - 21600000).toISOString(), // -6 hours
      status: 'cancelled',
      location: 'City Theater, Berlin',
    },
  ];
};

export const updateUserEvents = async (events: Event[]): Promise<boolean> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 500));
  console.log('Events updated:', events);
  return true;
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
