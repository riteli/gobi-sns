'use client';

import { createContext, useContext } from 'react';

export type TimelineContextType = {
  userId: string | null;
  likedPostIds: Set<number>;
  followingUserIds: Set<string>;
};

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineContext provider');
  }
  return context;
};
