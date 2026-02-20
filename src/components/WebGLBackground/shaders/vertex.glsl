#version 300 es
in vec2 vertexPosition;

void main() {
  // Pass the vertex position to the clip space
  gl_Position = vec4(vertexPosition, 0.0, 1.0);
}
