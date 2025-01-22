import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { getAllResults, clearResults } from "@/utils/storage";
import { generateHealthChart } from "@/utils/generateDiagram";

import { TReport } from "@/types/results";
import { useResultsContext } from "@/context/results.context";
import Toast from "react-native-toast-message";

const getBackgroundColor = (value: number) => {
  if (value < 30) return styles.lowValue;
  if (value < 60) return styles.mediumValue;
  return styles.highValue;
};

const healthMetricsTranslations = {
  commonPhysicalHealth: "Общее физическое здоровье",
  physicalFunctioning: "Физическое функционирование",
  rolePhisicalFunctioning:
    "Ролевое функционирование, обусловленное физическим состоянием",
  bodilypain: "Интенсивность боли",
  generalHealth: "Общее состояние здоровья",
  commonMentalHealth: "Общее ментальное здоровье",
  vitality: "Жизненная активность",
  socialFunctioning: "Социальное функционирование",
  roleEmotional:
    "Ролевое функционирование, обусловленное эмоциональным состоянием",
  mentalHealth: "Психическое здоровье",
};

function MetricLegend() {
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendRow}>
        <View style={[styles.legendColorBox, styles.legendRed]} />
        <Text style={styles.legendText}>
          Вам следует проконсультироваться с врачом
        </Text>
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendColorBox, styles.legendYellow]} />
        <Text style={styles.legendText}>Средний показатель (норма)</Text>
      </View>
      <View style={styles.legendRow}>
        <View style={[styles.legendColorBox, styles.legendGreen]} />
        <Text style={styles.legendText}>У вас всё хорошо</Text>
      </View>
    </View>
  );
}

export default function TestResultsScreen() {
  const { reports, setReports } = useResultsContext();
  const [selectedReport, setSelectedReport] = useState<TReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [finalHealthScore, setFinalHealthScore] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false); // Новое состояние
  const [imageSrc, setImageSrc] = useState<string | null>(null); // URL изображения

  useEffect(() => {
    if (selectedReport) {
      setFinalHealthScore(
        selectedReport.results.mentalComponentHealth.commonMentalHealth +
        selectedReport.results.physicalComponentHealth.commonPhysicalHealth,
      );
    }
  }, [selectedReport]);

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
    clearResults().then(() => {
      setReports([]);
    });
  };

  const handleShowImage = () => {
    if (reports != null) {
      generateHealthChart(reports).then((url) => {
        if (url) {
          setImageSrc(url);
          setImageModalVisible(true);
        }
      });
    }
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
              Общее физическое здоровье:{" "}
              {item.results.physicalComponentHealth.commonPhysicalHealth}
            </Text>
            <Text>
              Общее ментальное здоровье:{" "}
              {item.results.mentalComponentHealth.commonMentalHealth}
            </Text>
            <Text>
              Конечная оценка здоровья:{" "}
              {item.results.mentalComponentHealth.commonMentalHealth +
                item.results.physicalComponentHealth.commonPhysicalHealth}
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
              <ScrollView>
                {Object.entries(selectedReport.results).map(
                  ([category, data]) =>
                    Object.entries(data).map(([key, value]) => (
                      <View
                        key={key}
                        style={[
                          styles.metricContainer,
                          key != "commonPhysicalHealth" &&
                            key != "commonMentalHealth"
                            ? getBackgroundColor(value)
                            : { backgroundColor: "white" },
                        ]}
                      >
                        <Text style={styles.metricText}>
                          {healthMetricsTranslations[key]}: {value}
                        </Text>
                      </View>
                    )),
                )}
                <View
                  style={[
                    styles.metricContainer,
                    getBackgroundColor(finalHealthScore),
                  ]}
                >
                  <Text style={styles.metricText}>
                    Конечная оценка здоровья: {finalHealthScore}
                  </Text>
                </View>
                <MetricLegend />
              </ScrollView>
            </>
          )}
          <Button title="Закрыть" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Новое модальное окно для изображения */}
      <Modal
        visible={imageModalVisible}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          {imageSrc && <img src={imageSrc} style={styles.image} />}
          <Button title="Закрыть" onPress={() => setImageModalVisible(false)} />
        </View>
      </Modal>

      {/* Кнопки под списком */}
      <View style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <Button
          title="Очистить все результаты"
          color={"crimson"}
          onPress={handleClearResults}
        />
        <Button
          disabled={reports == null}
          title="Построить график"
          onPress={() => handleShowImage()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  metricContainer: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2, // Для Android
  },
  metricText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  lowValue: {
    backgroundColor: "crimson", // Красноватый
  },
  mediumValue: {
    backgroundColor: "orange", // Желтоватый
  },
  highValue: {
    backgroundColor: "#6BCB77", // Зеленоватый
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendRed: {
    backgroundColor: "crimson", // Красный
  },
  legendYellow: {
    backgroundColor: "orange", // Желтый
  },
  legendGreen: {
    backgroundColor: "#6BCB77", // Зеленый
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
  legendContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Для Android
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  image: {
    width: "90%",
  },
});
