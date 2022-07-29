import {ReactInstance, Surface} from 'react-360-web';
import { Euler } from 'three';
import HLSVideoPlayer from "./HLSVideoPlayer";
import MouseZoomPanCameraController from "./MouseZoomPanCameraController";

function rotateByQuaternion(v: Vec3, q: Quaternion) {
  // Optimized implementation of Hamiltonian product, similar to Unity's
  // internal implementation
  const qx = q[0];
  const qy = q[1];
  const qz = q[2];
  const qw = q[3];
  const vx = v[0];
  const vy = v[1];
  const vz = v[2];
  const qx2 = qx + qx;
  const qy2 = qy + qy;
  const qz2 = qz + qz;

  const xx2 = qx * qx2;
  const yy2 = qy * qy2;
  const zz2 = qz * qz2;
  const xy2 = qx * qy2;
  const xz2 = qx * qz2;
  const yz2 = qy * qz2;
  const wx2 = qw * qx2;
  const wy2 = qw * qy2;
  const wz2 = qw * qz2;

  v[0] = (1 - yy2 - zz2) * vx + (xy2 - wz2) * vy + (xz2 + wy2) * vz;
  v[1] = (xy2 + wz2) * vx + (1 - xx2 - zz2) * vy + (yz2 - wx2) * vz;
  v[2] = (xz2 - wy2) * vx + (yz2 + wx2) * vy + (1 - xx2 - yy2) * vz;
}

function init(bundle, parent, options = {}) {
  const horizontalPanel = new Surface(300, 300, Surface.SurfaceShape.Flat);
  const hvPanel = new Surface(300, 300, Surface.SurfaceShape.Flat);

  horizontalPanel.setAngle(0, -0.5);


  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    customVideoPlayers: [HLSVideoPlayer],
    frame: () => {
      const cameraQuat = r360.getCameraQuaternion();
      const cameraDirection = [0, 0, -1];

      // cameraDirection will point out from the view of the camera,
      // we can use it to compute surface angles
      rotateByQuaternion(cameraDirection, cameraQuat);
      const cx = cameraDirection[0];
      const cy = cameraDirection[1];
      const cz = cameraDirection[2];
      const horizAngle = Math.atan2(cx, -cz);
      const vertAngle = Math.asin(cy / Math.sqrt(cx * cx + cy * cy + cz * cz));
      horizontalPanel.setAngle(horizAngle, -0.5);
      hvPanel.setAngle(horizAngle, vertAngle);
      
      const DEFAULT_RADIUS = 4
      const RADIUS_SCALE = 225
      hvPanel.setRadius(DEFAULT_RADIUS * RADIUS_SCALE)
      const DEFAULT_DENSITY = 4680
      const DENSITY_SCALE = 1/2
      var d = 1 / DENSITY_SCALE * DEFAULT_DENSITY / (Math.abs(r360.getCameraPosition()[2]) / 16 / RADIUS_SCALE + 0.25) / 4
      // console.log(d)
      // horizontalPanel.setDensity(d, d)
      hvPanel.setDensity(d, d)
    },
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot("react_vr", {
      /* initial props */
    }),
    r360.getDefaultSurface()
  );

  r360.renderToSurface(r360.createRoot('HorizontalPanel'), horizontalPanel);
  r360.renderToSurface(r360.createRoot('HVPanel'), hvPanel);

  removeEventListener("resize", r360._onResize);

  r360.controls.clearCameraControllers();

  function zoom(deltaY: number, scale: number = 1) {
    if (
      (r360.getCameraPosition()[0] >= 1000 || r360.getCameraPosition()[1] >= 1000 || r360.getCameraPosition()[2] >= 1000 && deltaY >= 0) ||
      (r360.getCameraPosition()[0] <= -1000 || r360.getCameraPosition()[1] <= -1000 || r360.getCameraPosition()[2] <= -1000 && deltaY <= 0)
    ) {
      return;
    }

    const cameraDirection = [0, 0, -1];
    rotateByQuaternion(cameraDirection, r360.getCameraQuaternion());

    r360._cameraPosition = [
      r360.getCameraPosition()[0] - deltaY * cameraDirection[0] * scale,
      r360.getCameraPosition()[1] - deltaY * cameraDirection[1] * scale,
      r360.getCameraPosition()[2] - deltaY * cameraDirection[2] * scale,
    ];
  }

  function moveCameraPosition(deltaPitch: number, deltaYaw: number) {
    console.log(deltaPitch, deltaYaw)

    const cameraDirection = [1, 0, 0];
    rotateByQuaternion(cameraDirection, r360.getCameraQuaternion());

    const radius = Math.sqrt(r360.getCameraPosition()[0]**2 + r360.getCameraPosition()[1]**2 + r360.getCameraPosition()[2]**2)
    
    console.log(radius)
    
    const dx = -1 * deltaPitch * cameraDirection[0] * radius
    const dy = deltaYaw * cameraDirection[1] * radius
    const dz = -1 * deltaPitch * cameraDirection[2] * radius

    console.log(dx, dy, dz)

    r360._cameraPosition = [
      r360.getCameraPosition()[0] + dx,
      r360.getCameraPosition()[1] + dy,
      r360.getCameraPosition()[2] + dz,
    ];

    //
  }

  // fov decides how sensitive the mouse pan is
  const mouseZoomPanCameraController = new MouseZoomPanCameraController(
    r360._eventLayer,
    zoom,
    moveCameraPosition,
    Math.PI
  );
  r360.controls.addCameraController(mouseZoomPanCameraController);

  console.log(r360.controls);
  console.log(r360.getCameraPosition());

  // Load the initial environment
  // r360.compositor.setBackground(r360.getAssetURL('360_world.jpg'));
}

window.React360 = { init };
