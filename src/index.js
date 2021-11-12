import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import Model from './model';
import { gl } from './constants';

const m4 = twgl.m4;

const main = async () => {
  // const canvas = document.querySelector('canvas');
  // const gl = canvas.getContext('webgl2');
  const programInfo = twgl.createProgramInfo(gl, [vs, fs], error =>
    console.log(error)
  );

  // object containing what keys are down for a animation frame
  const keyDown = {};

  document.body.addEventListener('keydown', e => {
    keyDown[e.code] = true;
  });

  document.body.addEventListener('keyup', e => {
    keyDown[e.code] = false;
  });

  // // init gl stuff here, like back face culling and the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.5, 0.2, 0.7, 1.0);

  // track when the last frame rendered
  let lastFrameMilis = 0;

  const model = new Model();
  await model.load(require('./models/raymanModel.obj'));

  const modelExtents = model.getModelExtent();

  const eye = m4.transformPoint(
    m4.multiply(
      m4.translation(modelExtents.center),
      m4.multiply(m4.rotationY(0), m4.rotationX(0))
    ),
    [0, 0, modelExtents.dia]
  );

  const cameraMatrix = m4.lookAt(eye, modelExtents.center, [0, 1, 0]);
  const viewMatrix = m4.inverse(cameraMatrix);
  const projectionMatrix = m4.perspective(
    (75 * Math.PI) / 180,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  const uniforms = {
    viewMatrix,
    projectionMatrix
  };

  // create looper function
  function frame(curentMilis) {
    // calculate the change in time in seconds since the last frame
    let deltaTime = (curentMilis - lastFrameMilis) / 1000;

    // update things here
    update(deltaTime);

    // clear the previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // do the render
    render(deltaTime);

    // request the next frame
    rafHandle = requestAnimationFrame(frame);

    // update the last frame milis
    lastFrameMilis = curentMilis;
  }

  function update(deltaTime) {
    // console.log(keyDown);
  }

  function render(deltaTime) {
    model.addRotation({ y: deltaTime * 60 });

    model.render(programInfo, uniforms);
  }

  window.addEventListener('resize', () => {
    uniforms.projectionMatrix = m4.perspective(
      (75 * Math.PI) / 180,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
  });

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // start the render loop by requesting an animation frame for the frame function
  let rafHandle = requestAnimationFrame(frame);
};

main();
