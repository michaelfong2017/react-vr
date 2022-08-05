import React from "react";
import {
  AppRegistry,
  View,
  StyleSheet,
  asset,
  Text,
  VrButton,
  MediaPlayerState,
} from "react-360";
import VideoModule from "VideoModule";
import * as Environment from "Environment";
import CustomVideoControl from "./CustomVideoControl";

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

const mediaplayerstate = new MediaPlayerState({
  autoPlay: true,
});
mediaplayerstate.playStatus = "playing"

class react_vr extends React.Component {
  componentDidMount() {
    const player = VideoModule.createPlayer(VIDEO_PLAYER);

    player.addListener("onVideoStatusChanged", (event: VideoStatusEvent) => {
      // console.log("duration: " + event.duration);
      // console.log("isBuffering: " + event.isBuffering);
      // console.log("position: " + event.position);

      console.log(mediaplayerstate);

      mediaplayerstate.duration = event.duration;
      mediaplayerstate.emit('durationChange', event.duration);
      mediaplayerstate.currentTime = event.position;
      mediaplayerstate.emit('timeUpdate', event.position);
    });

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
  console.log(VideoModule.getPlayer(VIDEO_PLAYER));
  const player = VideoModule.getPlayer(VIDEO_PLAYER);

  mediaplayerstate.play();

  player.seek(10);
};

const HorizontalPanel = () => (
  <View style={styles.panel}>
    <VrButton onClick={_pressed} style={styles.greetingBox}>
      <Text style={styles.panelText}>{"Follows Horizontally"}</Text>
    </VrButton>
  </View>
);

const HVPanel = () => {
  return (
    <View style={styles.panel}>
      <CustomVideoControl playerState={mediaplayerstate} />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    width: 900,
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
