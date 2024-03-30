const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
    throw new Error("WebGL not available/supported");
}

webgl.clearColor(0.5, 0.0, 0.1, 1.0); // Clear the canvas with black color
webgl.clear(webgl.COLOR_BUFFER_BIT);

const vertices = new Float32Array([
    0, 0,
    -0.5, -0.5,
    -0.5, 0
]);

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vsSource = `
attribute vec4 pos;
uniform mat4 matrix;
void main() {
    gl_Position = matrix * pos;
}`;

const fsSource = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader, vsSource);
webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
    console.error('Error compiling vertex shader:', webgl.getShaderInfoLog(vertexShader));
}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader, fsSource);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
    console.error('Error compiling fragment shader:', webgl.getShaderInfoLog(fragmentShader));
}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
    console.error('Error linking program:', webgl.getProgramInfoLog(program));
}

const positionLocation = webgl.getAttribLocation(program, `pos`);
const matrixLocation = webgl.getUniformLocation(program, 'matrix');

webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
webgl.useProgram(program);

let angle = 0;

function animate() {
    angle += 1; // Increment the angle for rotation
    const angleInRadians = angle * Math.PI / 180; // Convert angle to radians
    const cosAngle = Math.cos(angleInRadians);
    const sinAngle = Math.sin(angleInRadians);
    const rotationMatrix = new Float32Array([
        cosAngle, -sinAngle, 0, 0,
        sinAngle, cosAngle, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1 // Identity matrix for translation
    ]);
    
    webgl.clear(webgl.COLOR_BUFFER_BIT); // Clear the canvas before drawing
    
    // Pass the rotation matrix to the shader
    webgl.uniformMatrix4fv(matrixLocation, false, rotationMatrix);
    
    // Draw the triangle
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);

    requestAnimationFrame(animate); // Request the next animation frame
}

animate(); // Start the animation loop
