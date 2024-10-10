import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import {
  play,
  pause,
  resume,
  playNext,
  selectAudio,
  changeAudio,
  moveAudio,
} from "../misc/audioController";
import { convertTime, storeAudioForNextOpening } from "../misc/helper";

// Obtendo a largura da janela do dispositivo
const { width } = Dimensions.get("window");

const Player = () => {
  // Estado para armazenar a posição atual do áudio
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;

  // Valor de rotação para animação
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Função para calcular a posição da barra de progresso
  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

  // Carregar o áudio anterior
  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  // Iniciar ou parar a animação de rotação com base no estado de reprodução
  useEffect(() => {
    if (context.isPlaying) {
      startImageRotateFunction();
    } else {
      rotateValue.stopAnimation();
    }
  }, [context.isPlaying]);

  // Função para iniciar a animação de rotação
  const startImageRotateFunction = () => {
    rotateValue.setValue(0);
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  // Função para lidar com o botão de play/pause
  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  // Função para avançar para a próxima música
  const handleNext = async () => {
    await changeAudio(context, "next");
  };

  // Função para voltar para a música anterior
  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  };

  // Função para renderizar o tempo atual do áudio
  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  if (!context.currentAudio) return null;
  return (
    <Screen name="Player">
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold", color: color.FONT_MEDIUM }}>
                  Música da PlayList:{" "}
                </Text>
                <Text style={{ color: color.FONT_MEDIUM }}>
                  {context.activePlayList.title}
                </Text>
              </>
            )}
          </View>

          <Text style={styles.audioCount}>{`${
            context.currentAudioIndex + 1
          } / ${context.totalAudioCount}`}</Text>
        </View>

        <View style={styles.midBannerContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <MaterialCommunityIcons
              name="music-circle"
              size={350}
              color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
            />
          </Animated.View>
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              color: color.FONT_MEDIUM,
            }}
          >
            <Text style={{ color: color.FONT_MEDIUM }}>
              {convertTime(context.currentAudio.duration)}
            </Text>
            <Text style={{ color: color.FONT_MEDIUM }}>
              {currentPosition ? currentPosition : renderCurrentTime()}
            </Text>
          </View>

          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;

              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("Erro dentro da chamada onSlidingStart", error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />

          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            />
            <PlayerButton iconType="NEXT" onPress={handleNext} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

// Estilos para o componente
const styles = StyleSheet.create({
  audioControllers: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 20,
    color: color.ACTIVE_BG,
    padding: 15,
  },
});

export default Player;
