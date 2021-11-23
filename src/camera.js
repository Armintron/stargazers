import { Vector3 } from 'three';
import { m4 } from 'twgl.js';
import { deg2rad } from './utils/math';

class Camera {
  /**
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  constructor(fov, aspect, near, far) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.position = new Vector3(0, 0, 1);
    this.lookAtTarget = new Vector3(0, 0, 0);

    this.cameraMatrix = m4.lookAt(this.position.toArray(), this.lookAtTarget.toArray(), [0, 1, 0]);
    this.viewMatrix = m4.inverse(this.cameraMatrix);
    this.projectionMatrix = m4.perspective(deg2rad(fov), aspect, near, far);

    window.addEventListener('resize', () => {
      this.setAspect(window.innerWidth / window.innerHeight);
    });
  }

  /**
   * @param {{ x: number, y: number, z: number }} lookAt
   */
  lookAt(lookAt) {
    this.lookAtTarget.set(lookAt.x, lookAt.y, lookAt.z);
    this.updateViewMatrix();
  }

  /**
   * @param {number} aspect
   */
  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }

  /**
   * @param {{ x: number, y: number, z: number }} position
   */
  setPosition(position) {
    this.position.set(position.x, position.y, position.z);

    this.updateViewMatrix();
  }

  updateViewMatrix() {
    this.cameraMatrix = m4.lookAt(this.position.toArray(), this.lookAtTarget.toArray(), [0, 1, 0]);
    this.viewMatrix = m4.inverse(this.cameraMatrix);
  }

  updateProjectionMatrix() {
    this.projectionMatrix = m4.perspective(deg2rad(this.fov), this.aspect, this.near, this.far);
  }

  getUniforms() {
    return {
      viewMatrix: this.viewMatrix,
      projectionMatrix: this.projectionMatrix
    };
  }
}

export default Camera;