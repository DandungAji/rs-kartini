import { Doctor, Schedule, Service, Post, PostCategory, Department } from "./types";

// Mock Doctors Data
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions.",
    email: "sarah.johnson@medhub.com",
    phone: "123-456-7890"
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    specialization: "Orthopedics",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Dr. Rodriguez specializes in sports medicine and joint replacement surgery.",
    email: "michael.rodriguez@medhub.com",
    phone: "123-456-7891"
  },
  {
    id: "3",
    name: "Dr. Emily Chen",
    specialization: "Dermatology",
    imageUrl: "https://images.unsplash.com/photo-1588421357567-bb76f0e42649?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    bio: "Dr. Chen is an expert in diagnosing and treating skin conditions, including acne, eczema, and skin cancer.",
    email: "emily.chen@medhub.com",
    phone: "123-456-7892"
  },
  {
    id: "4",
    name: "Dr. David Lee",
    specialization: "Neurology",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-70a0788ddc2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Dr. Lee is a neurologist specializing in the diagnosis and treatment of disorders of the nervous system.",
    email: "david.lee@medhub.com",
    phone: "123-456-7893"
  },
  {
    id: "5",
    name: "Dr. Maria Garcia",
    specialization: "Pediatrics",
    imageUrl: "https://images.unsplash.com/photo-1628592737646-9994199543e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Dr. Garcia is a pediatrician dedicated to providing comprehensive medical care for infants, children, and adolescents.",
    email: "maria.garcia@medhub.com",
    phone: "123-456-7894"
  },
  {
    id: "6",
    name: "Dr. Robert Wilson",
    specialization: "Ophthalmology",
    imageUrl: "https://images.unsplash.com/photo-1576766529448-c544c659949f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Dr. Wilson is an ophthalmologist specializing in the diagnosis and treatment of eye diseases and vision problems.",
    email: "robert.wilson@medhub.com",
    phone: "123-456-7895"
  }
];

// Mock Departments
export const departments: Department[] = [
  {
    id: "1",
    name: "Cardiology",
    description: "Diagnosis and treatment of heart disorders."
  },
  {
    id: "2",
    name: "Orthopedics",
    description: "Care for bones, joints, ligaments, tendons, muscles, and nerves."
  },
  {
    id: "3",
    name: "Dermatology",
    description: "Diagnosis and treatment of skin conditions."
  },
  {
    id: "4",
    name: "Neurology",
    description: "Diagnosis and treatment of disorders of the nervous system."
  },
  {
    id: "5",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents."
  },
  {
    id: "6",
    name: "Ophthalmology",
    description: "Diagnosis and treatment of eye diseases and vision problems."
  }
];

// Mock Schedules Data - Adding the required status property
export const schedules: Schedule[] = [
  {
    id: "1",
    doctorId: "1",
    day: "Monday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 101",
    status: "active"
  },
  {
    id: "2",
    doctorId: "1",
    day: "Wednesday",
    startTime: "14:00",
    endTime: "18:00",
    location: "Room 101",
    status: "active"
  },
  {
    id: "3",
    doctorId: "1",
    day: "Friday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 101",
    status: "active"
  },
  {
    id: "4",
    doctorId: "2",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 102",
    status: "active"
  },
  {
    id: "5",
    doctorId: "2",
    day: "Thursday",
    startTime: "14:00",
    endTime: "18:00",
    location: "Room 102",
    status: "active"
  },
  {
    id: "6",
    doctorId: "3",
    day: "Monday",
    startTime: "14:00",
    endTime: "18:00",
    location: "Room 103",
    status: "active"
  },
  {
    id: "7",
    doctorId: "3",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 103",
    status: "active"
  },
  {
    id: "8",
    doctorId: "3",
    day: "Friday",
    startTime: "14:00",
    endTime: "18:00",
    location: "Room 103",
    status: "active"
  },
  {
    id: "9",
    doctorId: "4",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 104",
    status: "active"
  },
  {
    id: "10",
    doctorId: "4",
    day: "Thursday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 104",
    status: "active"
  },
  {
    id: "11",
    doctorId: "5",
    day: "Tuesday",
    startTime: "14:00",
    endTime: "18:00",
    location: "Room 105",
    status: "active"
  },
  {
    id: "12",
    doctorId: "5",
    day: "Thursday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 105",
    status: "active"
  },
  {
    id: "13",
    doctorId: "6",
    day: "Monday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 106",
    status: "active"
  },
  {
    id: "14",
    doctorId: "6",
    day: "Wednesday",
    startTime: "14:00",
    endTime: "18:00",
    location: "Room 106",
    status: "active"
  },
  {
    id: "15",
    doctorId: "6",
    day: "Friday",
    startTime: "09:00",
    endTime: "13:00",
    location: "Room 106",
    status: "active"
  }
];

// Mock Services Data
export const services: Service[] = [
  {
    id: "1",
    name: "General Checkup",
    description: "Comprehensive health assessment.",
    icon: "activity",
    category: "Preventive Care",
    detailedDescription: "A general checkup involves a thorough examination of your overall health, including vital signs, physical examination, and discussion of any health concerns.",
    benefits: ["Early detection of health issues", "Personalized health advice", "Preventive care strategies"],
    procedures: ["Vital signs measurement", "Physical examination", "Health risk assessment"]
  },
  {
    id: "2",
    name: "Vaccination",
    description: "Protection against infectious diseases.",
    icon: "shield",
    category: "Preventive Care",
    detailedDescription: "Vaccination is a safe and effective way to protect yourself and your family from infectious diseases. Vaccines stimulate your immune system to produce antibodies that fight off specific pathogens.",
    benefits: ["Disease prevention", "Community immunity", "Reduced healthcare costs"],
    procedures: ["Vaccine administration", "Immunization record update", "Post-vaccination monitoring"]
  },
  {
    id: "3",
    name: "Blood Test",
    description: "Analysis of blood samples for diagnostic purposes.",
    icon: "droplet",
    category: "Diagnostics",
    detailedDescription: "A blood test involves analyzing a sample of your blood to assess various health markers, such as cholesterol levels, blood sugar, and organ function. Blood tests can help diagnose a wide range of medical conditions.",
    benefits: ["Early disease detection", "Monitoring of treatment effectiveness", "Personalized treatment planning"],
    procedures: ["Blood sample collection", "Laboratory analysis", "Result interpretation"]
  },
  {
    id: "4",
    name: "X-Ray",
    description: "Imaging technique to visualize internal structures.",
    icon: "scan",
    category: "Diagnostics",
    detailedDescription: "An X-ray is a non-invasive imaging technique that uses electromagnetic radiation to visualize internal structures, such as bones and organs. X-rays are commonly used to diagnose fractures, infections, and other medical conditions.",
    benefits: ["Non-invasive imaging", "Quick diagnosis", "Detection of internal abnormalities"],
    procedures: ["Patient positioning", "Radiation exposure", "Image interpretation"]
  },
  {
    id: "5",
    name: "Physical Therapy",
    description: "Rehabilitation and pain management through exercise.",
    icon: "move",
    category: "Rehabilitation",
    detailedDescription: "Physical therapy is a healthcare profession that focuses on restoring and improving physical function and mobility. Physical therapists use a variety of techniques, including exercise, manual therapy, and education, to help patients recover from injuries, manage pain, and improve their overall quality of life.",
    benefits: ["Pain relief", "Improved mobility", "Injury prevention"],
    procedures: ["Exercise prescription", "Manual therapy", "Patient education"]
  },
  {
    id: "6",
    name: "Mental Health Counseling",
    description: "Support and guidance for emotional well-being.",
    icon: "message-circle",
    category: "Mental Health",
    detailedDescription: "Mental health counseling provides support and guidance for individuals experiencing emotional, behavioral, or psychological challenges. Counselors use a variety of therapeutic techniques to help patients cope with stress, anxiety, depression, and other mental health concerns.",
    benefits: ["Improved emotional well-being", "Stress management", "Enhanced coping skills"],
    procedures: ["Individual therapy", "Group therapy", "Cognitive-behavioral therapy"]
  }
];

// Mock Post Categories
export const postCategories: PostCategory[] = [
  {
    id: "1",
    name: "Health Tips",
    slug: "health-tips"
  },
  {
    id: "2",
    name: "Medical News",
    slug: "medical-news"
  },
  {
    id: "3",
    name: "Research",
    slug: "research"
  },
  {
    id: "4",
    name: "Patient Stories",
    slug: "patient-stories"
  }
];

// Mock Posts Data
export const posts: Post[] = [
  {
    id: "1",
    title: "The Benefits of Regular Exercise",
    content: "Regular exercise has numerous benefits for your physical and mental health. It can help you maintain a healthy weight, reduce your risk of chronic diseases, improve your mood, and boost your energy levels.",
    category: "Health Tips",
    author: "Dr. Sarah Johnson",
    publishDate: "2023-08-01",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-67f8dc3a68bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    summary: "Discover the many benefits of regular exercise for your physical and mental health."
  },
  {
    id: "2",
    title: "New Breakthrough in Cancer Treatment",
    content: "Researchers have discovered a new breakthrough in cancer treatment that shows promising results in clinical trials. The new treatment targets cancer cells with greater precision, reducing side effects and improving patient outcomes.",
    category: "Medical News",
    author: "Dr. Michael Rodriguez",
    publishDate: "2023-07-25",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1584036561566-bca930d795ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    summary: "Learn about the new breakthrough in cancer treatment that shows promising results in clinical trials."
  },
  {
    id: "3",
    title: "The Importance of Mental Health Awareness",
    content: "Mental health is just as important as physical health. It's essential to raise awareness about mental health issues and reduce the stigma associated with seeking help. If you're struggling with your mental health, don't hesitate to reach out to a mental health professional.",
    category: "Health Tips",
    author: "Dr. Emily Chen",
    publishDate: "2023-07-18",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1505576399892-ec50e95374bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    summary: "Learn about the importance of mental health awareness and how to seek help if you're struggling."
  },
  {
    id: "4",
    title: "The Latest Research on Alzheimer's Disease",
    content: "Researchers have made significant progress in understanding the underlying mechanisms of Alzheimer's disease. The latest research suggests that targeting specific proteins in the brain may help prevent or slow the progression of the disease.",
    category: "Research",
    author: "Dr. David Lee",
    publishDate: "2023-07-11",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1585435054410-69b9f9944998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    summary: "Discover the latest research on Alzheimer's disease and potential new treatments."
  },
  {
    id: "5",
    title: "A Mother's Journey Through Her Child's Cancer Treatment",
    content: "In this inspiring patient story, a mother shares her journey through her child's cancer treatment. She discusses the challenges she faced, the support she received, and the hope that kept her going.",
    category: "Patient Stories",
    author: "Dr. Maria Garcia",
    publishDate: "2023-07-04",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1560787479-41ba55db547d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    summary: "Read an inspiring patient story about a mother's journey through her child's cancer treatment."
  },
  {
    id: "6",
    title: "The Importance of Regular Eye Exams",
    content: "Regular eye exams are essential for maintaining good vision and detecting eye diseases early. Eye exams can help identify problems such as glaucoma, cataracts, and macular degeneration, which can lead to vision loss if left untreated.",
    category: "Health Tips",
    author: "Dr. Robert Wilson",
    publishDate: "2023-06-27",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1591604029544-ebca194ebc94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    summary: "Learn about the importance of regular eye exams for maintaining good vision and detecting eye diseases early."
  }
];
