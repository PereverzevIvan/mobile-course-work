import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Toast from "react-native-toast-message";
import { ResultsContextProvider } from "@/context/results.context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={25} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ResultsContextProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white", // Цвет активного текста
          tabBarInactiveTintColor: "darkgray", // Цвет неактивного текста
          tabBarStyle: styles.tabBarStyle,
          tabBarIconStyle: styles.tabBarIconStyle,
          // tabBarActiveBackgroundColor: "#272829", // Фон активной вкладки
          // tabBarInactiveBackgroundColor: "black", // Фон неактивных вкладок
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "О приложении",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={30} name="home" color={color} />
            ),
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}
        />
        <Tabs.Screen
          name="questionList"
          options={{
            title: "Тест",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={22} name="calculator" color={color} />
            ),
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}
        />
        <Tabs.Screen
          name="results"
          options={{
            title: "Результаты",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="bar-chart-o" color={color} />
            ),
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}
        />
      </Tabs>
      <Toast />
    </ResultsContextProvider>
  );
}

const styles = {
  tabBarStyle: {
    backgroundColor: "black", // Фон таб-бара
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: 70,
  },
  tabBarLabelStyle: {
    fontSize: 14, // Размер текста
  },
  tabBarItemStyle: { alignSelf: "center" },
  tabBarIconStyle: { marginBottom: 5 },
};
