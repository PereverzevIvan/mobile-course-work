import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  ResultsContextProvider,
  useResultsContext,
} from "@/context/results.context";
import { getAllResults, saveTestResult } from "@/utils/storage";
import { CQuestions } from "@/constants/questions";
import { TAnswer } from "@/types/questions";
import { calculateTestResults } from "@/utils/calculate";

// Функция для генерации случайных ответов
function randomAnswer(): TAnswer[] {
  const answers: TAnswer[] = [];
  CQuestions.groups.forEach((group) => {
    group.questions.forEach((question) => {
      answers.push({
        questionId: question.id,
        optionWeight: Math.floor(Math.random() * group.options.length) + 1,
      });
    });
  });
  return answers;
}

export default function QuestionnaireScreen() {
  const [currentIndex, setCurrentIndex] = useState(0); // Индекс текущего вопроса
  const { setReports } = useResultsContext();
  const currentGroup = CQuestions.groups[currentIndex]; // Текущая группа вопросов
  const isFirstQuestionGroup = currentIndex === 0;
  const isLastQuestionGroup = currentIndex === CQuestions.groups.length - 1;
  const [answers, setAnswers] = useState<TAnswer[]>([]);

  const questionInAnswers = (questionId: number): number => {
    return answers.findIndex((answer) => answer.questionId === questionId);
  };

  const handlePressOption = (questionId: number, selectedWeight: number) => {
    setAnswers((prev) => {
      const existingAnswerIndex = questionInAnswers(questionId);

      if (existingAnswerIndex !== -1) {
        // Обновляем существующий ответ
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex].optionWeight = selectedWeight;
        return updatedAnswers;
      }

      const newAnswer: TAnswer = { questionId, optionWeight: selectedWeight };

      // Добавляем новый ответ
      return [...prev, newAnswer];
    });
  };

  // Переключение на следующий шаг
  const handleNext = () => {
    if (currentIndex <= CQuestions.groups.length)
      setCurrentIndex((prev) => prev + 1);
  };

  // Переключение на предыдущий шаг
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleFinish = async () => {
    console.log("Тест завершён");
    console.log("Ответы:", answers);
    console.log("Результат:", calculateTestResults(answers));
    saveTestResult(calculateTestResults(answers)).then(() => {
      getAllResults().then((results) => {
        setReports(results);
      });
    });

    resetTest();
  };

  const resetTest = () => {
    setAnswers([]); // Сбрасываем ответы
    setCurrentIndex(0); // Возвращаемся к первому шагу
  };

  useEffect(() => {
    setAnswers(randomAnswer());
  }, []);

  return (
    <ResultsContextProvider>
      <View style={styles.container}>
        {/* Заголовок группы вопросов */}
        {currentGroup.title && (
          <Text style={styles.title}>{currentGroup.title}</Text>
        )}

        {/* Список вопросов */}
        <FlatList
          data={currentGroup.questions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: question }) => (
            <View style={styles.questionContainer}>
              {/* Текст вопроса */}
              <Text style={styles.questionText}>
                {question.id}) {question.text}
              </Text>
              {/* Варианты ответа */}
              {currentGroup.options.map((option) => {
                const isSelected =
                  questionInAnswers(question.id) != -1 &&
                  option.weight ===
                  answers[questionInAnswers(question.id)].optionWeight;
                return (
                  <Pressable
                    key={option.text}
                    style={
                      isSelected
                        ? styles.selectedOptionButton
                        : styles.optionButton
                    }
                    onPress={() =>
                      handlePressOption(question.id, option.weight)
                    }
                  >
                    <Text
                      style={
                        isSelected
                          ? styles.selectedOptionText
                          : styles.optionText
                      }
                    >
                      {option.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />

        {/* Управление переключением вопросов */}
        <View style={styles.navigationContainer}>
          <Button
            disabled={isFirstQuestionGroup}
            title="Назад"
            onPress={handlePrevious}
            color="#2196F3"
          />
          {isLastQuestionGroup ? (
            <Button
              title="Завершить тест"
              disabled={answers.length != CQuestions.questionsCount}
              onPress={handleFinish}
              color="#2196F3"
            />
          ) : (
            <Button title="Далее" onPress={handleNext} color="#2196F3" />
          )}
        </View>
      </View>
    </ResultsContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // overflowY: "scroll",
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedOptionButton: {
    backgroundColor: "#2095F3",
    fontWeight: "bold",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  optionText: {
    fontSize: 14,
  },
  selectedOptionText: {
    fontSize: 14,
    color: "#fff",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
