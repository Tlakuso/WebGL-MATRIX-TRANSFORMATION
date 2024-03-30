const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
    throw new Error("WebGL not available/supported");
}

webgl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear the canvas with black color
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
    
//Draw the original triangle
function drawOriginal() {
    // Initial transformation matrix (identity matrix)-remember that you are multiplying the matrix with the matrix
    const initialMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    // Pass the initial transformation matrix to the shader and draw the original triangle
    webgl.uniformMatrix4fv(matrixLocation, false, initialMatrix);
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}

//Call the function to draw the original triangle initially
drawOriginal();

// Scaling function
function scaling(s1, s2, s3) {
    // Define transformation matrix
    const scalingMatrix = new Float32Array([
        s1, 0, 0, 0,
        0, s2, 0, 0,
        0, 0, s3, 0,
        0, 0, 0, 1
    ]);

    // Pass the transformation matrix to the shader
    webgl.uniformMatrix4fv(matrixLocation, false, scalingMatrix);

    // Clear the canvas before drawing
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    // Draw the triangle with the applied scaling
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}

const scaleButton = document.getElementById('scaleButton');
scaleButton.addEventListener('click', function() {
    scaling(2, 2, 2); // Example: scale by 2 in all axes
});
