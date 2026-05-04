export class WebGLUtilities {
    /**
     * Creates and compiles a WebGL Shader from given source
     * @param ctx a WebGL rendering context. This has methods for compiling the shader.
     * @param shaderType can only be ctx.VERTEX_SHADER or ctx.FRAGMENT_SHADER.
     * @param source the shader source code as a string.
     * @return a WebGL shader
     */
    static createShader(ctx, shaderType, source) {
        /* TODO: error checking */
        const shader = ctx.createShader(shaderType);
        ctx.shaderSource(shader, source);
        ctx.compileShader(shader);
        /* Check for Compilation Errors */
        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            console.error("ERROR compiling shader!", ctx.getShaderInfoLog(shader));
        }
        return shader;
    }
    /**
     * Creates a shader program from the given vertex shader and fragment shader
     * @param vsSource the vertex shader source as a string
     * @param fsSource the fragment shader source as a string
     * @return a WebGLProgram
     */
    static createProgram(ctx, vsSource, fsSource) {
        /* TODO: error checking */
        const shaderProgram = ctx.createProgram();
        const vertexShader = WebGLUtilities.createShader(ctx, ctx.VERTEX_SHADER, vsSource);
        ctx.attachShader(shaderProgram, vertexShader);
        const fragmentShader = WebGLUtilities.createShader(ctx, ctx.FRAGMENT_SHADER, fsSource);
        ctx.attachShader(shaderProgram, fragmentShader);
        ctx.linkProgram(shaderProgram);
        /* Check for Linker Errors */
        if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
            console.error("ERROR linking program!", ctx.getProgramInfoLog(shaderProgram));
        }
        /* While debugging Validate Program */
        ctx.validateProgram(shaderProgram);
        if (!ctx.getProgramParameter(shaderProgram, ctx.VALIDATE_STATUS)) {
            console.error("ERROR validating program!", ctx.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
    }
    /**
     * Returns a WebGL context for the given Canvas
     * @param canvas any HTML canvas element
     * @return the WebGL rendering context for the canvas
     */
    static requestWebGLContext(canvas) {
        /* Request WebGL Context */
        let ctx = canvas.getContext("webgl", {
            preserveDrawingBuffer: true
        });
        if (!ctx) {
            console.log("Your browser does not support WebGL, falling back", "to Experimental WebGL");
            ctx = canvas.getContext("experimental-webgl");
        }
        if (!ctx) {
            throw new Error("Your browser does not support WebGL or Experimental-WebGL");
        }
        return ctx;
    }
    /**
     * Extends the given WebGL context with unsigned int indices
     * @param ctx the WebGL rendering context to extend
     */
    static requestIntIndicesExt(ctx) {
        /* Request unsigned int indices extention */
        const extIndex = ctx.getExtension("OES_element_index_uint");
        if (!extIndex) {
            throw new Error("Your browser does not support 32 bit indices");
        }
    }
    /**
     * Returns the VAO extension back if supported
     * @param ctx the WebGL rendering context to extend
     * @return the VAO extension
     */
    static requestVAOExt(ctx) {
        /* Request vao extension */
        const extVAO = ctx.getExtension("OES_vertex_array_object");
        if (!extVAO) {
            throw new Error("Your browser does not support the VAO extension.");
        }
        const ext = ctx.getExtension('OES_texture_float');
        if (!ext) {
            throw new Error("Your browser does not support the float extension.");
        }
        return extVAO;
    }
}
//# sourceMappingURL=WebGLUtilities.js.map