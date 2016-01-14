'use strict';

var canvas;
var gl;

var buffer;

var perspectiveMatrix;

var vertexdata;
var uvdata;

// var shaderprogram;
var quadtexture;
var quadimage;

window.onload = init;

var unloadedImage = 0;

function onloadImage() {
    console.log('Image loaded');
    if(unloadedImage > 0) {
        unloadedImage--;
    }
}

function loadImage(url, callback) {
    console.log('Loading image!');
    var image = new Image();
    unloadedImage++;
    image.src = url;

    image.onload = function() {
        callback(image);
    }
    return image;
}

function init() {
    //var image = loadImage('http://localhost:3000/static/images/uvtest.png', init_gl);
    var textures = document.getElementById('textures').getElementsByTagName('img');
    init_gl(textures);
}

function init_gl(images) {
    console.log('Hei?');
    canvas = document.getElementById('glscreen');
    canvas.width = 640.0;
    canvas.height = 480.0;

    gl = initWebGL(canvas);
    if(!gl) {
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var shaderprogram = createProgram(gl, ['2d-vertex-shader', '2d-fragment-shader']);
    gl.useProgram(shaderprogram);

    var positionLocation = gl.getAttribLocation(shaderprogram, 'a_position');
    var resolutionLocation = gl.getUniformLocation(shaderprogram, 'u_resolution');
    var colorLocation = gl.getUniformLocation(shaderprogram, 'u_color');
    var textureCoordLocation = gl.getAttribLocation(shaderprogram, 'a_textureCoord');

    gl.uniform4f(colorLocation, 1.0, 1.0, 0.0, 1.0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
                          0.0, 0.0,
                 canvas.width, 0.0,
                          0.0, canvas.height,
                          0.0, canvas.height,
                 canvas.width, 0.0,
                 canvas.width, canvas.height]),
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


    var textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
        ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(textureCoordLocation);
    gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = null;
    var textures = [];
    for(var textureid = 0; textureid < images.length; textureid++) {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[textureid]);

        textures.push(texture);
    }

    var u_image0Location = gl.getUniformLocation(shaderprogram, 'u_image0');
    var u_image1Location = gl.getUniformLocation(shaderprogram, 'u_image1');

    gl.uniform1i(u_image0Location, 0);
    gl.uniform1i(u_image1Location, 1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);



    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return; 
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);



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
    perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    render();
}

function render() {
    //gl.clearColor(1.0, 0.0, 0.0, 1,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /*
    //var textureCoordinates = gl.getAttribLocation(program, "a_textureCoord");
    gl.enableVertexAttribArray(positionLocation);
    //gl.enableVertexAttribArray(textureCoordinates);

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    //gl.vertexAttribPointer(textureCoordinates, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);*/

    window.requestAnimationFrame(render, canvas);
}

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

function createProgram(context, shadersources) {
    var shaderScript;
    var shaderSource;
    var vertexShader;
    var fragmentShader;
    var err;

    var shaders = [];

    var i;
    for(i = 0; i < shadersources.length; i++) {
        shaders.push(getShader(context, shadersources[i]));
    }

    var shaderprogram = gl.createProgram();
    for(i = 0; i < shaders.length; i++) {
        gl.attachShader(shaderprogram, shaders[i]);
    }
    gl.linkProgram(shaderprogram);

    if(!gl.getProgramParameter(shaderprogram, gl.LINK_STATUS)) {
        console.log('Unable to initialize shader program.');
    }
    return shaderprogram;
}

function initBuffers() {
    var buffer = gl.createBuffer();
    gl.bundBuffer(gl.ARRAY_BUFFER, buffer);
    var vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
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

// ** UTILITY FUNCTIONS ** //
function getShader(context, elementid) {
    var shader;
    var type;

    var shaderScript = document.getElementById(elementid);
    if(shaderScript.type === 'x-shader/x-fragment') {
        type = context.FRAGMENT_SHADER;
    } else if(shaderScript.type === 'x-shader/x-vertex') {
        type = context.VERTEX_SHADER;
    } else {
        return null;
    }

    var shaderSource = shaderScript.text;
    
    shader = context.createShader(type);
    
    context.shaderSource(shader, shaderSource);
    context.compileShader(shader);
    
    var err = context.getShaderInfoLog(shader);
    if(err.length > 0) {
        console.log(err);
        return null;
    }

    return shader;
}
