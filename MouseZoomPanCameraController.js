import { type Quaternion, type Vec3 } from "react-360-web/js/Controls/Types";
import { type CameraController } from "react-360-web/js/Controls/CameraControllers/Types";

const DEFAULT_FOV = Math.PI / 6;
const HALF_PI = Math.PI / 2;

export default class MouseZoomPanCameraController implements CameraController {
  _deltaYaw: number;
  _deltaPitch: number;
  _draggingMouse: boolean;
  _draggingTouch: boolean;
  _enabled: boolean;
  _frame: HTMLElement;
  _lastMouseX: number;
  _lastMouseY: number;
  _lastTouchX: number;
  _lastTouchY: number;
  _verticalFov: number;

  constructor(
    frame: HTMLElement,
    zoom: Function,
    moveCameraPosition: Function,
    fov: number = DEFAULT_FOV
  ) {
    this._deltaYaw = 0;
    this._deltaPitch = 0;
    this._draggingMouse = false;
    this._draggingTouch = false;
    this._enabled = true;
    this._frame = frame;
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._lastTouchX = 0;
    this._lastTouchY = 0;
    this._verticalFov = fov;
    this._zoom = zoom;
    this._moveCameraPosition = moveCameraPosition;

    (this: any)._onWheel = this._onWheel.bind(this);
    (this: any)._onMouseDown = this._onMouseDown.bind(this);
    (this: any)._onMouseMove = this._onMouseMove.bind(this);
    (this: any)._onMouseUp = this._onMouseUp.bind(this);
    (this: any)._onTouchStart = this._onTouchStart.bind(this);
    (this: any)._onTouchMove = this._onTouchMove.bind(this);
    (this: any)._onTouchEnd = this._onTouchEnd.bind(this);
    this._frame.addEventListener("wheel", this._onWheel);
    this._frame.addEventListener("mousedown", this._onMouseDown);
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
    this._frame.addEventListener("touchstart", this._onTouchStart);
    this._frame.addEventListener("touchmove", this._onTouchMove);
    this._frame.addEventListener("touchcancel", this._onTouchEnd);
    this._frame.addEventListener("touchend", this._onTouchEnd);
  }

  _onWheel(e: WheelEvent) {
    if (!this._enabled) {
      return;
    }
    this._zoom(e.deltaY);
    e.preventDefault();
  }

  _onMouseDown(e: MouseEvent) {
    if (!this._enabled) {
      return;
    }
    this._draggingMouse = true;
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
  }

  _onMouseMove(e: MouseEvent) {
    if (!this._draggingMouse) {
      return;
    }
    const width = this._frame.clientWidth;
    const height = this._frame.clientHeight;
    const aspect = width / height;
    const deltaX = e.clientX - this._lastMouseX;
    const deltaY = e.clientY - this._lastMouseY;
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;

    var deltaPitch = this._deltaPitch;
    var deltaYaw = this._deltaYaw;

    deltaPitch += (deltaX / width) * this._verticalFov * aspect;
    deltaYaw += (deltaY / height) * this._verticalFov;
    deltaYaw = Math.max(-HALF_PI, Math.min(HALF_PI, deltaYaw));

    const deltaDeltaPitch = deltaPitch - this._deltaPitch;
    const deltaDeltaYaw = deltaYaw - this._deltaYaw;

    const N = 20;
    for (let i = 0; i < N; i++) {
      this._moveCameraPosition(deltaPitch / N, deltaYaw / N);

      this._deltaPitch += deltaDeltaPitch / N;
      this._deltaYaw += deltaDeltaYaw / N;
    }
  }

  _onMouseUp() {
    this._draggingMouse = false;
  }

  _onTouchStart(e: TouchEvent) {
    if (!this._enabled) {
      return;
    }
    this._draggingTouch = true;
    this._lastTouchX = e.changedTouches[0].clientX;
    this._lastTouchY = e.changedTouches[0].clientY;
  }

  _onTouchMove(e: TouchEvent) {
    if (!this._draggingTouch) {
      return;
    }
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    const width = this._frame.clientWidth;
    const height = this._frame.clientHeight;
    const aspect = width / height;
    const deltaX = x - this._lastTouchX;
    const deltaY = y - this._lastTouchY;
    this._lastTouchX = x;
    this._lastTouchY = y;

    var deltaPitch = this._deltaPitch;
    var deltaYaw = this._deltaYaw;

    deltaPitch += (deltaX / width) * this._verticalFov * aspect;
    deltaYaw += (deltaY / height) * this._verticalFov;
    deltaYaw = Math.max(-HALF_PI, Math.min(HALF_PI, deltaYaw));

    this._moveCameraPosition(deltaPitch, deltaYaw);

    this._deltaPitch = deltaPitch;
    this._deltaYaw = deltaYaw;
  }

  _onTouchEnd(e: TouchEvent) {
    this._draggingTouch = false;
  }

  enable() {
    this._enabled = true;
    this._draggingMouse = false;
    this._draggingTouch = false;
  }

  disable() {
    this._enabled = false;
    this._draggingMouse = false;
    this._draggingTouch = false;
  }

  fillCameraProperties(position: Vec3, rotation: Quaternion): boolean {
    if (!this._enabled) {
      return false;
    }

    if (this._deltaPitch === 0 && this._deltaYaw === 0) {
      return false;
    }

    // premultiply the camera rotation by the horizontal (pitch) rotation,
    // then multiply by the vertical (yaw) rotation

    const cp = Math.cos(this._deltaPitch / 2);
    const sp = Math.sin(this._deltaPitch / 2);
    const cy = Math.cos(this._deltaYaw / 2);
    const sy = Math.sin(this._deltaYaw / 2);

    const x1 = rotation[0];
    const y1 = rotation[1];
    const z1 = rotation[2];
    const w1 = rotation[3];

    const x2 = cp * x1 + sp * z1;
    const y2 = cp * y1 + sp * w1;
    const z2 = cp * z1 - sp * x1;
    const w2 = cp * w1 - sp * y1;

    const x3 = w2 * sy + x2 * cy;
    const y3 = y2 * cy + z2 * sy;
    const z3 = -y2 * sy + z2 * cy;
    const w3 = w2 * cy - x2 * sy;

    rotation[0] = x3;
    rotation[1] = y3;
    rotation[2] = z3;
    rotation[3] = w3;

    this._deltaPitch = 0;
    this._deltaYaw = 0;
    return true;
  }
}
