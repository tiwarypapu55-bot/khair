import { 
  Doctor, Employee, Department, Facility, GalleryItem, Notice, 
  EventItem, FeedbackItem, Appointment, BusinessSettings, SliderSetting, LogoSettings, FlashAnnouncement 
} from '../types';

import bannerFacilities from '../assets/images/khair_banner_facilities_1786209223428.jpg';
import bannerEyecare from '../assets/images/khair_banner_eyecare_1786209242082.jpg';
import bannerWelcome from '../assets/images/khair_banner_welcome_1786209260002.jpg';
import bannerSurgery from '../assets/images/khair_banner_surgery_1786252089141.jpg';
import khairLogoImg from '../assets/images/khair_hospital_logo_1786262717216.jpg';

import drMushtaqImg from '../assets/images/dr_mushtaq_khan_1786250783424.jpg';
import drRashidImg from '../assets/images/dr_rashid_khan_1786250799156.jpg';
import drFarhaImg from '../assets/images/dr_farha_deeba_1786250814040.jpg';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr Mushtaq Ahmad Khan',
    qualification: 'MBBS, MS',
    department: 'General Surgery',
    specialization: 'General Surgery',
    experience: '35 years',
    image: drMushtaqImg,
    opdSchedule: 'Mon - Sat: 10:00 AM - 02:00 PM, 05:00 PM - 08:00 PM',
    fee: 500,
    phone: '9628897004',
    status: 'Active',
    bio: 'Senior General Surgeon with 35 years of clinical mastery in general surgery, abdominal procedures, trauma, and emergency surgical care.',
    roomNo: 'OPD Room 101'
  },
  {
    id: 'doc-2',
    name: 'Dr Rashid Ahmad Khan',
    qualification: 'MBBS, MS, FMAS',
    department: 'Laproscopic Surgery',
    specialization: 'General and Laproscopic Surgery',
    experience: '15 Yrs',
    image: drRashidImg,
    opdSchedule: 'Mon - Sat: 11:00 AM - 03:00 PM, 05:00 PM - 08:00 PM',
    fee: 200,
    phone: '9628897004',
    status: 'Active',
    bio: 'Expert Laparoscopic Surgeon with 15 years experience specializing in minimal access surgeries, gallbladder, appendix, and hernia repair.',
    roomNo: 'OPD Room 102'
  },
  {
    id: 'doc-3',
    name: 'Dr Farha Deeba',
    qualification: 'MBBS, DOMS',
    department: 'Ophthalmology',
    specialization: 'Ophthalmology',
    experience: '13 Yrs',
    image: drFarhaImg,
    opdSchedule: 'Mon - Sat: 09:30 AM - 02:00 PM, 04:30 PM - 07:30 PM',
    fee: 200,
    phone: '9628897004',
    status: 'Active',
    bio: 'Eye Specialist & Ophthalmologist with 13 years experience in advanced eye care, Phaco cataract surgery, cornea care, and vision restoration.',
    roomNo: 'Eye Care OPD 103'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    employeeId: 'KH-EMP-001',
    name: 'Sunil Kumar Sharma',
    designation: 'Senior Nursing Superintendent',
    department: 'Inpatient Ward & ICU',
    phone: '+91 98391 10001',
    email: 'sunil.nursing@khairhospital.in',
    joinDate: '2018-04-12',
    shift: 'General',
    status: 'Active',
    password: 'khair123'
  },
  {
    id: 'emp-102',
    employeeId: 'KH-EMP-002',
    name: 'Pooja Vishwakarma',
    designation: 'Head OT Staff Nurse',
    department: 'Operation Theatre',
    phone: '+91 98391 10002',
    email: 'pooja.ot@khairhospital.in',
    joinDate: '2019-08-01',
    shift: 'Morning',
    status: 'Active',
    password: 'khair123'
  },
  {
    id: 'emp-103',
    employeeId: 'KH-EMP-003',
    name: 'Ramesh Chandra Pandey',
    designation: 'Senior Lab Technician',
    department: 'Pathology & Blood Storage',
    phone: '+91 98391 10003',
    email: 'lab.ramesh@khairhospital.in',
    joinDate: '2020-01-15',
    shift: 'Morning',
    status: 'Active',
    password: 'khair123'
  },
  {
    id: 'emp-104',
    employeeId: 'KH-EMP-004',
    name: 'Mohd. Imran',
    designation: 'Radiology Technician',
    department: 'Radiodiagnosis & X-Ray',
    phone: '+91 98391 10004',
    email: 'imran.xray@khairhospital.in',
    joinDate: '2021-03-20',
    shift: 'Evening',
    status: 'Active',
    password: 'khair123'
  },
  {
    id: 'emp-105',
    employeeId: 'KH-EMP-005',
    name: 'Anjali Srivastava',
    designation: 'OPD Receptionist & Billing Executive',
    department: 'Front Desk Administration',
    phone: '+91 98391 10005',
    email: 'frontdesk@khairhospital.in',
    joinDate: '2022-06-10',
    shift: 'Morning',
    status: 'Active',
    password: 'khair123'
  },
  {
    id: 'emp-106',
    employeeId: 'KH-EMP-006',
    name: 'Vikram Singh',
    designation: 'Emergency Ambulance Driver & EMT',
    department: 'Emergency & Ambulance',
    phone: '+91 98391 10006',
    email: 'ambulance@khairhospital.in',
    joinDate: '2020-11-05',
    shift: 'Night',
    status: 'Active',
    password: 'khair123'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Ophthalmology',
    iconName: 'Eye',
    description: 'Providing complete vision care with advanced laser & surgical treatment facilities, Phaco cataract surgery, glaucoma care, and vision restoration.',
    headOfDepartment: 'Dr. Farha Deeba',
    bedCapacity: 15,
    phoneExt: '103',
    commonTreatments: ['Cataract (Phaco) & Refractive Surgery', 'Glaucoma Diagnosis & Treatment', 'Retina & Corneal Care', 'Pediatric Ophthalmology & Squint Correction', 'Emergency Eye Trauma Care'],
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dept-2',
    name: 'General Surgery',
    iconName: 'Stethoscope',
    description: 'Comprehensive surgical management for abdominal conditions, hernia, appendix, gallbladder, piles, fistula, fissure, thyroid, and emergency trauma care.',
    headOfDepartment: 'Dr. Mushtaq Ahmad Khan',
    bedCapacity: 35,
    phoneExt: '101',
    commonTreatments: ['Hernia, Appendix & Gallbladder Surgery', 'Piles, Fistula & Fissure Management', 'Thyroid & Breast Surgery', 'Trauma & Wound Treatment', 'Post-Operative Care & Pain Management'],
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dept-3',
    name: 'Laproscopic Surgery',
    iconName: 'Scissors',
    description: 'Keyhole and minimal access surgeries providing smaller incisions, reduced post-operative discomfort, faster healing, and early recovery.',
    headOfDepartment: 'Dr. Rashid Ahmad Khan',
    bedCapacity: 25,
    phoneExt: '102',
    commonTreatments: ['Laparoscopic Appendix Surgery', 'Laparoscopic Gallbladder Surgery', 'Laparoscopic Hernia Repair', 'Diagnostic Laparoscopy', 'Minimal Invasive Gynecological Procedures'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Modern Operation Theatres',
    category: 'Surgical & OT',
    description: 'Ultra-clean laminar airflow modular OTs equipped with high-definition laparoscopic suites, C-Arm image intensifier, and advanced anesthesia workstations.',
    availability: '24 Hours Scheduled & Emergency',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    features: ['HEPA Filter Air Filtration', 'Stryker HD Laparoscopy Tower', 'Ziehm C-Arm X-Ray Machine', 'Multipara Cardiac Monitors']
  },
  {
    id: 'fac-2',
    name: 'Wheelchair Access & Patient Support',
    category: 'Patient Support',
    description: 'Ramp entrance, elevator access, dedicated wheelchairs, stretchers, and trained attendant staff for senior citizens and mobility-assisted patients.',
    availability: '24 Hours',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    features: ['Gate Wheelchair Assistance', 'Ramp & Elevator Access', 'Attendant & Nursing Support', 'Patient Stretcher Services']
  },
  {
    id: 'fac-3',
    name: 'Ayushman Bharat Yojana',
    category: 'Government Schemes',
    description: 'PM-JAY empaneled hospital providing 100% free and cashless surgical, ophthalmic, and inpatient treatment for eligible card holders.',
    availability: '24 Hours Desk',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    features: ['100% Cashless Treatment', 'Dedicated Ayushman Desk', 'Free Pre-Op & Post-Op Care', 'Free Medicines & Diagnostics']
  },
  {
    id: 'fac-4',
    name: 'Online Appointments',
    category: 'Digital Services',
    description: 'Instant online OPD appointment booking and digital token generation for quick consultations with minimal waiting time.',
    availability: '24x7 Online Booking',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    features: ['Instant OPD Token Generation', 'SMS & WhatsApp Confirmation', 'Select Preferred Doctor & Slot', 'Minimal Reception Queue']
  },
  {
    id: 'fac-5',
    name: 'Health Check-Up Camps',
    category: 'Community Health',
    description: 'Regular free health checkup camps, eye screening outreach programs, and community wellness camps across Basti district.',
    availability: 'Scheduled Camps & Sunday Programs',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    features: ['Free Cataract & Eye Screening', 'Free Blood Pressure & Sugar Tests', 'Surgical Counseling', 'Community Outreach Desk']
  },
  {
    id: 'fac-6',
    name: 'Clean & Comfortable Waiting Zones',
    category: 'Patient Comfort',
    description: 'Spacious, hygienic, climate-controlled waiting lobbies with comfortable seating, purified drinking water, and clean restrooms.',
    availability: '08:00 AM - 08:00 PM',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    features: ['Climate-Controlled AC Lobby', 'Purified RO Water Dispenser', 'Digital Token Status Screen', 'Hygienic Restrooms']
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Khair Hospital Front Elevation',
    category: 'Building',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
    caption: 'Modern healthcare facility building situated on Basti Road.',
    date: '2026-01-10'
  },
  {
    id: 'gal-2',
    title: 'Modular Operation Theatre',
    category: 'ICU & OT',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    caption: 'Advanced laparoscopic surgery setup with HEPA air filters.',
    date: '2026-02-05'
  },
  {
    id: 'gal-3',
    title: 'Level-III Intensive Care Unit',
    category: 'ICU & OT',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    caption: 'Continuous cardiac monitoring and ventilator setup in ICU.',
    date: '2026-02-18'
  },
  {
    id: 'gal-4',
    title: 'Free Mega Health Checkup Camp',
    category: 'Health Camps',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    caption: 'Over 450 local residents received free sugar, BP, and consultations.',
    date: '2026-03-01'
  },
  {
    id: 'gal-5',
    title: 'Doctor Team Consultation',
    category: 'Doctors & Staff',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    caption: 'Senior specialists discussing complex patient case files.',
    date: '2026-03-12'
  },
  {
    id: 'gal-6',
    title: 'High-Tech Pathology Laboratory',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    caption: 'Fully automated biochemistry and hematology analyzers.',
    date: '2026-03-20'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Revised OPD Timings for Summer Season',
    category: 'OPD Schedule',
    date: '2026-04-01',
    content: 'Please note that Morning OPD will now function from 08:00 AM to 02:00 PM, and Evening OPD from 04:30 PM to 08:00 PM from Monday to Saturday. Emergency services remain open 24x7.',
    isPinned: true,
    priority: 'High',
    targetAudience: 'All Patients & Visitors'
  },
  {
    id: 'not-2',
    title: 'Announcement: Free Laparoscopic Consultation Drive',
    category: 'Health Advisory',
    date: '2026-03-25',
    content: 'Khair Hospital is conducting a special OPD week for Patients suffering from Gallbladder Stone, Hernia, and Abdominal Pain. Free consultation with Dr. M. A. Khair from April 10th to April 15th.',
    isPinned: true,
    priority: 'High',
    targetAudience: 'General Public'
  },
  {
    id: 'not-3',
    title: 'Walk-In Interview: ICU Staff Nurses & Dialysis Technicians',
    category: 'Recruitment',
    date: '2026-03-18',
    content: 'Khair Hospital invites applications from experienced GNM/B.Sc Nursing candidates for ICU and Dialysis departments. Walk-in interview every Friday between 11:00 AM and 03:00 PM.',
    isPinned: false,
    priority: 'Normal',
    targetAudience: 'Job Seekers'
  },
  {
    id: 'not-4',
    title: 'Precautionary Advisory: Seasonal Viral Fever & Dengue Prevention',
    category: 'Health Advisory',
    date: '2026-03-10',
    content: 'Keep surrounding areas clean, drink boiled water, and avoid stagnant water. In case of high fever with body ache, visit our 24x7 Casualty for immediate blood test.',
    isPinned: false,
    priority: 'Normal',
    targetAudience: 'Community'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Free Cardiology & Diabetes Health Screening Camp',
    date: '2026-04-18',
    location: 'Khair Hospital Auditorium, Basti',
    description: 'Comprehensive heart & diabetes checkup including Free ECG, Blood Sugar test, BP measurement, and expert advice by Dr. Rajesh Verma.',
    organizer: 'Department of Cardiology & Community Health Desk',
    maxSeats: 300,
    registeredCount: 184,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'evt-2',
    title: 'Mother & Child Care Awareness Workshop',
    date: '2026-04-25',
    location: 'OPD Conference Hall, 1st Floor',
    description: 'Interactive session on antenatal care, child nutrition, immunization schedule, and early detection of pediatric ailments.',
    organizer: 'Department of Obstetrics & Pediatrics',
    maxSeats: 150,
    registeredCount: 92,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'evt-3',
    title: 'Voluntary Blood Donation Drive',
    date: '2026-03-15',
    location: 'Khair Hospital Blood Storage Room',
    description: 'Annual blood donation camp organized in coordination with Indian Red Cross Society. Donors were honored with certificates.',
    organizer: 'Khair Hospital Youth Club & Rotary Basti',
    maxSeats: 200,
    registeredCount: 165,
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-1',
    patientName: 'Anil Kumar Tripathi',
    email: 'anil.tripathi@gmail.com',
    phone: '+91 94152 99887',
    department: 'General Surgery',
    rating: 5,
    message: 'My laparoscopic gallbladder surgery was performed smoothly by Dr. M. A. Khair. Staff was extremely supportive and rooms were very clean.',
    date: '2026-03-28',
    status: 'Resolved',
    adminNotes: 'Thanked the patient over phone and wished speedy recovery.'
  },
  {
    id: 'fb-2',
    patientName: 'Shabana Bano',
    email: 'shabana.b@yahoo.com',
    phone: '+91 98392 44332',
    department: 'Gynecology',
    rating: 5,
    message: 'Excellent delivery care by Dr. Farhana Parveen. The nursing staff in maternity ward provided 24-hour guidance.',
    date: '2026-03-20',
    status: 'Resolved',
    adminNotes: 'Recorded in hospital star patient register.'
  },
  {
    id: 'fb-3',
    patientName: 'Virendra Pratap Singh',
    email: 'virendra.singh@rediffmail.com',
    phone: '+91 94503 11224',
    department: 'OPD Reception',
    rating: 4,
    message: 'Medical facilities are top notch. Suggestion: Please add more waiting chairs near OPD Room 101 during peak hours.',
    date: '2026-04-02',
    status: 'In Progress',
    adminNotes: 'OPD manager instructed to place 15 extra visitor chairs in corridor.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    appointmentNumber: 'KH-20260408-01',
    patientName: 'Sanjay Kumar',
    age: 42,
    gender: 'Male',
    phone: '+91 94150 11223',
    email: 'sanjay.k@gmail.com',
    department: 'General & Laparoscopic Surgery',
    doctorId: 'doc-1',
    doctorName: 'Dr. M. A. Khair',
    date: '2026-04-09',
    timeSlot: '11:00 AM - 11:30 AM',
    status: 'Confirmed',
    symptoms: 'Abdominal pain on right side, stomach bloating',
    createdAt: '2026-04-08T09:15:00Z'
  },
  {
    id: 'app-2',
    appointmentNumber: 'KH-20260408-02',
    patientName: 'Priya Verma',
    age: 28,
    gender: 'Female',
    phone: '+91 98390 99887',
    email: 'priya.v@gmail.com',
    department: 'Obstetrics & Gynecology',
    doctorId: 'doc-2',
    doctorName: 'Dr. Farhana Parveen',
    date: '2026-04-09',
    timeSlot: '10:30 AM - 11:00 AM',
    status: 'Confirmed',
    symptoms: 'Routine 2nd trimester antenatal checkup',
    createdAt: '2026-04-08T10:20:00Z'
  }
];

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  hospitalName: 'KHAIR HOSPITAL',
  tagline: 'Excellence in Healthcare • Basti',
  taglineHindi: 'आंखों की देखभाल, आपके विश्वास का नाम - खैर हॉस्पिटल',
  primaryPhone: '+91 96288 97004',
  secondaryPhone: '+91 94151 23456',
  landlinePhone: '05542-359380',
  email: 'kmh.bst@gmail.com',
  website: 'www.khairhospitalbst.in',
  address: 'Bansi Road, Katra',
  city: 'Basti',
  statePin: 'Uttar Pradesh 272001',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Khair+Hospital+Bansi+Road+Katra+Basti+Uttar+Pradesh',
  opdTimings: 'Mon - Sat: 08:00 AM - 08:00 PM',
  emergencyHelpline: '05542-359380 / +91 96288 97004',
  ayushmanEnabled: true,
  directorName: 'Director',
  directorDesignation: 'Khair Hospital, Basti',
  directorPhotoUrl: drMushtaqImg,
  directorMessage: `At Khair Hospital, our mission is simple — to bring exelient Health Care System and light of vision to every life we touch. Since our inception, we have been dedicated to providing Advanced Multi-Speciality Treatment and Eye Care with compassion, precision, and trust.

Guided by a commitment to excellence, our skilled specialists ensure that every patient receives personalized treatment in a caring and comfortable environment.

We believe that good vision is the foundation of a better life. That is why we continuously adopt modern technologies, innovative surgical methods, and world-class diagnostic systems — all aimed at achieving the best possible outcomes.

As the Director of Khair Hospital, I take immense pride in our team’s integrity, empathy, and pursuit of perfection. We strive not only to restore sight, but also to inspire hope — making Khair Hospital a symbol of trust and quality healthcare in Basti and beyond.`,
  visionText: 'To provide affordable, accessible, and advanced healthcare services with a strong commitment to patient safety, innovation, and empathy — serving the people of Basti and neighboring districts.',
  missionPoints: [
    'To deliver high-quality medical care.',
    'To maintain ethical, transparent, and patient-centered practices.',
    'To continuously upgrade medical facilities, treatment technology, and staff expertise.',
    'To serve the community with compassion, dignity, and respect.'
  ]
};

export const INITIAL_SLIDER_SETTINGS: SliderSetting[] = [
  {
    id: 'slide-1',
    tagline: 'Multi-Specialty & Trauma Care',
    title: 'KHAIR HOSPITAL',
    highlightText: 'Facilities & Services',
    description: 'Comprehensive medical infrastructure featuring modern modular operation theatres, 24x7 casualty, and state-of-the-art diagnostic labs.',
    bgImage: bannerFacilities,
    badge: 'Facilities & Services',
    leftList: [
      'Modern Operation Theatres',
      'Air Cooled Wards',
      'Private Wards',
      'Advanced Pathology & Lab'
    ],
    rightList: [
      'Online Appointments',
      'Health Check-Up Camps',
      'Wheelchair Access & Patient Support',
      'Clean & Comfort Waiting Zones'
    ],
    accentColor: 'from-amber-500 to-amber-600',
    isActive: true,
    cardBgClass: 'bg-gradient-to-br from-[#2c1654] via-[#1b357a] to-[#00b4d8] text-white border-blue-400/30'
  },
  {
    id: 'slide-2',
    tagline: 'Super-Specialty Eye Care Center',
    title: 'KHAIR HOSPITAL',
    highlightText: 'Compassionate Eye Care',
    description: '“Providing compassionate eye care and advanced treatments for a clearer, healthier vision.”',
    bgImage: bannerEyecare,
    badge: 'Our Core Services',
    serviceBox: [
      'OPD Services',
      'IPD Services',
      'Laboratory',
      'Pharmacy'
    ],
    accentColor: 'from-emerald-600 to-teal-700',
    isActive: true,
    cardBgClass: 'bg-gradient-to-br from-[#e8acac] via-[#d89f9f] to-[#cb8e8e] text-slate-950 border-[#c48585]'
  },
  {
    id: 'slide-3',
    tagline: 'Trust & Excellence in Healthcare',
    title: 'WELCOME TO KHAIR HOSPITAL',
    highlightText: 'We Care About You',
    hindiSlogan: 'आंखों की देखभाल, आपके विश्वास का नाम - खैर हॉस्पिटल',
    description: 'Dedicated to delivering patient-centric medical treatment with expert doctor consultations and round-the-clock emergency care.',
    bgImage: bannerWelcome,
    badge: 'We Care About You',
    accentColor: 'from-blue-600 to-indigo-700',
    isActive: true,
    cardBgClass: 'bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#0f172a] text-white border-emerald-500/30'
  },
  {
    id: 'slide-4',
    tagline: 'Advanced Laparoscopic & General Surgery',
    title: 'KHAIR HOSPITAL',
    highlightText: 'Ayushman Bharat Empaneled',
    description: 'Providing advanced minimally invasive laparoscopic surgeries, trauma care, and Ayushman Bharat cash-less treatment options.',
    bgImage: bannerSurgery,
    badge: 'Surgical Excellence',
    leftList: [
      'Advanced Laparoscopic Surgery',
      'Ayushman Bharat Cash-less',
      '24x7 Emergency & Trauma',
      'Modular Sterile OT'
    ],
    rightList: [
      'Senior Consultant Surgeons',
      'Minimal Pain & Faster Recovery',
      'ICU & Post-Op Monitoring',
      'Dedicated Nursing Staff'
    ],
    accentColor: 'from-purple-600 to-indigo-800',
    isActive: true,
    cardBgClass: 'bg-gradient-to-br from-[#1e1b4b] via-[#1e3a8a] to-[#0f172a] text-white border-indigo-500/30'
  }
];

export const INITIAL_LOGO_SETTINGS: LogoSettings = {
  headerLogoUrl: khairLogoImg,
  footerLogoUrl: khairLogoImg,
  faviconUrl: khairLogoImg,
  showTextNextToLogo: true,
  primaryBrandColor: '#064e3b'
};

export const INITIAL_FLASH_ANNOUNCEMENT: FlashAnnouncement = {
  enabled: true,
  title: 'Latest Announcement',
  message: 'Every Thursday - Consultation fee - Free.',
  subText: 'Special OPD Drive: Free doctor consultation for all patients every Thursday at Khair Hospital, Basti.',
  autoShowOnLoad: true,
  showTickerBanner: true,
  updatedAt: new Date().toISOString()
};
