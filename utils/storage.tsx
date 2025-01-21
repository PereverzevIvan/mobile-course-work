import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const RESULTS_KEY = "test_results";

export async function saveTestResult(newResult: object) {
  try {
    // Извлечь текущие результаты
    const storedResults = await AsyncStorage.getItem(RESULTS_KEY);
    const results = storedResults ? JSON.parse(storedResults) : [];

    // Добавить новый результат
    results.push(newResult);

    // Сохранить обновлённый массив
    await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    console.log("Результат успешно сохранён");
    Toast.show({
      type: "success",
      text1: "Результат успешно сохранён",
    });
  } catch (error) {
    console.error("Ошибка сохранения результата:", error);
    Toast.show({
      type: "error",
      text1: "Ошибка сохранения результата:",
    });
  }
}

export async function getAllResults() {
  try {
    const storedResults = await AsyncStorage.getItem(RESULTS_KEY);
    return storedResults ? JSON.parse(storedResults) : [];
  } catch (error) {
    console.error("Ошибка извлечения результатов:", error);
    return [];
  }
}

export async function clearResults() {
  try {
    await AsyncStorage.removeItem(RESULTS_KEY);
    console.log("Все результаты удалены");
    Toast.show({
      type: "success",
      text1: "Все результаты удалены",
    });
  } catch (error) {
    console.error("Ошибка очистки результатов:", error);
    Toast.show({
      type: "error",
      text1: "Ошибка очистки результатов",
    });
  }
}
