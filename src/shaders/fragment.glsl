#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D u_image;
uniform vec4 u_color;

varying vec2 v_textureCoord;

void main() {
    //gl_FragColor = u_color;
    gl_FragColor = texture2D(u_image, v_textureCoord).rgba;
}
