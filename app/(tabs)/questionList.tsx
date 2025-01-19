import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

import { CQuestions } from "@/constants/questions";
import { TAnswer, TOption } from "@/types/questions";

export default function QuestionnaireScreen() {
  const [currentIndex, setCurrentIndex] = useState(0); // Индекс текущего вопроса
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

  // Переключение на следующий вопрос
  const handleNext = () => {
    if (!isLastQuestionGroup) setCurrentIndex((prev) => prev + 1);
  };

  // Переключение на предыдущий вопрос
  const handlePrevious = () => {
    if (!isFirstQuestionGroup) setCurrentIndex((prev) => prev - 1);
  };

  const handleFinish = () => {
    console.log("Тест завершён");
    console.log("Ответы:", answers);
  };

  return (
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
            {currentGroup.options.map((option) => (
              <Pressable
                key={option.text}
                style={
                  questionInAnswers(question.id) != -1 &&
                  option.weight ===
                    answers[questionInAnswers(question.id)].optionWeight
                    ? styles.selectedOptionButton
                    : styles.optionButton
                }
                onPress={() => handlePressOption(question.id, option.weight)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      {/* Управление переключением вопросов */}
      <View style={styles.navigationContainer}>
        {!isFirstQuestionGroup && (
          <Button title="Назад" onPress={handlePrevious} color="#4CAF50" />
        )}
        {isLastQuestionGroup ? (
          <Button
            title="Завершить тест"
            onPress={handleFinish}
            color="#F44336"
          />
        ) : (
          <Button title="Далее" onPress={handleNext} color="#2196F3" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: "white",
    fontWeight: "bold",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  optionText: {
    fontSize: 14,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
