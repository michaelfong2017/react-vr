import { ReactInstance } from "react-360-web";
import HLSVideoPlayer from "./HLSVideoPlayer";
import MouseZoomPanCameraController from "./MouseZoomPanCameraController";

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    customVideoPlayers: [HLSVideoPlayer],
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot("react_vr", {
      /* initial props */
    }),
    r360.getDefaultSurface()
  );

  removeEventListener("resize", r360._onResize);

  r360.controls.clearCameraControllers();

  function incrementCameraPosition(z: number, scale: number = 1) {
    if (
      (r360.getCameraPosition()[2] >= 1000 && z >= 0) ||
      (r360.getCameraPosition()[2] <= -1000 && z <= 0)
    ) {
      return;
    }
    r360._cameraPosition = [
      r360.getCameraPosition()[0],
      r360.getCameraPosition()[1],
      r360.getCameraPosition()[2] + z * scale,
    ];
  }

  // fov decides how sensitive the mouse pan is
  const mouseZoomPanCameraController = new MouseZoomPanCameraController(
    r360._eventLayer,
    incrementCameraPosition,
    Math.PI
  );
  r360.controls.addCameraController(mouseZoomPanCameraController);

  console.log(r360.controls);
  console.log(r360.getCameraPosition());

  // Load the initial environment
  // r360.compositor.setBackground(r360.getAssetURL('360_world.jpg'));
}

window.React360 = { init };
