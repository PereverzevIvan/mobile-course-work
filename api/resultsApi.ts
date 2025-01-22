import { TReport, TResult } from "@/types/results";
import axiosInstance from "./apiClient";

// Получение всех результатов
export const getAllResultsApi = async (): Promise<TReport[]> => {
  const response = await axiosInstance.get("/results");
  return response.data; // Данные в формате JSON
};

// Сохранение нового результата
export const saveNewResultApi = async (result: TReport): Promise<void> => {
  await axiosInstance.post("/results", result);
};

// Удаление всех результатов
export const deleteAllResultsApi = async (): Promise<void> => {
  await axiosInstance.delete("/results");
};
