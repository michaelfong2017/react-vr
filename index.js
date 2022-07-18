import React from 'react';
import {
  AppRegistry,
  View,
  StyleSheet,
  asset,
} from 'react-360';
import VideoModule from 'VideoModule';
import * as Environment from 'Environment';

const VIDEO_PLAYER = 'hls_video';
const VIDEO_SOURCE =[
  // {
  //   url: asset('video_dash_mp4/video_stream.mpd').uri, 
  //   fileFormat: 'mp4',
  // },
  // {
  //   url: asset('video_dash_webm/video_stream.mpd').uri, 
  //   fileFormat: 'webm',
  // },
  {
    // url: 'https://api.robocore.ai/stream/stream/llhls.m3u8', 
    url: 'http://localhost:3333/stream/llhls.m3u8', 
    fileFormat: 'webm',
  }
];

class react_vr extends React.Component {
  componentDidMount() {
    VideoModule.createPlayer(VIDEO_PLAYER);
    VideoModule.play(VIDEO_PLAYER, {
      source: VIDEO_SOURCE,
      stereo: '2D',
    });

    Environment.setBackgroundVideo(VIDEO_PLAYER);
  }

  render() {
    return null;
  }
}

AppRegistry.registerComponent('react_vr', () => react_vr);