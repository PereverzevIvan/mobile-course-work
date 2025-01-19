// types.ts

export type TQuestionsList = {
  groups: TQuestionsGroup[];
  questionsCount: number;
};

export type TQuestionsGroup = {
  title?: string;
  questions: TQuestion[];
  options: TOption[];
};

// Вопрос
export type TQuestion = {
  id: number;
  text: string;
};

// Вариант ответа на вопрос
export type TOption = {
  text: string;
  weight: number;
};

export type TAnswer = {
  questionId: number;
  optionWeight: number;
};
