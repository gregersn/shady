'use strict';

var gl;
var canvas;
var buffer;

var vertexdata;
var uvdata;

var program;
var quadtexture;
var quadimage;

window.onload = init;

function initWebGL(canvas) {
    gl = null;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch(e) {

    }

    if(!gl) {
        alert('Could not initialize webgl');
        gl = null;
    }

    return gl;
}

function init() {
    var shaderScript;
    var shaderSource;
    var vertexShader;
    var fragmentShader;
    var err;

    canvas = document.getElementById('glscreen');
    gl = initWebGL(canvas);
    canvas.width = 640;
    canvas.height = 480;

    if(gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.LEQUAL);
        //gl.enable(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    vertexdata = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexdata);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
                -1.0, -1.0,
                 1.0, -1.0,
                -1.0,  1.0,
                -1.0,  1.0,
                 1.0, -1.0,
                 1.0,  1.0]),
        gl.STATIC_DRAW
    );

    uvdata = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvdata);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0]),
        gl.STATIC_DRAW
    );


    initTextures();
    initShaders();
    render();
}

function initTextures() {
    quadtexture = gl.createTexture();
    quadimage = new Image();
    quadtexture.onload = function() { handleTextureLoaded(quadimage, quadtexture); };
    quadimage.src = 'static/images/uvtest.png';

    function handleTextureLoaded(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

function initShaders() {
    var shaderScript;
    var shaderSource;
    var vertexShader;
    var fragmentShader;
    var err;

    shaderScript = document.getElementById('2d-vertex-shader');
    shaderSource = shaderScript.text;
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderSource);
    gl.compileShader(vertexShader);
    err = gl.getShaderInfoLog(vertexShader);
    if(err.length > 0) {
        console.log(err);
        return;
    }

    shaderScript = document.getElementById('2d-fragment-shader');
    shaderSource = shaderScript.text;
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderSource);
    gl.compileShader(fragmentShader);
    err = gl.getShaderInfoLog(fragmentShader);
    if(err.length > 0) {
        console.log(err);
        return;
    }

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
}

function render() {
    window.requestAnimationFrame(render, canvas);

    gl.clearColor(1.0, 0.0, 0.0, 1,0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    //var textureCoordinates = gl.getAttribLocation(program, "a_textureCoord");
    gl.enableVertexAttribArray(positionLocation);
    //gl.enableVertexAttribArray(textureCoordinates);

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    //gl.vertexAttribPointer(textureCoordinates, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
