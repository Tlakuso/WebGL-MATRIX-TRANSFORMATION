const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
    throw new Error("WebGL not available/supported");
}

webgl.clearColor(0.1, 0.1, 0, 1.0); // Clear the canvas with black color
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
drawOriginal();

// Rotation animation function
function animateRotation() {
    let angle = 0; // Initial rotation angle

    function animate() {
        angle += 1; // Increment the angle for rotation

        // Convert angle to radians
        const angleInRadians = angle * Math.PI / 180;

        // Calculate cos and sin of the angle
        const cosAngle = Math.cos(angleInRadians);
        const sinAngle = Math.sin(angleInRadians);

        // Define the rotation matrix
        const rotationMatrix = new Float32Array([
            cosAngle, -sinAngle, 0, 0,
            sinAngle, cosAngle, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        // Pass the transformation matrix to the shader
        webgl.uniformMatrix4fv(matrixLocation, false, rotationMatrix);

        // Clear the canvas before drawing
        webgl.clear(webgl.COLOR_BUFFER_BIT);

        // Draw the triangle with the current rotation
        webgl.drawArrays(webgl.TRIANGLES, 0, 3);

        // Request the next animation frame
        requestAnimationFrame(animate);
    }

    // Start the rotation animation
    animate();
}

// Event listener for the rotate button
const rotateButton = document.getElementById('rotateButton');
rotateButton.addEventListener('click', animateRotation);

// Scaling animation function
function animateScaling() {
    let scaleFactor = 1; // Initial scale factor
    let ds = 0.01; // Scale increment

    function animate() {
        // Update scale factor
        scaleFactor += ds;

        // Reverse direction if scale factor goes beyond boundaries
        if (scaleFactor >= 2 || scaleFactor <= 0.5) {
            ds *= -1;
        }

        // Define the scaling matrix
        const scalingMatrix = new Float32Array([
            scaleFactor, 0, 0, 0,
            0, scaleFactor, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        // Pass the transformation matrix to the shader
        webgl.uniformMatrix4fv(matrixLocation, false, scalingMatrix);

        // Clear the canvas before drawing
        webgl.clear(webgl.COLOR_BUFFER_BIT);

        // Draw the triangle with the current scaling
        webgl.drawArrays(webgl.TRIANGLES, 0, 3);

        // Request the next animation frame
        requestAnimationFrame(animate);
    }

    // Start the scaling animation
    animate();
}

// Event listener for the scale button
const scaleButton = document.getElementById('scaleButton');
scaleButton.addEventListener('click', animateScaling);

//translation function
// Translation animation function
function animateTranslation() {
    let tx = 0, ty = 0;
    let dx = 0.01, dy = 0.01; // Translation increments


    function animate() {
        // Update translation
        tx += dx;
        ty += dy;

        
        // Reverse direction if triangle reaches clipping boundaries
        if (tx >= 1 || tx <= -1) {
            dx *= -1;
        }
        if (ty >= 1 || ty <= -1) {
            dy *= -1;
        }

        // Define the translation matrix
        const translationMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, 0, 1
        ]);

        // Pass the transformation matrix to the shader
        webgl.uniformMatrix4fv(matrixLocation, false, translationMatrix);

        // Clear the canvas before drawing
        webgl.clear(webgl.COLOR_BUFFER_BIT);

        // Draw the triangle with the current translation
        webgl.drawArrays(webgl.TRIANGLES, 0, 3);

        // Request the next animation frame
        requestAnimationFrame(animate);
    }

    // Start the translation animation
    animate();
}

// Event listener for the translate button
const translateButton = document.getElementById('translateButton');
translateButton.addEventListener('click', animateTranslation);