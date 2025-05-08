import { Service } from "./types";

// Mock Services Data
export const services: Service[] = [
  {
    id: "1",
    name: "Rawat Jalan",
    description: "Perawatan medis efektif tanpa rawat inap di rumah sakit.",
    icon: "activity",
    category: "Preventive Care",
    detailedDescription: "A general checkup involves a thorough examination of your overall health, including vital signs, physical examination, and discussion of any health concerns.",
    benefits: ["Early detection of health issues", "Personalized health advice", "Preventive care strategies"],
    procedures: ["Vital signs measurement", "Physical examination", "Health risk assessment"]
  },
  {
    id: "2",
    name: "IGD",
    description: "Perawatan medis darurat yang cepat dan profesional.",
    icon: "shield",
    category: "Preventive Care",
    detailedDescription: "Vaccination is a safe and effective way to protect yourself and your family from infectious diseases. Vaccines stimulate your immune system to produce antibodies that fight off specific pathogens.",
    benefits: ["Disease prevention", "Community immunity", "Reduced healthcare costs"],
    procedures: ["Vaccine administration", "Immunization record update", "Post-vaccination monitoring"]
  },
  {
    id: "3",
    name: "Rawat Inap",
    description: "Perawatan medis intensif di rumah sakit untuk pemulihan pasien.",
    icon: "droplet",
    category: "Diagnostics",
    detailedDescription: "A blood test involves analyzing a sample of your blood to assess various health markers, such as cholesterol levels, blood sugar, and organ function. Blood tests can help diagnose a wide range of medical conditions.",
    benefits: ["Early disease detection", "Monitoring of treatment effectiveness", "Personalized treatment planning"],
    procedures: ["Blood sample collection", "Laboratory analysis", "Result interpretation"]
  },
  {
    id: "4",
    name: "Laboratorium",
    description: "Tes dan analisis medis untuk diagnosis pasien.",
    icon: "scan",
    category: "Diagnostics",
    detailedDescription: "An X-ray is a non-invasive imaging technique that uses electromagnetic radiation to visualize internal structures, such as bones and organs. X-rays are commonly used to diagnose fractures, infections, and other medical conditions.",
    benefits: ["Non-invasive imaging", "Quick diagnosis", "Detection of internal abnormalities"],
    procedures: ["Patient positioning", "Radiation exposure", "Image interpretation"]
  },
  {
    id: "5",
    name: "Radiologi",
    description: "Penggunaan teknologi pencitraan untuk diagnosis kondisi medis pasien.",
    icon: "move",
    category: "Rehabilitation",
    detailedDescription: "Physical therapy is a healthcare profession that focuses on restoring and improving physical function and mobility. Physical therapists use a variety of techniques, including exercise, manual therapy, and education, to help patients recover from injuries, manage pain, and improve their overall quality of life.",
    benefits: ["Pain relief", "Improved mobility", "Injury prevention"],
    procedures: ["Exercise prescription", "Manual therapy", "Patient education"]
  },
  {
    id: "6",
    name: "Farmasi",
    description: "Penyediaan obat dan edukasi/informasi penting kepada pasien.",
    icon: "message-circle",
    category: "Mental Health",
    detailedDescription: "Mental health counseling provides support and guidance for individuals experiencing emotional, behavioral, or psychological challenges. Counselors use a variety of therapeutic techniques to help patients cope with stress, anxiety, depression, and other mental health concerns.",
    benefits: ["Improved emotional well-being", "Stress management", "Enhanced coping skills"],
    procedures: ["Individual therapy", "Group therapy", "Cognitive-behavioral therapy"]
  }
];
