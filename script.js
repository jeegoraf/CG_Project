"use strict";
import { parseOBJ, objFragShader, objVertShader} from "./parse.js";
export var gl;



// некоторые операции над матрицами 
// var m4 = {

//     projection: function(width, height, depth) {
//       // Note: This matrix flips the Y axis so 0 is at the top.
//       return [
//          2 / width, 0, 0, 0,
//          0, -2 / height, 0, 0,
//          0, 0, 2 / depth, 0,
//         -1, 1, 0, 1,
//       ];
//     },
  
//     multiply: function(a, b) {
//       var a00 = a[0 * 4 + 0];
//       var a01 = a[0 * 4 + 1];
//       var a02 = a[0 * 4 + 2];
//       var a03 = a[0 * 4 + 3];
//       var a10 = a[1 * 4 + 0];
//       var a11 = a[1 * 4 + 1];
//       var a12 = a[1 * 4 + 2];
//       var a13 = a[1 * 4 + 3];
//       var a20 = a[2 * 4 + 0];
//       var a21 = a[2 * 4 + 1];
//       var a22 = a[2 * 4 + 2];
//       var a23 = a[2 * 4 + 3];
//       var a30 = a[3 * 4 + 0];
//       var a31 = a[3 * 4 + 1];
//       var a32 = a[3 * 4 + 2];
//       var a33 = a[3 * 4 + 3];
//       var b00 = b[0 * 4 + 0];
//       var b01 = b[0 * 4 + 1];
//       var b02 = b[0 * 4 + 2];
//       var b03 = b[0 * 4 + 3];
//       var b10 = b[1 * 4 + 0];
//       var b11 = b[1 * 4 + 1];
//       var b12 = b[1 * 4 + 2];
//       var b13 = b[1 * 4 + 3];
//       var b20 = b[2 * 4 + 0];
//       var b21 = b[2 * 4 + 1];
//       var b22 = b[2 * 4 + 2];
//       var b23 = b[2 * 4 + 3];
//       var b30 = b[3 * 4 + 0];
//       var b31 = b[3 * 4 + 1];
//       var b32 = b[3 * 4 + 2];
//       var b33 = b[3 * 4 + 3];
//       return [
//         b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
//         b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
//         b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
//         b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
//         b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
//         b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
//         b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
//         b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
//         b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
//         b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
//         b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
//         b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
//         b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
//         b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
//         b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
//         b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
//       ];
//     },
  
//     translation: function(tx, ty, tz) {
//       return [
//          1,  0,  0,  0,
//          0,  1,  0,  0,
//          0,  0,  1,  0,
//          tx, ty, tz, 1,
//       ];
//     },
  
//     xRotation: function(angleInRadians) {
//       var c = Math.cos(angleInRadians);
//       var s = Math.sin(angleInRadians);
  
//       return [
//         1, 0, 0, 0,
//         0, c, s, 0,
//         0, -s, c, 0,
//         0, 0, 0, 1,
//       ];
//     },
  
//     yRotation: function(angleInRadians) {
//       var c = Math.cos(angleInRadians);
//       var s = Math.sin(angleInRadians);
  
//       return [
//         c, 0, -s, 0,
//         0, 1, 0, 0,
//         s, 0, c, 0,
//         0, 0, 0, 1,
//       ];
//     },
  
//     zRotation: function(angleInRadians) {
//       var c = Math.cos(angleInRadians);
//       var s = Math.sin(angleInRadians);
  
//       return [
//          c, s, 0, 0,
//         -s, c, 0, 0,
//          0, 0, 1, 0,
//          0, 0, 0, 1,
//       ];
//     },
  
//     scaling: function(sx, sy, sz) {
//       return [
//         sx, 0,  0,  0,
//         0, sy,  0,  0,
//         0,  0, sz,  0,
//         0,  0,  0,  1,
//       ];
//     },
  
//     translate: function(m, tx, ty, tz) {
//       return m4.multiply(m, m4.translation(tx, ty, tz));
//     },
  
//     xRotate: function(m, angleInRadians) {
//       return m4.multiply(m, m4.xRotation(angleInRadians));
//     },
  
//     yRotate: function(m, angleInRadians) {
//       return m4.multiply(m, m4.yRotation(angleInRadians));
//     },
  
//     zRotate: function(m, angleInRadians) {
//       return m4.multiply(m, m4.zRotation(angleInRadians));
//     },
  
//     scale: function(m, sx, sy, sz) {
//       return m4.multiply(m, m4.scaling(sx, sy, sz));
//     },
  
// };

// шейдеры для площади
// ИСПРАВИТЬ НА ЗАГРУЗКУ ШЕЙДЕРА ИЗ ФАЙЛА!! 
const squareVertShader = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`

const squareFragShader = `
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`
// инициализация WebGL
function initWebGL(canvas) {
    gl = null;
  
    try {
      // Попытаться получить стандартный контекст. Если не получится, попробовать получить экспериментальный.
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
  
    // Если мы не получили контекст GL, завершить работу
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
  
    return gl;
  }


// получение контекста и первичная настройка WebGL
function start() {
  var canvas = document.getElementById("glcanvas");

  gl = initWebGL(canvas);      // инициализация контекста GL
  
  // продолжать только если WebGL доступен и работает

  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
    gl.enable(gl.DEPTH_TEST);                               // включает использование буфера глубины
    gl.depthFunc(gl.LEQUAL);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
    console.log("hsdkfhshfusdfhiso")
  }
}

// возвращает программу шейдеров
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// возвращает шейдер (вспомогательная функция для initShaderProgram())
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// инициализация буферов для площади
function initBuffers(gl) {

    // Создаем буфер для позиций квадрата.
  
    const positionBuffer = gl.createBuffer();
  
    // Выбираем positionBuffer в качестве буфера для применения
    // операции, чтобы отсюда выйти.
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Теперь создаем массив позиций для квадрата.
  
    const positions = [
      -50.0,  50.0,
       50.0,  50.0,
      -50.0, -50.0,
       50.0, -50.0,
    ];
  
    // Теперь передаем список позиций в WebGL для построения
    // форма. Мы делаем это, создавая Float32Array из
    // Массив JavaScript, затем используйте его для заполнения текущего буфера.
  
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(positions),
                  gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
    };
}

// рисуем площадь 
function drawSquare(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // От прозрачного до черного, полностью непрозрачный
    gl.clearDepth(1.0);                 // Очистить все
    gl.enable(gl.DEPTH_TEST);           // Включить проверку глубины
    gl.depthFunc(gl.LEQUAL);            // Ближайшие предметы затемняют далекие
  
    // Очищаем холст перед тем, как начать рисовать на нем.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Создаем перспективную матрицу, специальную матрицу, которая
    // используется для имитации искажения перспективы в камере.
    // Наше поле зрения 45 градусов, ширина / высота
    // соотношение, соответствующее отображаемому размеру холста
    // и мы хотим видеть только объекты между 0,1 единицей
    // и на расстоянии 100 единиц от камеры.
  
    const fieldOfView = 45 * Math.PI / 180;   // в радианах
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
  
    // примечание: glmatrix.js всегда имеет первый аргумент
    // как место назначения для получения результата.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);

    mat4.translate(projectionMatrix, projectionMatrix, [-0.0, -30.0, -150.0])
    mat4.rotate(projectionMatrix, projectionMatrix, -Math.PI/4, [0, 1, 0])
    mat4.rotate(projectionMatrix, projectionMatrix, -Math.PI/6, [0, 0, 0])

  
    // Устанавливаем позицию рисования в точку "идентичности", которая
    // центр сцены.
    const modelViewMatrix = mat4.create();
  
    // Теперь немного переместим позицию рисования туда, где мы хотим
    // начинаем рисовать квадрат.
  
    mat4.translate(modelViewMatrix,     // матрица назначения
                   modelViewMatrix,     // матрица для перевода
                   [-0.0, 0.0, -0.0]);  // сумма для перевода
  

    
    // Повернем квадрат

    mat4.rotate(modelViewMatrix, 
        modelViewMatrix,
        -Math.PI/2,
        [1.0, 0.0, 0.0]);

    // Сообщаем WebGL, как вытаскивать позиции из позиции
    // буфер в атрибут vertexPosition.
    {
      const numComponents = 2;  // вытаскиваем 2 значения за итерацию
      const type = gl.FLOAT;    // данные в буфере 32-битные с плавающей запятой
      const normalize = false;  // не нормализовать
      const stride = 0;         // сколько байтов получить от одного набора значений до следующего
                                // 0 = использовать тип и numComponents выше
      const offset = 0;         // сколько байтов в буфере начинать с
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    // Сообщаем WebGL использовать нашу программу при рисовании
  
    gl.useProgram(programInfo.program);
  
    // Устанавливаем форму шейдера
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
  
    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

    
}


const cameraTarget = [0, 0, 0];
const cameraPosition = [0, 0, 10];
const zNear = 0.1;
const zFar = 1000.0;



async function main() {

  start();

// шейдерная программа для площади
const squareShaderProgram = initShaderProgram(gl, squareVertShader, squareFragShader); 

// хранилище данных о шейдерах площади
const squareProgramInfo = {
    program: squareShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(squareShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(squareShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(squareShaderProgram, 'uModelViewMatrix'),
    },
};



const response = await fetch('https://webglfundamentals.org/webgl/resources/models/cube/cube.obj');  
const text = await response.text();
const data = parseOBJ(text);

const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);

const meshProgramInfo = webglUtils.createProgramInfo(gl, [objVertShader, objFragShader]);

function renderOBJ(time) {
  time *= 0.001;  // convert to seconds

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  const fieldOfViewRadians = degToRad(60);
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  const up = [0, 1, 0];
  // Compute the camera's matrix using look at.
  const camera = m4.lookAt(cameraPosition, cameraTarget, up);

  // Make a view matrix from the camera matrix.
  const view = m4.inverse(camera);
  console.log(view);
  mat4.translate(view, view, [0,-3,0]);
  console.log(view);

  const sharedUniforms = {
    u_lightDirection: m4.normalize([-1, 3, 5]),
    // u_view: m4.getTranslation(view, [-1,0,0]),
    u_view: view,
    u_projection: projection,
  };

  gl.useProgram(meshProgramInfo.program);

  // calls gl.uniform
  webglUtils.setUniforms(meshProgramInfo, sharedUniforms);

  // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
  webglUtils.setBuffersAndAttributes(gl, meshProgramInfo, bufferInfo);

  // calls gl.uniform
  webglUtils.setUniforms(meshProgramInfo, {
    u_world: m4.yRotation(2),
    u_diffuse: [1, 0.7, 0.5, 1],
  });
  webglUtils.drawBufferInfo(gl, bufferInfo);

  //requestAnimationFrame(renderOBJ);
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}



requestAnimationFrame(renderOBJ);
drawSquare(gl, squareProgramInfo, initBuffers(gl))
}

main();






