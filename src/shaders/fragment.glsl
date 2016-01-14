#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D u_image0;
uniform sampler2D u_image1;

uniform vec4 u_color;

varying vec2 v_textureCoord;

void main() {
    //gl_FragColor = u_color;
    gl_FragColor = texture2D(u_image0, v_textureCoord);
}
