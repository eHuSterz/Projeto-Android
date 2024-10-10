import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigation from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import color from "./app/misc/color";

// Tema customizado para o App
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

// Componente principal do App
export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigation />
      </NavigationContainer>
    </AudioProvider>
  );
}
