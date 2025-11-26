import charactersQuiz from "./characters_quiz.json";
import petsQuiz from "./pets_quiz.json";
import weaponsQuiz from "./weapons_quiz.json";
import charactersDetails from "./characters_details.json";
import petsDetails from "./pets_details.json";
import weaponsDetails from "./waepons_details.json";

export type QuizCategory = "characters" | "pets" | "weapons";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  questions: Question[];
  category: QuizCategory;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

type RawQuizEntry = {
  imagePath?: string;
  name: string;
  description: string;
  questions: Array<{
    question: string;
    answer: string;
    A: string;
    B: string;
    C: string;
    D: string;
  }>;
};

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getAnswerIndex = (letter: string) => {
  const index = letter.trim().toUpperCase().charCodeAt(0) - 65;
  return index >= 0 && index <= 3 ? index : 0;
};

const getImagePath = (imagePath: string | undefined, category: QuizCategory): string => {
  if (!imagePath) {
    return PLACEHOLDER_IMAGE;
  }
  // Images are stored in public/images/{category}/{imagePath}
  // For Vite, public folder files are served from root
  return `/images/${category}/${imagePath}`;
};

const fromJson = (entries: RawQuizEntry[], category: QuizCategory): Quiz[] =>
  entries.map((entry) => {
    const slug = slugify(entry.name);
    return {
      id: `${category}-${slug}`,
      title: entry.name,
      description: entry.description,
      image: getImagePath(entry.imagePath, category),
      category,
      questions: entry.questions.map((question, index) => ({
        id: `${category}-${slug}-${index + 1}`,
        question: question.question,
        options: [question.A, question.B, question.C, question.D],
        correctAnswer: getAnswerIndex(question.answer),
      })),
    };
  });

export const quizzes: Quiz[] = [
  ...fromJson(charactersQuiz as RawQuizEntry[], "characters"),
  ...fromJson(petsQuiz as RawQuizEntry[], "pets"),
  ...fromJson(weaponsQuiz as RawQuizEntry[], "weapons"),
];

// Export details data
export type ItemDetails = {
  name: string;
  title: string;
  description: string;
  role?: string;
  type?: string;
  ability?: {
    name: string;
    type: string;
    details: any;
  };
  skill?: {
    name: string;
    type: string;
    details: any;
  };
  weapon_type?: string;
  damage?: number;
  fire_rate?: number;
  range?: string;
  magazine_size?: number | string;
  reload_time?: number;
  healing_per_second?: number;
  special_features?: string[];
  strengths?: string[];
  weaknesses?: string[];
  best_for?: string[];
  best_combinations?: Array<{
    combo: string[];
    reason: string;
  }>;
  tips?: string[];
  release: {
    update: string;
    type: string;
  };
};

const allDetails: Record<QuizCategory, ItemDetails[]> = {
  characters: charactersDetails as ItemDetails[],
  pets: petsDetails as ItemDetails[],
  weapons: weaponsDetails as ItemDetails[],
};

export const getItemDetails = (category: QuizCategory, name: string): ItemDetails | undefined => {
  const categoryDetails = allDetails[category];
  return categoryDetails.find((item) => slugify(item.name) === slugify(name));
};
