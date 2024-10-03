import React, { Component, createContext } from "react";
import { View, Text, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
    };
  }

  permissionAlert = () => {
    Alert.alert(
      "Permissão Requerida",
      "Essa aplicação precisa de acesso aos aquivos de áudio!",
      [
        { text: "Conceder", onPress: () => this.getPermission() },
        { text: "Cancelar", onPress: () => this.permissionAlert() },
      ]
    );
  };

  getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.setState({ ...this.state, audioFiles: media.assets });
  };

  getPermission = async () => {
    // {"accessPrivileges": "none",
    //  "canAskAgain": true,
    // "expires": "never",
    // "granted": false,
    // "status": "undetermined"}
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      //  será transmitido para o app todos os arquivos de audio
      this.getAudioFiles();
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        //  será transmitido um display dizendo que o usuário precisa conceder permissão para que app funcione como planejado
        this.permissionAlert();
      }

      if (status === "granted") {
        //  será transmitido para o app todos os arquivos de audio
        this.getAudioFiles();
      }

      if (status === "denied" && !canAskAgain) {
        //  será transmitido um erro ao usuário
      }
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  render() {
    return (
      <AudioContext.Provider value={{ audioFiles: this.state.audioFiles }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
