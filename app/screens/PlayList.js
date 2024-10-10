import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import color from "../misc/color";
import PlayListInputModal from "../components/PlayListInputModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";
import PlayListDetail from "../components/PlayListDetail";

// Variável para armazenar a playlist selecionada
let selectedPlayList = {};
const PlayList = ({ navigation }) => {
  // Controle de visibilidade do modal e da lista de reprodução
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  // Função para criar uma nova playlist
  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  // Função para renderizar a lista de reprodução
  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "Meu Favorito",
        audios: [],
      };

      const newPlayList = [...playList, defaultPlayList];
      updateState(context, {
        playList: [...newPlayList],
      });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }
    updateState(context, {
      playList: JSON.parse(result),
    });
  };

  // useEffect para carregar a lista de reprodução ao montar o componente
  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

  // Função para lidar com o clique no banner da playlist
  const handleBannerPress = async (playList) => {
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");

      let oldList = [];
      let updatedList = [];
      let sameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);

        updatedList = oldList.filter((list) => {
          if (list.id === playList.id) {
            // Será verificado se o áudio selecionado já está dentro de uma lista ou não
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                // Alerta comalguma mensagem
                sameAudio = true;
                return;
              }
            }
            // Caso contrário a playList será atualizada
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          "Foi encontrado o mesmo áudio!",
          `O áudio --> ${addToPlayList.filename} <-- já está dentro da PlayList.`
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }
      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }

    // Se não for selecionado nenhum áudio, a lista pode ser aberta
    selectedPlayList = playList;
    navigation.navigate("PlayListDetail", playList);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {playList.length
          ? playList.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.playListBanner}
                onPress={() => handleBannerPress(item)}
              >
                <Text style={styles.tituloModal}>{item.title}</Text>
                <Text style={styles.audioCount}>
                  {item.audios.length > 1
                    ? `${item.audios.length} Músicas`
                    : `${item.audios.length} Música`}
                </Text>
              </TouchableOpacity>
            ))
          : null}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.playListBtn}>+ Nova PlayList</Text>
        </TouchableOpacity>

        <PlayListInputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={createPlayList}
        />
      </ScrollView>
      <PlayListDetail
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
      />
    </>
  );
};

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: color.MODAL_LIST,
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
    color: color.FONT_MEDIUM,
  },
  playListBtn: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
  tituloModal: {
    color: color.FONT_MEDIUM,
    fontWeight: "bold",
  },
});

export default PlayList;
