import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TextInput } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import {
  play,
  pause,
  resume,
  playNext,
  selectAudio,
} from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      searchQuery: "",
      filteredAudioFiles: new DataProvider((r1, r2) => r1 !== r2),
    };
    this.currentItem = {};
  }

  // LayoutProvider para definir o layout dos itens da lista
  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  // Função para lidar com o clique no áudio
  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };

  // Carregar o áudio anterior
  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  componentDidMount() {
    this.context.loadPreviousAudio();
    this.setState({
      filteredAudioFiles: this.state.filteredAudioFiles.cloneWithRows(
        this.context.audioFiles
      ),
    });
  }

  // Função para lidar com a pesquisa
  handleSearch = (text) => {
    const filteredAudioFiles = this.context.audioFiles.filter((audio) =>
      audio.filename.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({
      searchQuery: text,
      filteredAudioFiles:
        this.state.filteredAudioFiles.cloneWithRows(filteredAudioFiles),
    });
  };

  // Função para renderizar cada item da lista
  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  // Navegar para a tela de PlayList
  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate("PlayList");
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ isPlaying, audioFiles }) => {
          if (!audioFiles.length) return null;
          return (
            <Screen>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={24} color="black" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Pesquisar..."
                  value={this.state.searchQuery}
                  onChangeText={this.handleSearch}
                />
              </View>
              <RecyclerListView
                dataProvider={this.state.filteredAudioFiles}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                options={[
                  { title: "Add à PlayList", onPress: this.navigateToPlaylist },
                ]}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default AudioList;
