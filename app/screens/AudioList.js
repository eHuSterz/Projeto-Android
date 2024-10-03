import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { AudioContext } from "../context/AudioProvider";

export class AudioList extends Component {
  static contextType = AudioContext;
  render() {
    return (
      <ScrollView>
        {this.context.audioFiles.map((item) => (
          <Text key={item.id}>{item.filename}</Text>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioList;
