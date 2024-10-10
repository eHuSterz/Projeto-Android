import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PlayListDetail from "../screens/PlayListDetail";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator para telas da PlayList
const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlayList" component={PlayList} />
      <Stack.Screen name="PlayListDetail" component={PlayListDetail} />
    </Stack.Navigator>
  );
};

// Navegação principal do aplicativo
const AppNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Definindo ícones para cada aba
          if (route.name === "AudioList") {
            iconName = "headset";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Player") {
            iconName = "compact-disc";
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          } else if (route.name === "PlayListScreen") {
            iconName = "library-music";
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }
        },
        //Definindo cores para a barra onde ficam os ícones de tela
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
        },
      })}
    >
      //Retirando a barra do topo
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="PlayListScreen"
        component={PlayListScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;
