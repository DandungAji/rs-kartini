
export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  imageUrl?: string;
  bio?: string;
  email?: string;
  phone?: string;
};

export type Department = {
  id: string;
  name: string;
  description?: string;
};

export type Schedule = {
  id: string;
  doctorId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  location?: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  status: "draft" | "published";
  imageUrl?: string;
  summary?: string;
};

export type PostCategory = {
  id: string;
  name: string;
  slug: string;
};
