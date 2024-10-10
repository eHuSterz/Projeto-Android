import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para armazenar o áudio para a próxima abertura do aplicativo
export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
  await AsyncStorage.setItem(
    "previousAudio",
    JSON.stringify({ audio: { ...audio, lastPosition }, index })
  );
};

// Função para converter o tempo de minutos para o formato mm:ss
export const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60; // Converte minutos para horas
    const minute = hrs.toString().split(".")[0]; // Obtém a parte inteira das horas
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2)); // Obtém os primeiros dois dígitos da parte decimal
    const sec = Math.ceil((60 * percent) / 100); // Converte a parte decimal para segundos

    // Formata o tempo para mm:ss
    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (sec == 60) {
      return `${minute + 1}:00`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};
