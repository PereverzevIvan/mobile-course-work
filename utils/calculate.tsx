import { TReport } from "@/types/results";
import { TAnswer } from "@/types/questions";
import { canDismiss } from "expo-router/build/global-state/routing";

const bodilypainConvert = (seven: number, eight: number): [number, number] => {
  let newSeven: number, newEight: number;
  const sevenTable: Record<number, number> = {
    1: 6,
    2: 5.4,
    3: 4.2,
    4: 3.1,
    5: 2.2,
    6: 1,
  };
  const eightTable: Record<number, number> = {
    2: 4,
    3: 3,
    4: 2,
    5: 1,
  };

  newSeven = sevenTable[seven];
  if (eight == 1 && seven == 1) {
    newEight = 6;
  } else if (eight == 1 && seven >= 2 && seven <= 6) {
    newEight = 5;
  } else {
    newEight = eightTable[eight];
  }
  return [newSeven, newEight];
};

const generalHealthConvert = (
  first: number,
  thirtyFive: number,
  thirtySix: number
): [number, number, number] => {
  let newFirst: number, newThirtyFive: number, newThirtySix: number;
  const thirtyFiveSixTable: Record<number, number> = {
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1,
  };
  const firstTable: Record<number, number> = {
    1: 5,
    2: 4.4,
    3: 3.4,
    4: 2,
    5: 1,
  };

  newFirst = firstTable[first];
  newThirtyFive = thirtyFiveSixTable[thirtyFive];
  newThirtySix = thirtyFiveSixTable[thirtySix];

  return [newFirst, newThirtyFive, newThirtySix];
};

//  на вход должны подаваться вопросы 23 и 24
const vitalityConvert = (first: number, second: number): [number, number] => {
  const table: Record<number, number> = {
    1: 6,
    2: 5,
    3: 4,
    4: 3,
    5: 2,
    6: 1,
  };

  return [table[first], table[second]];
};

// Функция для расчета Physical Functioning и Role-Physical Functioning
export const calculateTestResults = (answers: TAnswer[]): TReport => {
  // 1. Считаем сумму баллов для Physical Functioning (вопросы с 3 по 12)
  const physicalQuestions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let PFsum = 0;

  physicalQuestions.forEach((questionId) => {
    const answer = answers.find((a) => a.questionId === questionId);
    if (answer && answer.optionWeight !== null) {
      PFsum += answer.optionWeight;
    }
  });

  // Расчет Physical Functioning
  const physicalFunctioning = ((PFsum - 10) / 20) * 100;

  // 2. Считаем сумму баллов для Role-Physical Functioning (вопросы с 13 по 16)
  const rolePhysicalQuestions = [13, 14, 15, 16];
  let RPsum = 0;

  rolePhysicalQuestions.forEach((questionId) => {
    const answer = answers.find((a) => a.questionId === questionId);
    if (answer && answer.optionWeight !== null) {
      RPsum += answer.optionWeight;
    }
  });

  // Расчет Role-Physical Functioning
  const rolePhisicalFunctioning = ((RPsum - 4) / 4) * 100;

  // Интенсивность боли  (Bodily pain - ВР)
  const seven = answers.find((a) => a.questionId === 7);
  const eight = answers.find((a) => a.questionId === 8);
  const [newSeven, newEight] = bodilypainConvert(
    seven?.optionWeight ?? 0,
    eight?.optionWeight ?? 0
  );
  const bodilypain = ((newSeven + newEight - 2) / 10) * 100;

  // Расчет General Health
  const first = answers.find((a) => a.questionId === 1);
  const thirtyFive = answers.find((a) => a.questionId === 35);
  const thirtySix = answers.find((a) => a.questionId === 36);
  const thitryThree =
    answers.find((a) => a.questionId === 33)?.optionWeight ?? 0;
  const thitryFour =
    answers.find((a) => a.questionId === 34)?.optionWeight ?? 0;

  const [newFirst, newThirtyFive, newThirtySix] = generalHealthConvert(
    first?.optionWeight ?? 0,
    thirtyFive?.optionWeight ?? 0,
    thirtySix?.optionWeight ?? 0
  );

  const GHSum =
    newFirst + thitryThree + thitryFour + newThirtyFive + newThirtySix;

  const generalHealth = ((GHSum - 5) / 20) * 100;

  // Расчет Vitality
  const firstVitality = answers.find((a) => a.questionId === 23);
  const secondVitality = answers.find((a) => a.questionId === 24);
  const thirdVitality =
    answers.find((a) => a.questionId === 28)?.optionWeight ?? 0;
  const fourVitality =
    answers.find((a) => a.questionId === 29)?.optionWeight ?? 0;
  const [newFirstVitality, newSecondVitality] = vitalityConvert(
    firstVitality?.optionWeight ?? 0,
    secondVitality?.optionWeight ?? 0
  );
  const VTSum =
    newFirstVitality + newSecondVitality + thirdVitality + fourVitality;
  const vitality = ((VTSum - 4) / 20) * 100;

  // расчет социального функционирования
  const firstSocialFunctioning =
    answers.find((a) => a.questionId === 20)?.optionWeight ?? 1;
  const secondSocialFunctioning =
    answers.find((a) => a.questionId === 32)?.optionWeight ?? 1;
  const newFirstSocialFunctioning = 6 - firstSocialFunctioning;
  const SFSum = newFirstSocialFunctioning + secondSocialFunctioning;
  const socialFunctioning = ((SFSum - 2) / 8) * 100;

  // Расчет ролевого функционирования
  let RESum = 0;
  for (let i = 17; i <= 19; i++) {
    const answer = answers.find((a) => a.questionId === i)?.optionWeight ?? 1;
    RESum += answer;
  }
  const roleEmotional = ((RESum - 3) / 3) * 100;

  // Расчет психического здоровья
  const firstMentalHealth =
    answers.find((a) => a.questionId === 25)?.optionWeight ?? 1;
  const secondMentalHealth =
    answers.find((a) => a.questionId === 30)?.optionWeight ?? 1;
  const thirdMentalHealth =
    answers.find((a) => a.questionId === 26)?.optionWeight ?? 1;
  const fourMentalHealth =
    answers.find((a) => a.questionId === 27)?.optionWeight ?? 1;
  const fiveMentalHealth =
    answers.find((a) => a.questionId === 31)?.optionWeight ?? 1;

  const newFirstMentalHealth = 7 - firstMentalHealth;
  const newSecondMentalHealth = 7 - secondMentalHealth;

  const MHSum =
    newFirstMentalHealth +
    newSecondMentalHealth +
    thirdMentalHealth +
    fourMentalHealth +
    fiveMentalHealth;
  const mentalHealth = ((MHSum - 5) / 25) * 100;

  // Расчет общих показателей «Физический компонент здоровья (Physical health – PH)» и «Психологический компонент здоровья (Mental Health – MH)»
  const PF_Z = (physicalFunctioning - 84.52404) / 22.8949;
  const RP_Z = (rolePhisicalFunctioning - 81.19907) / 33.79729;
  const BP_Z = (bodilypain - 75.49196) / 23.55879;
  const GH_Z = (generalHealth - 72.21316) / 20.16964;
  const VT_Z = (vitality - 61.05453) / 20.86942;
  const SF_Z = (socialFunctioning - 83.59753) / 22.37642;
  const RE_Z = (roleEmotional - 81.29467) / 33.02717;
  const MH_Z = (mentalHealth - 74.84212) / 18.01189;

  const commonPHsum =
    PF_Z * 0.42402 +
    RP_Z * 0.35119 +
    BP_Z * 0.31754 +
    SF_Z * -0.00753 +
    MH_Z * -0.22069 +
    RE_Z * -0.19206 +
    VT_Z * 0.02877 +
    GH_Z * 0.24954;

  const commonPH = commonPHsum * 10 + 50;

  const commonMHsum =
    PF_Z * -0.22999 +
    RP_Z * -0.12329 +
    BP_Z * -0.09731 +
    SF_Z * 0.26876 +
    MH_Z * 0.48581 +
    RE_Z * 0.43407 +
    VT_Z * 0.23534 +
    GH_Z * -0.01571;

  const commonMH = commonMHsum * 10 + 50;

  const date = new Date();
  const formatDate = `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()} ${String(date.getHours()).padStart(
    2,
    "0"
  )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;

  // Возвращаем результаты
  const report: TReport = {
    results: {
      physicalComponentHealth: {
        commonPhysicalHealth: commonPH,
        physicalFunctioning,
        rolePhisicalFunctioning,
        bodilypain,
        generalHealth,
      },
      mentalComponentHealth: {
        commonMentalHealth: commonMH,
        vitality,
        socialFunctioning,
        roleEmotional,
        mentalHealth,
      },
    },
    date: formatDate,
  };

  return report;
};
