import { TReport } from "@/types/results";
import axios from "axios";

export async function generateHealthChart(reports: TReport[]) {
  // Генерируем данные для графика
  const labels: string[] = [];
  const data: number[] = [];

  reports.slice(-7).forEach((report) => {
    const date = report.date.split(" ")[0];
    const healthSum =
      report.results.physicalComponentHealth.commonPhysicalHealth +
      report.results.mentalComponentHealth.commonMentalHealth;

    labels.push(date);
    data.push(healthSum);
  });

  // Конфигурация для графика
  const chartConfig = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Сумма здоровья",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Изменение суммы здоровья с течением времени",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Дата",
          },
        },
        y: {
          title: {
            display: true,
            text: "Сумма здоровья",
          },
        },
      },
    },
  };

  // Генерируем URL для графика с помощью QuickChart
  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

  try {
    // В этом случае запрос не нужен, просто возвращаем URL
    console.log("Ссылка на график:", chartUrl);
    return chartUrl; // Возвращаем ссылку на график
  } catch (error) {
    console.error("Ошибка при генерации графика:", error);
  }
}
