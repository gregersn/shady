#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

void main() {
    gl_FragColor = vec4(gl_FragCoord.x / 640.0,
                        gl_FragCoord.y / 480.0,
                        0, 1);
}
