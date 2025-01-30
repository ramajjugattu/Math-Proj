export type Problem = {
  type: 'calculus' | 'linear-algebra';
  subtype: string;
  input: string;
  solution?: string;
  steps?: string[];
  graph?: any;
};

export type MathError = {
  message: string;
  suggestion: string;
  location?: string;
};