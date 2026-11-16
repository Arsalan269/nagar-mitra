export const CATEGORIES = [
  {
    id: 'water',
    name: 'Water Problems',
    icon: 'Droplets',
    color: '#0EA5E9',
    description: 'Problems related to water supply and water infrastructure',
    issueTypes: ['Water leakage', 'Water supply interruption', 'Low water pressure', 'Overflowing water tanks', 'Broken water pipelines', 'Water wastage', 'Other water-related issues']
  },
  {
    id: 'waste',
    name: 'Waste Management',
    icon: 'Trash2',
    color: '#22C55E',
    description: 'Problems related to waste collection and cleanliness',
    issueTypes: ['Garbage accumulation', 'Overflowing garbage bins', 'Uncollected household waste', 'Public area cleanliness', 'Illegal waste dumping', 'Construction waste', 'Other waste-related issues']
  },
  {
    id: 'road',
    name: 'Road Problems',
    icon: 'Construction',
    color: '#F97316',
    description: 'Problems related to roads, pathways and public transportation infrastructure',
    issueTypes: ['Potholes', 'Damaged roads', 'Broken footpaths', 'Road surface damage', 'Blocked pathways', 'Damaged road signs', 'Other road-related issues']
  },
  {
    id: 'electricity',
    name: 'Electricity Problems',
    icon: 'Zap',
    color: '#EAB308',
    description: 'Problems related to public electricity infrastructure',
    issueTypes: ['Streetlights not working', 'Damaged streetlight infrastructure', 'Public-area power supply issues', 'Exposed electrical infrastructure', 'Other electricity-related civic issues']
  },
  {
    id: 'drainage',
    name: 'Gutter & Drainage Problems',
    icon: 'Waves',
    color: '#6366F1',
    description: 'Problems related to gutters, sewage drainage and stormwater systems',
    issueTypes: ['Blocked gutters', 'Overflowing drainage', 'Drainage water accumulation', 'Damaged drainage covers', 'Waterlogging', 'Unclean public drains', 'Other drainage-related issues']
  }
];

export const SEVERITIES = [
  { id: 'normal', label: 'Normal', color: '#3B82F6' },
  { id: 'high', label: 'High', color: '#F59E0B' },
  { id: 'urgent', label: 'Urgent', color: '#EF4444' }
];

export const STATUSES = [
  { id: 'submitted', label: 'Submitted', color: '#3B82F6' },
  { id: 'under_review', label: 'Under Review', color: '#F59E0B' },
  { id: 'in_progress', label: 'In Progress', color: '#8B5CF6' },
  { id: 'resolved', label: 'Resolved', color: '#10B981' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' }
];

export const KALYAN_CENTER = { lat: 19.2437, lng: 73.1355 };
export const DEFAULT_ZOOM = 13;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const APP_NAME = 'Nagar Mitra';
export const APP_TAGLINE = 'Your City. Your Voice. A Better Tomorrow.';
