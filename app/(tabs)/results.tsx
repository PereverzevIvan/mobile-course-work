import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Pressable,
  Modal,
} from "react-native";
import { getAllResults, clearResults } from "@/utils/storage";

import { TReport } from "@/types/results";

export default function TestResultsScreen() {
  const [reports, setReports] = useState<TReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAllResults().then((results) => {
      setReports(results);
    });
  }, []);

  // Открытие модального окна с деталями
  const handleViewDetails = (report: TReport) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleClearResults = () => {
    clearResults();
    setReports([]);
  };

  return (
    <View style={styles.container}>
      {/* Список результатов */}
      <FlatList
        data={reports}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Дата: {item.date}</Text>
            <Text>
              Common Physical Health:{" "}
              {item.results.physicalComponentHealth.commonPhysicalHealth}
            </Text>
            <Text>
              Physical Functioning:{" "}
              {item.results.physicalComponentHealth.physicalFunctioning}
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => handleViewDetails(item)}
            >
              <Text style={styles.buttonText}>Смотреть подробнее</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет результатов</Text>
        }
      />

      {/* Модальное окно для деталей */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedReport && (
            <>
              <Text style={styles.modalTitle}>Дата: {selectedReport.date}</Text>
              <Text>
                Common Physical Health:{" "}
                {
                  selectedReport.results.physicalComponentHealth
                    .commonPhysicalHealth
                }
              </Text>
              <Text>
                Physical Functioning:{" "}
                {
                  selectedReport.results.physicalComponentHealth
                    .physicalFunctioning
                }
              </Text>
              <Text>
                Role Physical Functioning:{" "}
                {
                  selectedReport.results.physicalComponentHealth
                    .rolePhisicalFunctioning
                }
              </Text>
              <Text>
                Bodily Pain:{" "}
                {selectedReport.results.physicalComponentHealth.bodilypain}
              </Text>
              <Text>
                General Health:{" "}
                {selectedReport.results.physicalComponentHealth.generalHealth}
              </Text>
              <Text>
                Common Mental Health:{" "}
                {
                  selectedReport.results.mentalComponentHealth
                    .commonMentalHealth
                }
              </Text>
              <Text>
                Vitality:{" "}
                {selectedReport.results.mentalComponentHealth.vitality}
              </Text>
              <Text>
                Social Functioning:{" "}
                {selectedReport.results.mentalComponentHealth.socialFunctioning}
              </Text>
              <Text>
                Role Emotional:{" "}
                {selectedReport.results.mentalComponentHealth.roleEmotional}
              </Text>
              <Text>
                Mental Health:{" "}
                {selectedReport.results.mentalComponentHealth.mentalHealth}
              </Text>
            </>
          )}
          <Button title="Закрыть" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Кнопки под списком */}
      <View>
        <Button title="Очистить все результаты" onPress={handleClearResults} />
        <Button
          title="Построить график"
          onPress={() => console.log("Построение графика")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  button: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },
  buttonText: { color: "#fff", textAlign: "center" },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
  modalContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
