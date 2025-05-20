
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpecialtyCard from './SpecialtyCard';
import PageHeader from './PageHeader';
import { Heart, Brain, Eye, Stethoscope, Baby, Bone } from "lucide-react";

const specialties = [
  {
    id: "card1",
    title: "Kardiologi",
    description: "Spesialis dalam diagnosis dan perawatan penyakit jantung dan pembuluh darah.",
    icon: <Heart className="h-6 w-6 text-primary" />
  },
  {
    id: "card2",
    title: "Neurologi",
    description: "Fokus pada diagnosis dan perawatan gangguan pada sistem saraf, termasuk otak dan sumsum tulang belakang.",
    icon: <Brain className="h-6 w-6 text-primary" />
  },
  {
    id: "card3",
    title: "Oftalmologi",
    description: "Perawatan untuk kondisi mata dan gangguan penglihatan melalui diagnosis dan perawatan medis.",
    icon: <Eye className="h-6 w-6 text-primary" />
  },
  {
    id: "card4",
    title: "Penyakit Dalam",
    description: "Spesialis dalam diagnosis dan perawatan penyakit pada organ-organ internal tubuh.",
    icon: <Stethoscope className="h-6 w-6 text-primary" />
  },
  {
    id: "card5",
    title: "Pediatri",
    description: "Fokus pada kesehatan dan perkembangan anak-anak, bayi hingga remaja.",
    icon: <Baby className="h-6 w-6 text-primary" />
  },
  {
    id: "card6",
    title: "Ortopedi",
    description: "Spesialis dalam diagnosis, perawatan, rehabilitasi, dan pencegahan cedera atau penyakit pada sistem muskuloskeletal.",
    icon: <Bone className="h-6 w-6 text-primary" />
  }
];

export default function SpecialtiesSection({ isFullPage = false }) {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        {isFullPage ? (
          <PageHeader 
            title="Layanan Spesialis" 
            subtitle="RS Kartini menyediakan berbagai layanan spesialis untuk kebutuhan kesehatan Anda dan keluarga" 
            isSectionHeader={true}
          />
        ) : (
          <>
            <h2 className="section-title">Layanan Spesialis</h2>
            <p className="section-subtitle">
              RS Kartini menyediakan berbagai layanan spesialis untuk kebutuhan kesehatan Anda dan keluarga
            </p>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {specialties.map((specialty) => (
            <SpecialtyCard
              key={specialty.id}
              title={specialty.title}
              description={specialty.description}
              icon={specialty.icon}
            />
          ))}
        </div>

        {!isFullPage && (
          <div className="text-center mt-10">
            <Button asChild size="lg" className="animate-float">
              <a href="/services">Lihat Semua Layanan</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
