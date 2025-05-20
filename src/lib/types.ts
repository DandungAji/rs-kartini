
export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  detailedDescription?: string;
  benefits?: string[];
  procedures?: string[];
};

export type Doctor = {
  id: string;
  name: string;
  specialization_id: string;
  specialization: {
    name: string;
    id?: string;
  };
  contact: string;
  bio: string;
  photo_url: string;
  email?: string;  // Added email property
  phone?: string;  // Added phone property
};

export type Schedule = {
  id: string;
  doctor_id: string;
  doctor?: {
    name: string;
    specialization?: {
      name: string;
      id?: string;
    };
  };
  days: string;
  start_time: string;
  end_time: string;
  status: "active" | "inactive";
};

export type Post = {
  id: string;
  title: string;
  content: string;
  status: string;
  publish_date: string;
  summary?: string;
  image_url?: string;
  author: {
    id: string;
    full_name: string;
    email?: string;
  };
  category: {
    id: string;
    name: string;
  };
};

// Helper function to ensure we always get an object, not an array
// This is useful when Supabase returns arrays for joined tables
export function ensureObject<T>(value: T | T[]): T {
  if (Array.isArray(value)) {
    return value[0] || {} as T;
  }
  return value;
}
