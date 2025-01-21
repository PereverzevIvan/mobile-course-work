export type TReport = {
  results: TResult;
  date: string;
};

export type TResult = {
  physicalComponentHealth: TPsysicalComponentHealth;
  mentalComponentHealth: TMentalComponentHealth;
};

export type TPsysicalComponentHealth = {
  commonPhysicalHealth: number;
  physicalFunctioning: number;
  rolePhisicalFunctioning: number;
  bodilypain: number;
  generalHealth: number;
};

export type TMentalComponentHealth = {
  commonMentalHealth: number;
  vitality: number;
  socialFunctioning: number;
  roleEmotional: number;
  mentalHealth: number;
};
