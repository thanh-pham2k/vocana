import { MCQQuestion, FillInTheBlankQuestion } from '@/lib/api';

export type DisplayQuestion = (
  (MCQQuestion & { displayType: 'mcq'; context?: undefined; })
) | (
  (FillInTheBlankQuestion) & { displayType: 'fillInBlank'; context?: undefined; }
) | (
  (MCQQuestion) & {
    displayType: 'readingMcq';
    context: {
      passage: string;
      image?: string;
    };
    mcqs: MCQQuestion[]; // Add mcqs here
  }
) | (
  (MCQQuestion) & {
    displayType: 'listeningMcq';
    context: {
      audioFile: string;
      overallExplanation: string; // from ListeningQuestion.answerExplanation
    };
    mcqs: MCQQuestion[]; // Add mcqs here
  }
); 