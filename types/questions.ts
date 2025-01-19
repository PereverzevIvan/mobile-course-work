// types.ts

export type TQuestionsGroup = {
  title?: string;
  questions: Question[];
  options: Option[];
};

// Вопрос
export type Question = {
  id: number;
  text: string;
};

// Вариант ответа на вопрос
export type Option = {
  text: string;
  weight: number;
};
