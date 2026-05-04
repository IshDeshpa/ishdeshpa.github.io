import { WebGLUtilities } from "./WebGLUtilities.js";
export class Artist {
    constructor(canvas) {
        this.canvas = canvas;
        const gl = WebGLUtilities.requestWebGLContext(this.canvas);
        if (gl === null)
            throw new Error("Could not get WebGL context");
        this.gl = gl;
        WebGLUtilities.requestIntIndicesExt(this.gl);
        this.extVAO = WebGLUtilities.requestVAOExt(this.gl);
    }
    drawLoop() {
        this.draw();
        window.requestAnimationFrame(() => this.drawLoop());
    }
    start() {
        window.requestAnimationFrame(() => this.drawLoop());
    }
}
//# sourceMappingURL=Artist.js.map