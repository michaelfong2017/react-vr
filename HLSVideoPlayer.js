import { BrowserVideoPlayer } from "react-360-web";
import Hls from "hls.js";

export default class HLSVideoPlayer extends BrowserVideoPlayer {
  constructor() {
    super();
    const hls = new Hls();
    this.player = hls;
  }

  setSource(src, stereoFormat, fileFormat) {
    super.setSource(src, stereoFormat, fileFormat);
    this.player.loadSource(src);
    this.player.attachMedia(this._element);
    this.player.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log("video and hls.js are now bound together !");
    });
    this.player.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      console.log(
        "manifest loaded, found " + data.levels.length + " quality level"
      );
    });
  }

  destroy() {
    this.player.destroy();
    super.dispose();
  }
}
