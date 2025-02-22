import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getNotifications } from '../api/api';

interface NotificationContextType {
  unreadNotifications: number;
  unreadMessages: number;
  updateUnreadCounts: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  unreadNotifications: 0,
  unreadMessages: 0,
  updateUnreadCounts: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const updateUnreadCounts = async () => {
    const notifications = await getNotifications();
    setUnreadNotifications(notifications.filter(n => !n.read).length);
    // In production, replace with actual API call for unread messages.
    setUnreadMessages(2);
  };

  useEffect(() => {
    updateUnreadCounts();
    const interval = setInterval(() => {
      updateUnreadCounts();
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadNotifications, unreadMessages, updateUnreadCounts }}>
      {children}
    </NotificationContext.Provider>
  );
};
