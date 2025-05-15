
import { Baby, Heart, Brain, Bone, Eye, Stethoscope } from "lucide-react";
import PageHeader from "./PageHeader";
import SpecialtyCard from "./SpecialtyCard";

const specialties = [
  {
    id: "obgyn",
    name: "Ibu dan Anak",
    icon: "Baby",
    description: "Spesialis kesehatan ibu dan anak"
  },
  {
    id: "cardiology",
    name: "Jantung",
    icon: "Heart",
    description: "Spesialis jantung dan pembuluh darah"
  },
  {
    id: "neurology",
    name: "Saraf",
    icon: "Brain",
    description: "Spesialis saraf dan sistem saraf pusat"
  },
  {
    id: "orthopedics",
    name: "Ortopedi",
    icon: "Bone",
    description: "Spesialis tulang dan persendian"
  },
  {
    id: "ophthalmology",
    name: "Mata",
    icon: "Eye",
    description: "Spesialis kesehatan mata"
  },
  {
    id: "internal-medicine",
    name: "Penyakit Dalam",
    icon: "Stethoscope",
    description: "Spesialis penyakit dalam"
  }
];

export default function SpecialtiesSection() {
  return (
    <section className="py-12 bg-background px-4">
      <div className="container mx-auto">
        <PageHeader 
          title="Layanan Spesialis" 
          subtitle="Pilihan spesialis terbaik untuk kebutuhan kesehatan Anda"
          isSectionHeader={true} 
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {specialties.map((specialty) => (
            <SpecialtyCard 
              key={specialty.id}
              name={specialty.name}
              icon={specialty.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
