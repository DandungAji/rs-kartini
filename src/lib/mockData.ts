
import { Doctor, Department, Schedule, Service, Post, PostCategory } from "./types";

// Mock Departments
export const departments: Department[] = [
  { id: "1", name: "Cardiology", description: "Treating heart and cardiovascular conditions" },
  { id: "2", name: "Neurology", description: "Treatment of disorders affecting the nervous system" },
  { id: "3", name: "Orthopedics", description: "Care for bones, joints, ligaments, tendons, and muscles" },
  { id: "4", name: "Pediatrics", description: "Medical care for infants, children, and adolescents" },
  { id: "5", name: "Dermatology", description: "Specializing in skin, hair, and nail conditions" },
  { id: "6", name: "Oncology", description: "Treatment of cancer and related conditions" },
];

// Mock Doctors
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Dr. Johnson has over 15 years of experience in treating cardiovascular conditions.",
    email: "sarah.johnson@medhub.com",
    phone: "555-123-4567"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Specialist in neurological disorders with a focus on stroke prevention.",
    email: "michael.chen@medhub.com",
    phone: "555-234-5678"
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrics",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Dedicated to providing compassionate care for children of all ages.",
    email: "emily.rodriguez@medhub.com",
    phone: "555-345-6789"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Specialist in sports injuries and joint replacement surgeries.",
    email: "james.wilson@medhub.com",
    phone: "555-456-7890"
  },
  {
    id: "5",
    name: "Dr. Lisa Patel",
    specialization: "Dermatology",
    imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Expert in diagnosing and treating various skin conditions and cosmetic procedures.",
    email: "lisa.patel@medhub.com",
    phone: "555-567-8901"
  },
  {
    id: "6",
    name: "Dr. Robert Thompson",
    specialization: "Oncology",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Dedicated to cancer research and providing cutting-edge treatments.",
    email: "robert.thompson@medhub.com",
    phone: "555-678-9012"
  },
];

// Mock Schedules
export const schedules: Schedule[] = [
  { id: "1", doctorId: "1", day: "Monday", startTime: "09:00", endTime: "15:00", location: "Main Building, Floor 2" },
  { id: "2", doctorId: "1", day: "Wednesday", startTime: "09:00", endTime: "15:00", location: "Main Building, Floor 2" },
  { id: "3", doctorId: "1", day: "Friday", startTime: "13:00", endTime: "18:00", location: "Main Building, Floor 2" },
  { id: "4", doctorId: "2", day: "Tuesday", startTime: "08:00", endTime: "16:00", location: "West Wing, Floor 3" },
  { id: "5", doctorId: "2", day: "Thursday", startTime: "08:00", endTime: "16:00", location: "West Wing, Floor 3" },
  { id: "6", doctorId: "3", day: "Monday", startTime: "10:00", endTime: "17:00", location: "Pediatric Center" },
  { id: "7", doctorId: "3", day: "Tuesday", startTime: "10:00", endTime: "17:00", location: "Pediatric Center" },
  { id: "8", doctorId: "3", day: "Friday", startTime: "10:00", endTime: "17:00", location: "Pediatric Center" },
  { id: "9", doctorId: "4", day: "Wednesday", startTime: "08:00", endTime: "14:00", location: "Sports Medicine Wing" },
  { id: "10", doctorId: "4", day: "Thursday", startTime: "13:00", endTime: "19:00", location: "Sports Medicine Wing" },
  { id: "11", doctorId: "5", day: "Tuesday", startTime: "09:00", endTime: "15:00", location: "Main Building, Floor 1" },
  { id: "12", doctorId: "5", day: "Thursday", startTime: "09:00", endTime: "15:00", location: "Main Building, Floor 1" },
  { id: "13", doctorId: "6", day: "Monday", startTime: "08:00", endTime: "16:00", location: "Oncology Department" },
  { id: "14", doctorId: "6", day: "Wednesday", startTime: "11:00", endTime: "19:00", location: "Oncology Department" },
  { id: "15", doctorId: "6", day: "Friday", startTime: "08:00", endTime: "13:00", location: "Oncology Department" },
];

// Mock Services
export const services: Service[] = [
  {
    id: "1",
    name: "Emergency Care",
    description: "24/7 emergency services for critical medical situations requiring immediate attention.",
    icon: "ambulance",
    category: "Urgent Care"
  },
  {
    id: "2",
    name: "Cardiology",
    description: "Comprehensive heart care including diagnostic tests, treatments, and cardiac rehabilitation.",
    icon: "stethoscope",
    category: "Specialized Care"
  },
  {
    id: "3",
    name: "Pediatrics",
    description: "Specialized healthcare for infants, children, and adolescents up to age 18.",
    icon: "user",
    category: "Primary Care"
  },
  {
    id: "4",
    name: "Neurology",
    description: "Diagnosis and treatment of disorders affecting the nervous system, brain, and spine.",
    icon: "hospital",
    category: "Specialized Care"
  },
  {
    id: "5",
    name: "Orthopedics",
    description: "Treatment for conditions affecting bones, joints, ligaments, tendons, and muscles.",
    icon: "file",
    category: "Specialized Care"
  },
  {
    id: "6",
    name: "Dermatology",
    description: "Care for conditions affecting the skin, hair, and nails, including medical and cosmetic treatments.",
    icon: "hospital",
    category: "Specialized Care"
  },
  {
    id: "7",
    name: "Laboratory Services",
    description: "Comprehensive diagnostic testing, including blood work, cultures, and specialized screenings.",
    icon: "file-text",
    category: "Diagnostics"
  },
  {
    id: "8",
    name: "Radiology",
    description: "Advanced imaging services including X-rays, CT scans, MRIs, and ultrasounds.",
    icon: "file-text",
    category: "Diagnostics"
  },
  {
    id: "9",
    name: "Physical Therapy",
    description: "Rehabilitation services to help patients recover from injuries and manage chronic conditions.",
    icon: "calendar",
    category: "Rehabilitation"
  },
  {
    id: "10",
    name: "Mental Health",
    description: "Counseling, therapy, and psychiatric services for mental and emotional well-being.",
    icon: "user",
    category: "Primary Care"
  },
  {
    id: "11",
    name: "Vaccination",
    description: "Preventive immunizations for children and adults to protect against infectious diseases.",
    icon: "calendar-clock",
    category: "Preventive Care"
  },
  {
    id: "12",
    name: "Women's Health",
    description: "Specialized care addressing women's health concerns, including OB/GYN services.",
    icon: "user",
    category: "Primary Care"
  }
];

// Mock Post Categories
export const postCategories: PostCategory[] = [
  { id: "1", name: "Health Tips", slug: "health-tips" },
  { id: "2", name: "Medical News", slug: "medical-news" },
  { id: "3", name: "Hospital Events", slug: "hospital-events" },
  { id: "4", name: "Patient Stories", slug: "patient-stories" },
  { id: "5", name: "Research Updates", slug: "research-updates" }
];

// Mock Posts
export const posts: Post[] = [
  {
    id: "1",
    title: "Understanding Heart Health: 5 Tips for a Healthy Heart",
    content: "Your heart is one of the most vital organs in your body, pumping blood and providing oxygen to every cell. Taking care of your heart is essential for overall health and longevity. Here are five evidence-based tips for maintaining a healthy heart: 1. Exercise regularly - Aim for at least 150 minutes of moderate-intensity exercise per week. 2. Eat a heart-healthy diet - Focus on fruits, vegetables, whole grains, lean proteins, and healthy fats. 3. Maintain a healthy weight - Excess weight puts strain on your heart. 4. Avoid tobacco and limit alcohol - Both can damage your heart over time. 5. Manage stress effectively - Chronic stress contributes to heart disease risk.",
    category: "Health Tips",
    author: "Dr. Sarah Johnson",
    publishDate: "2024-04-15",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    summary: "Essential tips for maintaining cardiovascular health and preventing heart disease."
  },
  {
    id: "2",
    title: "MedHub Introduces New Advanced MRI Machine",
    content: "We are pleased to announce that MedHub Hospital has acquired the latest state-of-the-art MRI technology, enhancing our diagnostic capabilities and patient experience. The new Siemens MAGNETOM Terra 7T MRI scanner offers unprecedented image quality and faster scan times, allowing our radiologists to detect subtle abnormalities with greater precision. This technology will be particularly beneficial for neurological, musculoskeletal, and cardiovascular imaging. The new machine is equipped with features that reduce noise levels and help alleviate claustrophobia, making the experience more comfortable for patients. This acquisition represents our ongoing commitment to investing in advanced medical technology to provide the highest standard of care for our community.",
    category: "Medical News",
    author: "Hospital Administration",
    publishDate: "2024-04-10",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    summary: "MedHub Hospital upgrades diagnostic capabilities with cutting-edge MRI technology."
  },
  {
    id: "3",
    title: "Annual Health Fair: Free Screenings and Family Activities",
    content: "Join us for MedHub Hospital's Annual Health Fair on Saturday, May 15th, from 10 AM to 4 PM on the hospital grounds. This community event offers free health screenings, including blood pressure, cholesterol, blood sugar, and BMI measurements. Medical professionals will be available to answer questions and provide health guidance. The event will feature interactive educational booths on nutrition, exercise, and preventive care. For families, we've planned activities including a kids' fitness zone, healthy cooking demonstrations, and a teddy bear clinic where children can bring their favorite stuffed animals for checkups. Local health-focused vendors will also participate, showcasing their products and services. Refreshments will be provided. Don't miss this opportunity to prioritize your family's health while enjoying a day of fun and learning!",
    category: "Hospital Events",
    author: "Community Outreach Team",
    publishDate: "2024-04-05",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    summary: "Join our community health event featuring free screenings and family-friendly activities."
  },
  {
    id: "4",
    title: "My Recovery Journey: A Patient's Perspective",
    content: "After experiencing a severe stroke last year, I found myself at MedHub Hospital's Rehabilitation Center, facing what seemed like an insurmountable challenge. The stroke had affected the right side of my body, impairing my mobility and speech. The uncertainty of whether I would ever return to my normal life was overwhelming. However, the exceptional care provided by the rehabilitation team guided me through each step of recovery. My physical therapist, Lisa, personalized exercises to gradually rebuild my strength and coordination. Speech therapy sessions with Mark helped me regain communication skills through patient practice and innovative techniques. What truly made a difference was the supportive environment—healthcare professionals who celebrated every small victory with me. Today, while still working on some aspects of recovery, I've regained independence and returned to most of my daily activities. My experience has taught me the importance of persistence, a positive mindset, and having healthcare providers who believe in your potential to heal. I'm sharing my story to offer hope to others facing similar challenges—recovery is possible with dedication and the right support.",
    category: "Patient Stories",
    author: "Robert Hensley",
    publishDate: "2024-03-28",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    summary: "A stroke patient shares their inspiring rehabilitation journey at MedHub Hospital."
  },
  {
    id: "5",
    title: "Breakthrough in Alzheimer's Research: MedHub Participates in Clinical Trial",
    content: "MedHub Hospital is proud to announce our participation in a groundbreaking clinical trial investigating a novel treatment approach for Alzheimer's disease. This international multi-center study focuses on targeting the protein aggregates associated with cognitive decline using an innovative immunotherapy approach. The research builds on promising preliminary studies suggesting potential to slow disease progression in early-stage Alzheimer's patients. Our Neurology Department, led by Dr. Michael Chen, will be recruiting eligible patients over the next six months. This collaboration with leading research institutions worldwide represents our commitment to advancing medical knowledge and bringing cutting-edge treatments to our community. Participants will receive comprehensive cognitive assessments, advanced brain imaging, and close monitoring throughout the trial. While research outcomes remain to be seen, this initiative offers hope in an area where effective treatments have been elusive. Patients or families interested in learning more about eligibility criteria can contact our Clinical Research Department.",
    category: "Research Updates",
    author: "Dr. Michael Chen",
    publishDate: "2024-03-15",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1564732005956-20420ebdab60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    summary: "MedHub joins international clinical trial testing promising new Alzheimer's treatment approach."
  },
  {
    id: "6",
    title: "Seasonal Allergies: Management and Prevention Strategies",
    content: "As spring approaches, many individuals will begin experiencing the uncomfortable symptoms of seasonal allergies, including sneezing, runny nose, itchy eyes, and congestion. These reactions occur when your immune system overreacts to environmental allergens like pollen, grass, or mold. To better manage seasonal allergies, consider these effective strategies: 1. Monitor pollen counts and limit outdoor activities when levels are high, particularly in the morning when pollen is usually released. 2. Keep windows closed during peak pollen seasons and use air conditioning with high-efficiency filters. 3. Shower and change clothes after spending time outdoors to remove allergens. 4. Try over-the-counter antihistamines, nasal corticosteroids, or decongestants as appropriate (consult your healthcare provider first). 5. Consider starting allergy medications before symptoms begin, as this can provide better symptom control. 6. Keep indoor air clean with HEPA filters in your home. For those with severe or persistent allergies, speak with your doctor about whether allergy testing or immunotherapy (allergy shots) might be beneficial. With proper management, most people can significantly reduce the impact of seasonal allergies on their daily lives.",
    category: "Health Tips",
    author: "Dr. Lisa Patel",
    publishDate: "2024-03-10",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    summary: "Expert advice on handling seasonal allergies and minimizing symptoms naturally."
  },
  {
    id: "7",
    title: "New Pediatric Wing Opening Next Month",
    content: "Draft content for announcement of the new children's wing opening.",
    category: "Hospital Events",
    author: "Hospital Administration",
    publishDate: "2024-05-20",
    status: "draft",
    summary: "Details about our upcoming pediatric facility expansion."
  }
];
