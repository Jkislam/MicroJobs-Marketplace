export type PageType = 
  | 'home' 
  | 'find-jobs' 
  | 'gmail-sell'
  | 'instagram-sell'
  | 'telegram-sell'
  | 'post-job' 
  | 'about' 
  | 'contact' 
  | 'login' 
  | 'register' 
  | 'profile' 
  | 'edit-profile' 
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
  avatar?: string;
  isActivated?: boolean;
  activationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  activationTrxId?: string;
  activationSenderPhone?: string;
  activationMethod?: string;
  activationSubmittedAt?: string;
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

export interface CompletedJobActivity {
  id: string;
  userName: string;
  userAvatar: string;
  jobTitle: string;
  category: string;
  earnedAmount: number;
  completedAt: string;
}

export interface GmailSubmission {
  id: string;
  gmailAddress: string;
  passwordInput: string;
  fname: string;
  lname: string;
  note?: string;
  reward: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  userEmail: string;
  userName: string;
}

export interface InstagramSubmission {
  id: string;
  instagramUsername: string;
  instagramPassword: string;
  linkedEmail: string;
  emailPassword: string;
  followersCount: number;
  postsCount: number;
  has2FA: boolean;
  backupCodesOrNote?: string;
  reward: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
}

export interface TelegramSubmission {
  id: string;
  telegramPhone: string;
  telegramUsername: string;
  twoStepPassword?: string;
  accountType: string;
  channelLink?: string;
  otpContact?: string;
  note?: string;
  reward: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
}

export interface JobSubmission {
  id: string;
  jobId: string;
  jobTitle: string;
  category: string;
  proofText: string;
  fileUploaded?: boolean;
  reward: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
}
