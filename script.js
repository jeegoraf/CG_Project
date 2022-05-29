"use strict";
import { parseOBJ, objFragShader, objVertShader} from "./parse.js";
export var gl;

// шейдеры для площади
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
  
    const rawPositions = [
      -1.0,  1.0,
      1.0,  1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ];
    const squareSize = 100;
    let positions = rawPositions.map(pos => pos * squareSize);
  
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

// функция загрузки текстуры
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  // По умолчанию закрасим текстуру в синий
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  // А когда загрузится картинка, загрузим её в текстуру
  const image = new Image();
  image.onload = () => {
      handleTextureLoaded(gl, image, texture);
  };
  image.src = url;

  return texture;
}

function handleTextureLoaded(gl, image, texture) {
 
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function degToRad(deg) {
  return deg * Math.PI / 180;
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

function drawCar(gl, programInfo, bufferInfo){

  const meshProgramInfo = programInfo;

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);


  const fieldOfViewRadians = degToRad(60);
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  const up = [0, 1, 0];
  // Compute the camera's matrix using look at.
  const camera = m4.lookAt(cameraPosition, cameraTarget, up); //!!!!ЧЗХ

   // Make a view matrix from the camera matrix.
   const view = m4.inverse(camera);

   mat4.translate(view, view, translateVector);
   mat4.rotate(view,view, -1*Math.PI/2, [1,0,0]);
   mat4.rotate(view,view,  rotationValue, rotationAxis);


  gl.useProgram(meshProgramInfo.program);

  const sharedUniforms = {
    u_lightDirection: m4.normalize([-1, 3, 5]),
    // u_view: m4.getTranslation(view, [-1,0,0]),
    u_view: view,
    u_projection: projection,
  };
 

  // calls gl.uniform
  webglUtils.setUniforms(meshProgramInfo, sharedUniforms);

  // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
  webglUtils.setBuffersAndAttributes(gl, meshProgramInfo, bufferInfo);

  // calls gl.uniform
  webglUtils.setUniforms(meshProgramInfo, {
    u_world: m4.xRotation(0),
    u_diffuse: [0.3, 0.7, 0.5, 1],
  });
  webglUtils.drawBufferInfo(gl, bufferInfo);
}

function drawLantern(gl, programInfo, bufferInfo){

  const meshProgramInfoLantern = programInfo;
  const bufferInfoLantern = bufferInfo;

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  const fieldOfViewRadians = degToRad(60);
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  const up = [0, 1, 0];
  // Compute the camera's matrix using look at.
  const camera = m4.lookAt(cameraPosition, cameraTarget, up); //!!!!ЧЗХ

  const view = m4.inverse(camera);

  mat4.translate(view, view, [-5,-3,0]);
 
 
  const sharedUniforms = {
    u_lightDirection: m4.normalize([-1, 3, 5]),
    u_view: view,
    u_projection: projection,
  };


  gl.useProgram(meshProgramInfoLantern.program);

  // БЛОК ТЕКСТУР

  const tex = loadTexture(gl, document.getElementById("LanternTex").src)


  webglUtils.setUniforms(meshProgramInfoLantern, sharedUniforms);

  webglUtils.setBuffersAndAttributes(gl, meshProgramInfoLantern, bufferInfoLantern);

  webglUtils.setUniforms(meshProgramInfoLantern, {
    u_world: m4.xRotation(0),
    u_diffuse: [0.3, 0.7, 0.5, 1],
  });
  webglUtils.drawBufferInfo(gl, bufferInfoLantern);

}

function drawSign(gl, programInfo, bufferInfo){
  const meshProgramInfoSign = programInfo;
  const bufferInfoSign = bufferInfo;
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  const fieldOfViewRadians = degToRad(60);
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  const up = [0, 1, 0];
  // Compute the camera's matrix using look at.
  const camera = m4.lookAt(cameraPosition, cameraTarget, up); //!!!!ЧЗХ

  const view = m4.inverse(camera);

  mat4.translate(view, view, [0.5, -0.3, 9]);

 
  const sharedUniforms = {
    u_lightDirection: m4.normalize([-1, 3, 5]),
    u_view: view,
    u_projection: projection,
  };

  gl.useProgram(meshProgramInfoSign.program);

  webglUtils.setUniforms(meshProgramInfoSign, sharedUniforms);

  webglUtils.setBuffersAndAttributes(gl, meshProgramInfoSign, bufferInfoSign);

  webglUtils.setUniforms(meshProgramInfoSign, {
    u_world: m4.xRotation(0),
    u_diffuse: [0.3, 0.7, 0.5, 1],
  });
  webglUtils.drawBufferInfo(gl, bufferInfoSign);

}

const cameraTarget = [0, 0, 0];
const cameraPosition = [0, 0, 10];
const zNear = 0.1;
const zFar = 1000.0;



let translateVector = [0,-3,0];
let rotationAxis = [0, 0, 1];
let rotationValue = 0;
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


// получаем автомобиль!
const response = await fetch('./objects/auto.obj');  
const text = await response.text();
const data = parseOBJ(text, 500);
const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
const meshProgramInfo = webglUtils.createProgramInfo(gl, [objVertShader, objFragShader]);

// фонарь
const responseLantern = await fetch('./objects/lantern.obj');  
const textLantern = await responseLantern.text();
const dataLantern = parseOBJ(textLantern, 300);
const bufferInfoLantern = webglUtils.createBufferInfoFromArrays(gl, dataLantern);
const meshProgramInfoLantern = webglUtils.createProgramInfo(gl, [objVertShader, objFragShader]);

// дорожный знак
const responseSign = await fetch('./objects/objSignal.obj');  
const textSign = await responseSign.text();
const dataSign = parseOBJ(textSign, 45);
const bufferInfoSign = webglUtils.createBufferInfoFromArrays(gl, dataSign);
const meshProgramInfoSign = webglUtils.createProgramInfo(gl, [objVertShader, objFragShader]);



function renderOBJ(time) {
  drawSquare(gl, squareProgramInfo, initBuffers(gl)) 

  drawLantern(gl, meshProgramInfoLantern, bufferInfoLantern);

  drawSign(gl, meshProgramInfoSign, bufferInfoSign);

  drawCar(gl, meshProgramInfo, bufferInfo);


  window.onkeydown=(e)=>{
    switch(e.code)
    {
        case 'Digit1': 
          translateVector[2]+=0.3;
          rotationValue = Math.PI/2;
          break;
        case 'Digit2': 
          translateVector[2]-=0.3;
          rotationValue = -Math.PI/2;
          break;
        case 'Digit3': 
          translateVector[0]-=0.3;
          rotationValue = 0;
          break;
        case 'Digit4': 
          translateVector[0]+=0.3;
          rotationValue = Math.PI;
          break;
        
    }
  };
  
  requestAnimationFrame(renderOBJ);
  
}


requestAnimationFrame(renderOBJ);
}

main();






