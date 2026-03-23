export type Section = 'home' | 'materials' | 'videos' | 'tests' | 'contact';

export interface Material {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'video';
  chapter: string;
  description: string;
  uploadDate: string;
  size?: string;
  url?: string;
  link?: string;
  isEditing?: boolean;
}

export interface VideoItem {
  id: number;
  title: string;
  url: string;
  description: string;
  chapter: string;
  uploadDate: string;
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

export interface CustomTest {
  id: number;
  title: string;
  description: string;
  type: 'handwritten' | 'link';
  content?: string;
  url?: string;
  chapter: string;
  uploadDate: string;
  isEditing?: boolean;
}
