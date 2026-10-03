import { Job, CategoryItem, WithdrawalRequest, UserProfileData } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'JB-4910',
    title: 'Create Gmail Account',
    category: 'Email',
    reward: 0.50,
    availableSlots: 100,
    totalSlots: 150,
    description: 'Create a new Gmail account with complete profile setup.',
    instructions: [
      'Go to gmail.com and register a fresh account',
      'Set profile picture and recovery details as requested',
      'Submit the email address and temporary password'
    ],
    requirements: ['Mobile or PC', 'Internet Connection'],
    daysLeft: 3,
    client: {
      name: 'Raju Ahmed',
      username: '@raju_client',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.8,
      reviewsCount: 320,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '10m ago'
  },
  {
    id: 'JB-4905',
    title: 'Follow Instagram Page',
    category: 'Social Media',
    reward: 0.30,
    availableSlots: 200,
    totalSlots: 250,
    description: 'Follow a given Instagram page and provide screenshot.',
    instructions: [
      'Search for the designated Instagram handle',
      'Click Follow on the official profile',
      'Take a clear screenshot showing your "Following" status'
    ],
    requirements: ['Active Instagram Account'],
    daysLeft: 4,
    client: {
      name: 'Nila Akter',
      username: '@nila_social',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.7,
      reviewsCount: 185,
      badgeText: 'Top Employer'
    },
    status: 'active',
    createdAt: '30m ago'
  },
  {
    id: 'JB-4899',
    title: 'Join Telegram Channel',
    category: 'Telegram',
    reward: 0.25,
    availableSlots: 150,
    totalSlots: 200,
    description: 'Join the channel and submit confirmation.',
    instructions: [
      'Click the provided Telegram channel invite link',
      'Join the channel and stay active',
      'Submit your Telegram username and proof screenshot'
    ],
    requirements: ['Telegram App'],
    daysLeft: 2,
    client: {
      name: 'Shakib Hasan',
      username: '@shakib_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.9,
      reviewsCount: 420,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '1h ago'
  },
  {
    id: 'JB-4892',
    title: 'Watch YouTube Video',
    category: 'YouTube',
    reward: 0.40,
    availableSlots: 300,
    totalSlots: 400,
    description: 'Watch the video and like the content.',
    instructions: [
      'Open the YouTube video link',
      'Watch for at least 3 minutes and hit Like',
      'Submit screenshot showing your watch time and liked status'
    ],
    requirements: ['YouTube App/Browser'],
    daysLeft: 5,
    client: {
      name: 'Raihan Islam',
      username: '@raihan_creator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.6,
      reviewsCount: 260,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '2h ago'
  },
  {
    id: 'JB-4885',
    title: 'Like Facebook Page',
    category: 'Social Media',
    reward: 0.35,
    availableSlots: 180,
    totalSlots: 250,
    description: 'Like the page and share the post.',
    instructions: [
      'Visit the official Facebook page link',
      'Click Like & Follow button on the page',
      'Share the latest post to your profile and submit link'
    ],
    requirements: ['Active Facebook Account'],
    daysLeft: 3,
    client: {
      name: 'Tanzim Ahmed',
      username: '@tanzim_web',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.7,
      reviewsCount: 210,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '3h ago'
  },
  {
    id: 'JB-4880',
    title: 'Visit Website',
    category: 'Website',
    reward: 0.20,
    availableSlots: 250,
    totalSlots: 300,
    description: 'Visit the website for 2 minutes and submit proof.',
    instructions: [
      'Open website link in your web browser',
      'Stay active on page and visit 2 subpages',
      'Submit screenshot of the final page visited'
    ],
    requirements: ['Web Browser'],
    daysLeft: 2,
    client: {
      name: 'Jannat Ara',
      username: '@jannat_design',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.5,
      reviewsCount: 150,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '4h ago'
  },
  {
    id: 'JB-4875',
    title: 'Data Entry Task',
    category: 'Data Entry',
    reward: 0.60,
    availableSlots: 90,
    totalSlots: 120,
    description: 'Fill up the given form with accurate information.',
    instructions: [
      'Open the online form link provided',
      'Fill in 10 fields accurately as directed',
      'Submit form and copy your submission ID'
    ],
    requirements: ['Attention to Detail'],
    daysLeft: 4,
    client: {
      name: 'Hasan Mahmud',
      username: '@hasan_growth',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.8,
      reviewsCount: 320,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '5h ago'
  },
  {
    id: 'JB-4870',
    title: 'Simple Image Editing',
    category: 'Design',
    reward: 0.75,
    availableSlots: 120,
    totalSlots: 150,
    description: 'Remove background from the image.',
    instructions: [
      'Download sample product image',
      'Remove background using free tool or Photoshop',
      'Export as transparent PNG and submit link'
    ],
    requirements: ['Image Editing Tool'],
    daysLeft: 5,
    client: {
      name: 'Tania Sultana',
      username: '@tania_apps',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.6,
      reviewsCount: 190,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '6h ago'
  },
  {
    id: 'JB-4885',
    title: 'Install Utility Calculator App & Leave Feedback',
    category: 'App Testing',
    reward: 1.20,
    availableSlots: 14,
    totalSlots: 60,
    description: 'Download our utility calculator app from Google Play, test currency converter calculation, and submit short feedback with device model.',
    instructions: [
      'Open Google Play Store and search for "Quick Calc Pro"',
      'Install the free application',
      'Open currency converter tab and test 2 conversion pairs',
      'Take a screenshot inside the app and share 1 sentence feedback on speed'
    ],
    daysLeft: 1,
    client: {
      name: 'Tania Sultana',
      username: '@tania_apps',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      reviewsCount: 88,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '4h ago'
  },
  {
    id: 'JB-4880',
    title: 'Image Background Removal & Crop (5 Shoes)',
    category: 'Design',
    reward: 0.45,
    availableSlots: 97,
    totalSlots: 150,
    description: 'Use transparent background tools to isolate 5 product shoe photos and export as 1000x1000 PNG files according to guidelines.',
    instructions: [
      'Download sample raw shoe image zip',
      'Remove background using remove.bg or Photoshop',
      'Crop cleanly to 1000x1000px square with centered padding',
      'Submit zip or drive link containing PNG results'
    ],
    daysLeft: 3,
    client: {
      name: 'Jannat Ara',
      username: '@jannat_design',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.8,
      reviewsCount: 310,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '5h ago'
  },
  {
    id: 'JB-4875',
    title: 'Newsletter Sign-Up & Email Confirmation',
    category: 'Digital Marketing',
    reward: 0.40,
    availableSlots: 142,
    totalSlots: 180,
    description: 'Subscribe to our tech news digest, click the confirmation email link, and provide the confirmation email address.',
    instructions: [
      'Visit https://technews.example/subscribe',
      'Enter your active email address',
      'Check your inbox and click the verification button',
      'Provide email address and screenshot of confirmation message'
    ],
    daysLeft: 2,
    client: {
      name: 'Hasan Mahmud',
      username: '@hasan_growth',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.9,
      reviewsCount: 520,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '6h ago'
  },
  {
    id: 'JB-4870',
    title: 'Grammar Review & Spelling Check (200 words)',
    category: 'Writing & Proofreading',
    reward: 0.95,
    availableSlots: 18,
    totalSlots: 40,
    description: 'Review a brief product description paragraph for clarity, tone, and typos. Provide corrected text and note 2 suggested tweaks.',
    instructions: [
      'Read short 200-word draft provided in job attachment',
      'Identify grammatical errors, punctuation, and awkward phrasing',
      'Provide corrected version in text response box with 2 clarity recommendations'
    ],
    daysLeft: 5,
    client: {
      name: 'Farhan Tariq',
      username: '@farhan_editor',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.9,
      reviewsCount: 144,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '7h ago'
  },
  {
    id: 'JB-4865',
    title: 'Visit Blog & Check Mobile Navigation Speed',
    category: 'Website Testing',
    reward: 0.35,
    availableSlots: 165,
    totalSlots: 220,
    description: 'Open blog on your smartphone, test the hamburger menu open/close speed, and confirm sticky footer button visibility.',
    instructions: [
      'Open smartphone browser and navigate to blog URL',
      'Tap mobile menu icon 3 times to test response',
      'Scroll to bottom and verify sticky CTA remains visible',
      'Submit device model and short confirmation screenshot'
    ],
    daysLeft: 2,
    client: {
      name: 'Tanzim Ahmed',
      username: '@tanzim_web',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.7,
      reviewsCount: 210,
      badgeText: 'Verified Buyer'
    },
    status: 'active',
    createdAt: '8h ago'
  }
];

export const CATEGORIES_LIST: CategoryItem[] = [
  {
    id: 'cat-gmail',
    name: 'Gmail Sell',
    iconName: 'mail',
    jobsCount: '120+ Jobs',
    rewardRange: '$0.40 - $1.50',
    description: 'Create verified accounts with complete profile setup.',
    activeJobsNumber: 120
  },
  {
    id: 'cat-instagram',
    name: 'Instagram Sell',
    iconName: 'photo_camera',
    jobsCount: '95+ Jobs',
    rewardRange: '$0.25 - $2.00',
    description: 'Follow profiles, like carousels, and engage with posts.',
    activeJobsNumber: 95
  },
  {
    id: 'cat-telegram',
    name: 'Telegram Sell',
    iconName: 'send',
    jobsCount: '80+ Jobs',
    rewardRange: '$0.20 - $1.00',
    description: 'Join verified crypto & community channels.',
    activeJobsNumber: 80
  },
  {
    id: 'cat-youtube',
    name: 'YouTube Services',
    iconName: 'play_circle',
    jobsCount: '60+ Jobs',
    rewardRange: '$0.35 - $3.00',
    description: 'Watch video content, subscribe, and post genuine reviews.',
    activeJobsNumber: 60
  },
  {
    id: 'cat-social',
    name: 'Social Media',
    iconName: 'share',
    jobsCount: '140+ Jobs',
    rewardRange: '$0.10 - $1.50',
    description: 'Facebook page likes, shares, retweets, and comments.',
    activeJobsNumber: 140
  },
  {
    id: 'cat-website',
    name: 'Website & Others',
    iconName: 'language',
    jobsCount: '70+ Jobs',
    rewardRange: '$0.30 - $4.50',
    description: 'UI/UX testing, blog reviews, and survey tasks.',
    activeJobsNumber: 70
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'W-8891',
    freelancerName: 'Sabbir Hossain',
    username: '@sabbir_pro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tier: 'Tier 3',
    tasksDone: 142,
    amount: 45.00,
    method: 'bKash Personal',
    accountDetails: '+880 1712-•••456',
    requestedAgo: '10m ago',
    status: 'pending'
  },
  {
    id: 'W-8889',
    freelancerName: 'Amina Bello',
    username: '@aminab',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    tier: 'Tier 2',
    tasksDone: 320,
    amount: 120.00,
    method: 'Bank Asia Wire',
    accountDetails: '•••• •••• 4021',
    requestedAgo: '45m ago',
    status: 'processing'
  },
  {
    id: 'W-8885',
    freelancerName: 'Tanvir Khan',
    username: '@tkhan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tier: 'Tier 1',
    tasksDone: 48,
    amount: 15.50,
    method: 'Nagad Direct',
    accountDetails: '+880 1823-•••890',
    requestedAgo: '2h ago',
    status: 'pending'
  },
  {
    id: 'W-8880',
    freelancerName: 'Carlos Ruiz',
    username: '@carlos_micro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'Tier 3',
    tasksDone: 410,
    amount: 84.20,
    method: 'PayPal Express',
    accountDetails: 'carlos••••@gmail.com',
    requestedAgo: '3h ago',
    status: 'disbursed'
  }
];

export const MOCK_USER: UserProfileData = {
  fullName: 'Sabbir Islam',
  username: '@sabbir',
  email: 'sabbir.islam@example.com',
  phone: '+880 1712-345678',
  country: 'Bangladesh',
  bio: 'Experienced micro-task specialist focusing on website testing, data tagging, and digital media verification. Punctual, detailed, and quality-driven.',
  role: 'worker',
  memberSince: '2026',
  kycLevel: 'KYC Level 2',
  completedTasks: 148,
  totalEarnings: 482.50,
  jobsPosted: 6,
  overallRating: 4.9,
  reviewsCount: 96,
  payoutAccounts: [
    {
      id: 'p-1',
      method: 'bKash Personal',
      details: '•••••••• 892',
      isDefault: true,
      type: 'Instant'
    },
    {
      id: 'p-2',
      method: 'Bank Asia Ltd',
      details: 'Checking •••• 4021',
      isDefault: false,
      type: '1-2 Days'
    }
  ]
};
