attribute vec2 a_position;
attribute vec2 a_textureCoord;

varying highp vec2 vTextureCoord;
void main() {
    gl_Position = vec4(a_position, 0, 1);
    vTextureCoord = a_textureCoord;
}
