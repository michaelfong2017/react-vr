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

const mediaPlayerState = new MediaPlayerState({
  autoPlay: true,
});
mediaPlayerState.playStatus = "playing"

class react_vr extends React.Component {
  componentDidMount() {
    const player = VideoModule.createPlayer(VIDEO_PLAYER);

    player.addListener("onVideoStatusChanged", (event: VideoStatusEvent) => {
      // console.log("duration: " + event.duration);
      // console.log("isBuffering: " + event.isBuffering);
      // console.log("position: " + event.position);

      // console.log(mediaPlayerState);

      /** Update CustomVideoControl UI (slide bar) */
      mediaPlayerState.duration = event.duration;
      mediaPlayerState.emit('durationChange', event.duration);
      mediaPlayerState.currentTime = event.position;
      mediaPlayerState.emit('timeUpdate', event.position);
      /** Update CustomVideoControl UI (slide bar) END */
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

const HVPanel = () => {
  return (
    <View style={styles.panel}>
      <CustomVideoControl playerState={mediaPlayerState} />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    width: 450,
    height: 50,
    bottom: 0,
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
AppRegistry.registerComponent("HVPanel", () => HVPanel);
