export type Section = 'home' | 'materials' | 'videos' | 'tests' | 'contact' | 'cases';

export interface Material {
  id: number | string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'video';
  chapter: string;
  description: string;
  uploadDate: string;
  size?: string;
  url?: string;
  link?: string;
  material_type?: 'lecture' | 'labwork';
  isEditing?: boolean;
}

export interface VideoItem {
  id: number | string;
  title: string;
  url: string;
  description: string;
  chapter: string;
  uploadDate: string;
  thumbnail?: string;
  duration?: string;
  views?: number;
  isEditing?: boolean;
}

export interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  chapter: string;
  duration: number;
  questions: Question[];
  difficulty: 'Оңай' | 'Орташа' | 'Қиын';
}

export interface TestHistory {
  id: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
  answers: (string | number)[];
  questions: Question[];
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correct_option: number;
  additional_materials_link?: string;
}

export interface CustomTest {
  id: number | string;
  title: string;
  description: string;
  type: 'handwritten' | 'link';
  content?: string;
  url?: string;
  chapter: string;
  uploadDate: string;
  isEditing?: boolean;
  questions?: TestQuestion[];
}

export interface CaseItem {
  id: number | string;
  title: string;
  description: string;
  link: string;
  thumbnail?: string;
  uploadDate: string;
  case_type: 'videos' | 'presentations' | 'pdfs' | 'images';
  isEditing?: boolean;
}
