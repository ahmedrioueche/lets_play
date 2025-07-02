import { Game } from './game';
import { Language, LocationI } from './general';

// Core user data (essential for authentication/identification)
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  age?: string | number;
  location?: LocationI;
  isVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  isOnline?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Profile information (optional details)
export interface UserProfile {
  _id: string;
  userId: string;
  favoriteSports?: string[];
  friends: string[]; // Array of user IDs
  stats: UserStats;
  social: UserSocial;
  history: UserGameHistory;
  analytics: UserAnalytics;
  achievements: UserAchievements;
  settings: Settings;
  // Core user fields that are included in the profile response
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  age?: string | number;
  location?: LocationI;
  isVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt?: string;
  updatedAt?: string;
}

// Social connections
export interface UserSocial {
  _id?: string;
  friendsCount: number;
  followersCount: number;
  followingCount: number;
  blockedUsers: string[];
  pendingInvitations: string[]; // IDs of pending friend invitations sent by this user
  receivedInvitations: string[]; // IDs of pending friend invitations received by this user
}

// Stats (game-related metrics)
export interface UserStats {
  _id: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  totalPoints: number;
  rank: string;
  level: number;
  experience: number;
  streak: number;
  favoriteSport: string;
  credibility: number;
  participation: number;
  gamesCreated: number;
}

// Game history (separate for better performance)
export interface UserGameHistory {
  _id: string;
  userId: string;
  registeredGames: string[];
  playedGames?: Game[];
  upcomingGames?: string[];
}

// Achievements
export interface UserAchievements {
  _id: string;
  userId: string;
  achievements: Achievement[];
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// Analytics/History (extendable)
export interface UserAnalytics {
  _id: string;
  userId: string;
  activityLog: UserActivity[];
  performanceMetrics?: PerformanceMetrics;
}

interface UserActivity {
  _id: string;
  date: string;
  action: 'game_played' | 'game_created' | 'friend_added' | 'achievement_unlocked';
  details: Record<string, unknown>;
}

interface PerformanceMetrics {
  _id: string;
  bySport: Record<string, SportPerformance>;
  byTimeOfDay?: TimeOfDayPerformance;
  // Add more dimensions as needed
}

interface SportPerformance {
  _id: string;
  gamesPlayed: number;
  winRate: number;
  averagePoints: number;
}

interface TimeOfDayPerformance {
  _id: string;
  morning: PerformanceStats;
  afternoon: PerformanceStats;
  evening: PerformanceStats;
  night: PerformanceStats;
}

interface PerformanceStats {
  _id: string;
  gamesPlayed: number;
  winRate: number;
}

export interface FriendInvitation {
  _id?: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  _id?: string;
  userId: string;
  type:
    | 'friend_invitation'
    | 'friend_accepted'
    | 'game_invitation'
    | 'game_reminder'
    | 'game_registration'
    | 'game_cancellation'
    | 'system';
  title: string;
  message: string;
  data?: {
    friendInvitationId?: string;
    gameId?: string;
    fromUserId?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Settings = {
  language: Language;
  theme: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  privacy: string;
  profileVisibility: string;
  maxDistanceForVisibleGames: number;
  alertWhenGameStarts: boolean;
  alertBeforeGameStarts: boolean;
  alertTimeBeforeGame: number;
  alertOnStart: boolean;
};
