import React from "react";
import {
  AppRegistry,
  View,
  StyleSheet,
  asset,
  Text,
  VrButton,
} from "react-360";
import VideoModule from "VideoModule";
import * as Environment from "Environment";

const VIDEO_PLAYER = "hls_video";
const VIDEO_SOURCE = [
  // {
  //   url: asset('video_dash_mp4/video_stream.mpd').uri,
  //   fileFormat: 'mp4',
  // },
  // {
  //   url: asset('video_dash_webm/video_stream.mpd').uri,
  //   fileFormat: 'webm',
  // },
  {
    url: "https://api.robocore.ai/stream/stream/llhls.m3u8",
    fileFormat: "webm",
  },
];

class react_vr extends React.Component {
  componentDidMount() {
    window.player360 = VideoModule.createPlayer(VIDEO_PLAYER);
    console.log("yoooooooooooooooooooooooooooooooooooooooooo\n\n\n");
    console.log(window.player360);
    VideoModule.play(VIDEO_PLAYER, {
      source: VIDEO_SOURCE,
      stereo: "2D",
    });

    Environment.setBackgroundVideo(VIDEO_PLAYER);
  }

  render() {
    return null;
  }
}

const _pressed = () => {
  console.log(window.player360);
  window.player360.pause();
};

const HorizontalPanel = () => (
  <View style={styles.panel}>
    <VrButton onClick={_pressed} style={styles.greetingBox}>
      <Text style={styles.panelText}>{"Follows Horizontally"}</Text>
    </VrButton>
  </View>
);

const HVPanel = () => (
  <View style={styles.panel}>
    <VrButton onClick={_pressed} style={styles.greetingBox}>
      <Text style={styles.panelText}>
        {"Follows Horizontally\nand Vertically"}
      </Text>
    </VrButton>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  panelText: {
    color: "#000000",
    fontSize: 30,
    textAlign: "center",
  },
});

AppRegistry.registerComponent("react_vr", () => react_vr);
AppRegistry.registerComponent("HorizontalPanel", () => HorizontalPanel);
AppRegistry.registerComponent("HVPanel", () => HVPanel);
