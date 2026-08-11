export type DoctorStatus = 'Active' | 'On Leave' | 'Emergency Only';

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  department: string;
  specialization: string;
  experience: string;
  image: string;
  opdSchedule: string;
  fee: number;
  phone: string;
  status: DoctorStatus;
  bio: string;
  roomNo: string;
}

export type ShiftType = 'Morning' | 'Evening' | 'Night' | 'General';
export type EmployeeStatus = 'Active' | 'On Leave';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  shift: ShiftType;
  status: EmployeeStatus;
  password?: string;
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  description: string;
  headOfDepartment: string;
  bedCapacity: number;
  phoneExt: string;
  commonTreatments: string[];
  image: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: string;
  image: string;
  features: string[];
}

export type GalleryCategory = 'Facilities' | 'ICU & OT' | 'Doctors & Staff' | 'Health Camps' | 'Events' | 'Building';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  caption: string;
  date: string;
}

export type NoticePriority = 'High' | 'Normal' | 'Low';
export type NoticeCategory = 'General' | 'OPD Schedule' | 'Health Advisory' | 'Recruitment' | 'Emergency';

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string;
  content: string;
  isPinned: boolean;
  priority: NoticePriority;
  targetAudience: string;
  docUrl?: string;
}

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer: string;
  maxSeats: number;
  registeredCount: number;
  status: EventStatus;
  imageUrl: string;
}

export type FeedbackStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface FeedbackItem {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  department: string;
  rating: number;
  message: string;
  date: string;
  status: FeedbackStatus;
  adminNotes?: string;
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export interface BusinessSettings {
  hospitalName: string;
  tagline: string;
  taglineHindi?: string;
  primaryPhone: string;
  secondaryPhone: string;
  landlinePhone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  statePin: string;
  googleMapsUrl?: string;
  opdTimings: string;
  emergencyHelpline: string;
  ayushmanEnabled: boolean;
  directorName: string;
  directorDesignation: string;
  directorMessage: string;
  directorPhotoUrl?: string;
  visionText: string;
  missionPoints: string[];
}

export interface SliderSetting {
  id: string;
  tagline: string;
  title: string;
  highlightText?: string;
  hindiSlogan?: string;
  description?: string;
  bgImage: string;
  badge: string;
  leftList?: string[];
  rightList?: string[];
  serviceBox?: string[];
  accentColor: string;
  isActive: boolean;
}

export interface LogoSettings {
  headerLogoUrl: string;
  footerLogoUrl: string;
  faviconUrl: string;
  showTextNextToLogo: boolean;
  primaryBrandColor: string;
}

export interface CommunicationLog {
  id: string;
  sentByEmployeeName: string;
  sentAt: string;
  channel: 'WhatsApp' | 'SMS' | 'Call' | 'Note';
  message: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  symptoms: string;
  createdAt: string;
  communicationLogs?: CommunicationLog[];
}

export interface FlashAnnouncement {
  enabled: boolean;
  title: string;
  message: string;
  subText?: string;
  autoShowOnLoad: boolean;
  showTickerBanner: boolean;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
