export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  joinedAt: string;
  reportsCount: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: ReportStatus;
  priority: ReportPriority;
  location: {
    address: string;
    lat: number;
    lng: number;
    landmark?: string;
  };
  images: string[];
  aiAnalysis?: {
    category: string;
    confidence: number;
    severity: string;
    bengaliSummary?: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  comments: Comment[];
  upvotes: number;
  isUpvoted: boolean;
}

export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'under_review';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  isOfficial: boolean;
}

export interface ActivityEvent {
  id: string;
  type: 'report_created' | 'status_changed' | 'comment_added' | 'report_resolved' | 'report_upvoted' | 'assigned';
  title: string;
  description: string;
  reportId?: string;
  reportTitle?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  icon: string;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
  avgResponseTime: string;
  resolutionRate: number;
  weeklyChange: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

// Mock user data
export const mockUser: User = {
  id: 'usr_001',
  name: 'Rahul Ahmed',
  email: 'rahul.ahmed@example.com',
  role: 'citizen',
  avatar: undefined,
  joinedAt: '2024-01-15T10:30:00Z',
  reportsCount: 12,
};

// Mock reports data
export const mockReports: Report[] = [
  {
    id: 'RPT-2024-0142',
    title: 'Large pothole on Highway 101',
    description: 'Deep pothole causing vehicle damage near mile marker 45. Multiple cars have damaged tires.',
    category: 'Road Damage',
    subcategory: 'Pothole',
    status: 'in_progress',
    priority: 'high',
    location: {
      address: 'Highway 101, Mile 45',
      lat: 23.8103,
      lng: 90.4125,
      landmark: 'Near City Mall',
    },
    images: ['/images/pothole-1.jpg', '/images/pothole-2.jpg'],
    aiAnalysis: {
      category: 'Road Damage',
      confidence: 0.98,
      severity: 'High',
      bengaliSummary: 'হাইওয়ে ১০১-এ বড় গর্ত যা গাড়ির タイয়ার ক্ষতিগ্রস্ত করছে',
    },
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
    assignedTo: 'Road Maintenance Team A',
    comments: [
      {
        id: 'cmt_001',
        userId: 'admin_001',
        userName: 'Sarah Johnson',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Team dispatched for inspection. Expected repair within 48 hours.',
        createdAt: '2024-01-21T09:15:00Z',
        isOfficial: true,
      },
    ],
    upvotes: 12,
    isUpvoted: false,
  },
  {
    id: 'RPT-2024-0138',
    title: 'Multiple streetlight outages in Downtown',
    description: 'Five consecutive streetlights not working on Main Street between 5th and 10th Ave. Safety concern at night.',
    category: 'Infrastructure',
    subcategory: 'Street Lighting',
    status: 'pending',
    priority: 'medium',
    location: {
      address: 'Main St, Downtown District',
      lat: 23.7289,
      lng: 90.3942,
      landmark: 'Between 5th & 10th Ave',
    },
    images: ['/images/streetlight-1.jpg'],
    aiAnalysis: {
      category: 'Infrastructure',
      confidence: 0.95,
      severity: 'Medium',
      bengaliSummary: 'মেইন স্ট্রিটের ৫টি স্ট্রিটলাইট বন্ধ, রাতে নিরাপত্তা সমস্যা',
    },
    createdAt: '2024-01-19T20:45:00Z',
    updatedAt: '2024-01-19T20:45:00Z',
    comments: [],
    upvotes: 8,
    isUpvoted: true,
  },
  {
    id: 'RPT-2024-0125',
    title: 'Illegal dumping near Central Park',
    description: 'Construction debris and household waste dumped illegally behind Central Park. Environmental hazard.',
    category: 'Environmental',
    subcategory: 'Illegal Dumping',
    status: 'resolved',
    priority: 'high',
    location: {
      address: 'Central Park, Rear Entrance',
      lat: 23.7456,
      lng: 90.3876,
      landmark: 'Behind playground area',
    },
    images: ['/images/dumping-1.jpg', '/images/dumping-2.jpg', '/images/dumping-3.jpg'],
    aiAnalysis: {
      category: 'Environmental',
      confidence: 0.97,
      severity: 'High',
      bengaliSummary: 'সেন্ট্রাল পার্কের পেছনে অবৈধ কচরা ফেলা, পরিবেশের জন্য হানিকারক',
    },
    createdAt: '2024-01-15T11:20:00Z',
    updatedAt: '2024-01-18T16:30:00Z',
    resolvedAt: '2024-01-18T16:30:00Z',
    assignedTo: 'Environmental Protection Unit',
    comments: [
      {
        id: 'cmt_002',
        userId: 'admin_002',
        userName: 'Michael Chen',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Cleanup crew scheduled for tomorrow morning.',
        createdAt: '2024-01-16T10:00:00Z',
        isOfficial: true,
      },
      {
        id: 'cmt_003',
        userId: 'admin_002',
        userName: 'Michael Chen',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Area cleaned and warning signs installed. Case closed.',
        createdAt: '2024-01-18T16:30:00Z',
        isOfficial: true,
      },
    ],
    upvotes: 24,
    isUpvoted: false,
  },
  {
    id: 'RPT-2024-0110',
    title: 'Water main break on Elm Street',
    description: 'Major water leak causing flooding and low pressure in surrounding blocks. Emergency repair needed.',
    category: 'Utilities',
    subcategory: 'Water Leak',
    status: 'in_progress',
    priority: 'critical',
    location: {
      address: 'Elm Street & Broadway',
      lat: 23.7890,
      lng: 90.4012,
      landmark: 'Near Metro Station',
    },
    images: ['/images/water-leak-1.jpg'],
    aiAnalysis: {
      category: 'Utilities',
      confidence: 0.99,
      severity: 'Critical',
      bengaliSummary: 'এলম স্ট্রিটে বড় পানি লিক, আশেপাশের এলাকায় জলাভাব',
    },
    createdAt: '2024-01-18T06:30:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    assignedTo: 'Water Utility Emergency Team',
    comments: [
      {
        id: 'cmt_004',
        userId: 'admin_003',
        userName: 'David Park',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Emergency crew on site. Water supply to affected blocks temporarily shut off.',
        createdAt: '2024-01-18T07:00:00Z',
        isOfficial: true,
      },
      {
        id: 'cmt_005',
        userId: 'admin_003',
        userName: 'David Park',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Pipe replacement in progress. Estimated restoration by 6 PM today.',
        createdAt: '2024-01-19T14:20:00Z',
        isOfficial: true,
      },
    ],
    upvotes: 18,
    isUpvoted: true,
  },
  {
    id: 'RPT-2024-0098',
    title: 'Broken sidewalk on Oak Avenue',
    description: 'Cracked and uneven sidewalk creating tripping hazard for pedestrians, especially elderly.',
    category: 'Road Damage',
    subcategory: 'Sidewalk',
    status: 'pending',
    priority: 'low',
    location: {
      address: 'Oak Avenue, Block 3',
      lat: 23.7567,
      lng: 90.3891,
      landmark: 'Near Community Center',
    },
    images: ['/images/sidewalk-1.jpg'],
    aiAnalysis: {
      category: 'Road Damage',
      confidence: 0.92,
      severity: 'Low',
      bengaliSummary: 'ওক এভিনিউতে ভাঙা সাইডওয়াক, পাদচারীদের জন্য খুঁটিনাটি',
    },
    createdAt: '2024-01-12T15:10:00Z',
    updatedAt: '2024-01-12T15:10:00Z',
    comments: [],
    upvotes: 5,
    isUpvoted: false,
  },
  {
    id: 'RPT-2024-0087',
    title: 'Overflowing garbage bins at Market Square',
    description: 'Public garbage bins not collected for 3 days. Attracting pests and creating odor.',
    category: 'Sanitation',
    subcategory: 'Garbage Collection',
    status: 'resolved',
    priority: 'medium',
    location: {
      address: 'Market Square',
      lat: 23.7345,
      lng: 90.3987,
      landmark: 'Central market area',
    },
    images: ['/images/garbage-1.jpg'],
    aiAnalysis: {
      category: 'Sanitation',
      confidence: 0.94,
      severity: 'Medium',
      bengaliSummary: 'মার্কেট স্কোয়ারে ৩ দিন ধরে কচরা সংগ্রহ না হওয়া',
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
    resolvedAt: '2024-01-11T11:30:00Z',
    assignedTo: 'Waste Management Team',
    comments: [
      {
        id: 'cmt_006',
        userId: 'admin_004',
        userName: 'Lisa Wong',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Extra collection scheduled. Bins emptied and area sanitized.',
        createdAt: '2024-01-11T11:30:00Z',
        isOfficial: true,
      },
    ],
    upvotes: 11,
    isUpvoted: false,
  },
  {
    id: 'RPT-2024-0076',
    title: 'Damaged traffic signal at intersection',
    description: 'Traffic light showing red in all directions causing confusion and near-miss accidents.',
    category: 'Infrastructure',
    subcategory: 'Traffic Signals',
    status: 'under_review',
    priority: 'high',
    location: {
      address: '5th Ave & Main St Intersection',
      lat: 23.7298,
      lng: 90.3951,
      landmark: 'Busy downtown intersection',
    },
    images: ['/images/traffic-signal-1.jpg'],
    aiAnalysis: {
      category: 'Infrastructure',
      confidence: 0.96,
      severity: 'High',
      bengaliSummary: '৫তম অ্যাভিনিউ ও মেইন স্ট্রিট চौरাহায় ট্রাফিক সিগন্যাল خرাব',
    },
    createdAt: '2024-01-08T18:20:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
    assignedTo: 'Traffic Engineering Dept',
    comments: [
      {
        id: 'cmt_007',
        userId: 'admin_005',
        userName: 'Robert Kim',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Technical team investigating. Temporary traffic officers deployed.',
        createdAt: '2024-01-09T10:00:00Z',
        isOfficial: true,
      },
    ],
    upvotes: 15,
    isUpvoted: true,
  },
  {
    id: 'RPT-2024-0065',
    title: 'Graffiti on public library wall',
    description: 'Offensive graffiti sprayed on the north wall of the public library building.',
    category: 'Vandalism',
    subcategory: 'Graffiti',
    status: 'rejected',
    priority: 'low',
    location: {
      address: 'Public Library, North Wall',
      lat: 23.7678,
      lng: 90.3912,
      landmark: 'Downtown library branch',
    },
    images: ['/images/graffiti-1.jpg'],
    aiAnalysis: {
      category: 'Vandalism',
      confidence: 0.91,
      severity: 'Low',
      bengaliSummary: 'পাবলিক লাইব্রেরির উত্তর দেয়ালে অশ্লীল গ্রাফিটি',
    },
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-06T14:30:00Z',
    comments: [
      {
        id: 'cmt_008',
        userId: 'admin_006',
        userName: 'Amanda Foster',
        userRole: 'moderator',
        userAvatar: undefined,
        content: 'Report rejected - falls under private property maintenance. Library management notified separately.',
        createdAt: '2024-01-06T14:30:00Z',
        isOfficial: true,
      },
    ],
    upvotes: 3,
    isUpvoted: false,
  },
];

// Mock activity timeline
export const mockActivityTimeline: ActivityEvent[] = [
  {
    id: 'act_001',
    type: 'report_created',
    title: 'New report submitted',
    description: 'You reported "Large pothole on Highway 101"',
    reportId: 'RPT-2024-0142',
    reportTitle: 'Large pothole on Highway 101',
    createdAt: '2024-01-20T14:30:00Z',
    icon: 'FileText',
    color: 'text-primary',
  },
  {
    id: 'act_002',
    type: 'status_changed',
    title: 'Status updated to In Progress',
    description: 'Your report "Large pothole on Highway 101" is now being processed',
    reportId: 'RPT-2024-0142',
    reportTitle: 'Large pothole on Highway 101',
    metadata: { previousStatus: 'pending', newStatus: 'in_progress' },
    createdAt: '2024-01-21T09:15:00Z',
    icon: 'AlertCircle',
    color: 'text-warning',
  },
  {
    id: 'act_003',
    type: 'comment_added',
    title: 'Official update added',
    description: 'Road Maintenance Team A commented on "Large pothole on Highway 101"',
    reportId: 'RPT-2024-0142',
    reportTitle: 'Large pothole on Highway 101',
    createdAt: '2024-01-21T09:15:00Z',
    icon: 'MessageCircle',
    color: 'text-primary',
  },
  {
    id: 'act_004',
    type: 'report_created',
    title: 'New report submitted',
    description: 'You reported "Multiple streetlight outages in Downtown"',
    reportId: 'RPT-2024-0138',
    reportTitle: 'Multiple streetlight outages in Downtown',
    createdAt: '2024-01-19T20:45:00Z',
    icon: 'FileText',
    color: 'text-primary',
  },
  {
    id: 'act_005',
    type: 'report_resolved',
    title: 'Report resolved',
    description: 'Your report "Illegal dumping near Central Park" has been resolved',
    reportId: 'RPT-2024-0125',
    reportTitle: 'Illegal dumping near Central Park',
    createdAt: '2024-01-18T16:30:00Z',
    icon: 'CheckCircle',
    color: 'text-success',
  },
  {
    id: 'act_006',
    type: 'comment_added',
    title: 'Official update added',
    description: 'Environmental Protection Unit commented on "Illegal dumping near Central Park"',
    reportId: 'RPT-2024-0125',
    reportTitle: 'Illegal dumping near Central Park',
    createdAt: '2024-01-18T16:30:00Z',
    icon: 'MessageCircle',
    color: 'text-primary',
  },
  {
    id: 'act_007',
    type: 'report_created',
    title: 'New report submitted',
    description: 'You reported "Water main break on Elm Street"',
    reportId: 'RPT-2024-0110',
    reportTitle: 'Water main break on Elm Street',
    createdAt: '2024-01-18T06:30:00Z',
    icon: 'FileText',
    color: 'text-primary',
  },
  {
    id: 'act_008',
    type: 'status_changed',
    title: 'Status updated to In Progress',
    description: 'Your report "Water main break on Elm Street" is now being processed',
    reportId: 'RPT-2024-0110',
    reportTitle: 'Water main break on Elm Street',
    metadata: { previousStatus: 'pending', newStatus: 'in_progress' },
    createdAt: '2024-01-18T07:00:00Z',
    icon: 'AlertCircle',
    color: 'text-warning',
  },
  {
    id: 'act_009',
    type: 'report_upvoted',
    title: 'Report upvoted',
    description: 'You upvoted "Water main break on Elm Street"',
    reportId: 'RPT-2024-0110',
    reportTitle: 'Water main break on Elm Street',
    createdAt: '2024-01-18T08:00:00Z',
    icon: 'ThumbsUp',
    color: 'text-success',
  },
  {
    id: 'act_010',
    type: 'report_created',
    title: 'New report submitted',
    description: 'You reported "Broken sidewalk on Oak Avenue"',
    reportId: 'RPT-2024-0098',
    reportTitle: 'Broken sidewalk on Oak Avenue',
    createdAt: '2024-01-12T15:10:00Z',
    icon: 'FileText',
    color: 'text-primary',
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'success',
    title: 'Report Resolved',
    message: 'Your report "Illegal dumping near Central Park" has been resolved.',
    read: false,
    actionUrl: '/reports/RPT-2024-0125',
    actionLabel: 'View Details',
    createdAt: '2024-01-18T16:30:00Z',
    icon: 'CheckCircle',
  },
  {
    id: 'notif_002',
    type: 'info',
    title: 'Status Update',
    message: 'Your report "Large pothole on Highway 101" is now In Progress.',
    read: false,
    actionUrl: '/reports/RPT-2024-0142',
    actionLabel: 'View Details',
    createdAt: '2024-01-21T09:15:00Z',
    icon: 'AlertCircle',
  },
  {
    id: 'notif_003',
    type: 'info',
    title: 'New Comment',
    message: 'Road Maintenance Team A commented on your report.',
    read: true,
    actionUrl: '/reports/RPT-2024-0142',
    actionLabel: 'Read Comment',
    createdAt: '2024-01-21T09:15:00Z',
    icon: 'MessageCircle',
  },
  {
    id: 'notif_004',
    type: 'warning',
    title: 'High Priority Alert',
    message: 'Water main break reported near your area. Water supply may be affected.',
    read: false,
    actionUrl: '/reports/RPT-2024-0110',
    actionLabel: 'View Report',
    createdAt: '2024-01-18T06:45:00Z',
    icon: 'AlertTriangle',
  },
  {
    id: 'notif_005',
    type: 'success',
    title: 'Report Resolved',
    message: 'Your report "Overflowing garbage bins at Market Square" has been resolved.',
    read: true,
    actionUrl: '/reports/RPT-2024-0087',
    actionLabel: 'View Details',
    createdAt: '2024-01-11T11:30:00Z',
    icon: 'CheckCircle',
  },
  {
    id: 'notif_006',
    type: 'danger',
    title: 'Report Rejected',
    message: 'Your report "Graffiti on public library wall" was rejected - private property.',
    read: true,
    actionUrl: '/reports/RPT-2024-0065',
    actionLabel: 'View Details',
    createdAt: '2024-01-06T14:30:00Z',
    icon: 'XCircle',
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalReports: 12,
  pendingReports: 3,
  inProgressReports: 2,
  resolvedReports: 6,
  rejectedReports: 1,
  avgResponseTime: '4.2h',
  resolutionRate: 85.7,
  weeklyChange: {
    total: 2,
    pending: 1,
    inProgress: 0,
    resolved: 1,
  },
};

export const statusColors: Record<ReportStatus, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  resolved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-danger/10 text-danger border-danger/20',
  under_review: 'bg-info/10 text-info border-info/20',
};

export const statusLabels: Record<ReportStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
  under_review: 'Under Review',
};

export const priorityColors: Record<ReportPriority, string> = {
  low: 'bg-muted/10 text-muted border-muted/20',
  medium: 'bg-primary/10 text-primary border-primary/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-danger/10 text-danger border-danger/20',
};

export const priorityLabels: Record<ReportPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const categoryIcons: Record<string, string> = {
  'Road Damage': 'MapPin',
  'Infrastructure': 'Building',
  'Environmental': 'Leaf',
  'Utilities': 'Droplet',
  'Sanitation': 'Trash2',
  'Vandalism': 'SprayCan',
};