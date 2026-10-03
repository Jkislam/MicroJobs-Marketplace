export type PageType = 
  | 'home' 
  | 'find-jobs' 
  | 'post-job' 
  | 'about' 
  | 'contact' 
  | 'login' 
  | 'register' 
  | 'profile' 
  | 'admin';

export type UserRole = 'worker' | 'client' | 'admin';

export interface Job {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  reward: number;
  availableSlots: number;
  totalSlots: number;
  description: string;
  instructions: string[];
  requirements?: string[];
  daysLeft: number;
  client: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    rating: number;
    reviewsCount: number;
    badgeText?: string;
  };
  status: 'active' | 'pending' | 'completed' | 'suspended';
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  jobsCount: string;
  rewardRange: string;
  description: string;
  activeJobsNumber: number;
}

export interface WithdrawalRequest {
  id: string;
  freelancerName: string;
  username: string;
  avatar: string;
  tier: string;
  tasksDone: number;
  amount: number;
  method: string;
  accountDetails: string;
  requestedAgo: string;
  status: 'pending' | 'disbursed' | 'processing' | 'rejected';
}

export interface UserProfileData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  role: 'worker' | 'client';
  memberSince: string;
  kycLevel: string;
  completedTasks: number;
  totalEarnings: number;
  jobsPosted: number;
  overallRating: number;
  reviewsCount: number;
  payoutAccounts: {
    id: string;
    method: string;
    details: string;
    isDefault: boolean;
    type: string;
  }[];
}

export interface FilterState {
  search: string;
  categories: string[];
  minReward: number;
  maxReward: number;
  jobStatus: 'all' | 'available' | 'new' | 'urgent';
  sortBy: 'newest' | 'reward-high' | 'slots-most' | 'rating';
}
