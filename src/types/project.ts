export interface Project {
  id: number;
  title: string;
  category?: string;
  color?: string;
  description: string;
  year?: string;
  tech: string[];
  image: string;
  images: string[];
  role: string;
  longDescription: string[];
}
