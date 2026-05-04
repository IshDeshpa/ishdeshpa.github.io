import { GeometryProgram, FXProgram, RenderTarget, AsciiProgram } from "./Program.js";
import { ConeGeometry, CubeGeometry, SphereGeometry } from "./Geometry.js";
import { Vec3, Vec4, Quat } from "./lib/TSM.js";
import { Camera } from "./Camera.js";
import { vsText, fsText, defaultfxFSText, defaultfxVSText } from "./Shaders.js";
export class Animation {
    constructor(gl, extVAO, timeout, chain) {
        this.bg = new Vec4([1.0, 1.0, 1.0, 1.0]);
        this.gl = gl;
        this.extVAO = extVAO;
        this.bg = new Vec4([1.0, 1.0, 1.0, 1.0]);
        this.camera = new Camera(new Vec3([-10.0, 4.0, -10.0]), new Vec3([1.0, -0.5, 1.0]), new Vec3([0.0, 1.0, 0.0]), 45, window.innerWidth / window.innerHeight, 0.1, 1000.0);
        this.target = new RenderTarget(this.gl);
        this.fx = new FXChain(this.gl, this.extVAO, this.target, chain);
        this.time = 0;
        this.timeout = timeout;
    }
    init() {
        this.animationID = window.setInterval(() => this.update(), this.timeout);
    }
    ;
    update() {
        this.time += this.timeout;
    }
    ;
    stop() {
        window.clearInterval(this.animationID);
    }
}
export class ShapeAnimation extends Animation {
    constructor(gl, extVAO, chain) {
        super(gl, extVAO, 1, chain);
        this.init();
    }
    init() {
        this.cube = new CubeGeometry(2, new Vec3([0.0, 0.0, 0.0]), Quat.identity.copy(), new Vec3([1.0, 0.0, 0.0]));
        this.cone = new ConeGeometry(1, 3, 64, new Vec3([-3, -1, 0.0]), Quat.identity.copy(), new Vec3([0.0, 1.0, 0.0]));
        this.sphere = new SphereGeometry(1, 32, 32, new Vec3([3, 0, 0]), Quat.identity.copy(), new Vec3([0.0, 0.0, 1.0]));
        this.program = new GeometryProgram(this.gl, this.extVAO, this.bg, vsText, fsText, this.target, this.camera);
        this.program.registerGeometry(this.cube);
        this.program.registerGeometry(this.cone);
        this.program.registerGeometry(this.sphere);
        super.init();
    }
    draw() {
        this.program.draw(); // Draw from registered geometries to render target
        this.fx.draw(); // Draw from target to screen
    }
    update() {
        super.update();
        this.camera.setTarget(this.program.getGeometryCentroid());
        const bounce = Math.sin(this.time / 500.0) * 2.0;
        this.cube.setTranslation(new Vec3([0.0, bounce, 0.0]));
        this.cube.rotate(new Vec3([0.0, 1.0, 0.0]), Math.PI / 512.0);
        const bounce2 = Math.sin(this.time / 500.0 + Math.PI / 3) * 2.0;
        this.cone.setTranslation(new Vec3([-3.0, bounce2, 0.0]));
        const bounce3 = Math.sin(this.time / 500.0 + 2 * Math.PI / 3) * 2.0;
        this.sphere.setTranslation(new Vec3([3.0, bounce3, 0.0]));
        this.camera.orbitTarget(new Vec3([0.0, 1.0, 0.0]), Math.PI / 8192.0);
    }
    onKeydown(key) {
        switch (key.code) {
        }
    }
}
const PLANETS = [
    { name: "mercury", radius: 0.05, orbitRadius: 1.8, color: new Vec3([0.76, 0.70, 0.68]), orbitSpeed: 4.15, axialTilt: new Vec3([0.0, 1.0, 0.03]) },
    { name: "venus", radius: 0.12, orbitRadius: 2.8, color: new Vec3([0.90, 0.75, 0.45]), orbitSpeed: 1.62, axialTilt: new Vec3([0.0, 1.0, 0.05]) },
    { name: "earth", radius: 0.13, orbitRadius: 4.0, color: new Vec3([0.25, 0.55, 0.85]), orbitSpeed: 1.00, axialTilt: new Vec3([0.0, 1.0, 0.41]) },
    { name: "mars", radius: 0.07, orbitRadius: 5.5, color: new Vec3([0.78, 0.35, 0.18]), orbitSpeed: 0.53, axialTilt: new Vec3([0.0, 1.0, 0.44]) },
    { name: "jupiter", radius: 0.50, orbitRadius: 9.0, color: new Vec3([0.80, 0.65, 0.45]), orbitSpeed: 0.084, axialTilt: new Vec3([0.0, 1.0, 0.05]) },
    { name: "saturn", radius: 0.42, orbitRadius: 13.0, color: new Vec3([0.87, 0.78, 0.55]), orbitSpeed: 0.034, axialTilt: new Vec3([0.0, 1.0, 0.47]) },
    { name: "uranus", radius: 0.25, orbitRadius: 17.0, color: new Vec3([0.65, 0.87, 0.93]), orbitSpeed: 0.012, axialTilt: new Vec3([0.0, 1.0, 1.71]) },
    { name: "neptune", radius: 0.24, orbitRadius: 21.0, color: new Vec3([0.25, 0.41, 0.88]), orbitSpeed: 0.006, axialTilt: new Vec3([0.0, 1.0, 0.49]) },
];
export class SpaceAnimation extends Animation {
    constructor(gl, extVAO, chain) {
        super(gl, extVAO, 1, chain);
        this.bg = new Vec4([0.0, 0.0, 0.0, 1.0]);
        this.init();
    }
    init() {
        this.sun = new SphereGeometry(1, 32, 32, new Vec3([0, 0, 0]), Quat.identity.copy(), new Vec3([1.0, 0.85, 0.1]));
        this.planets = PLANETS.map(p => new SphereGeometry(p.radius, 32, 32, new Vec3([p.orbitRadius, 0, 0]), Quat.identity.copy(), p.color));
        this.program = new GeometryProgram(this.gl, this.extVAO, this.bg, vsText, fsText, this.target, this.camera);
        this.program.registerGeometry(this.sun);
        this.planets.forEach(p => this.program.registerGeometry(p));
        this.camera.setTarget(new Vec3([0.0, 0.0, 0.0]));
        super.init();
    }
    draw() {
        this.program.draw(); // Draw from registered geometries to render target
        this.fx.draw(); // Draw from target to screen
    }
    update() {
        super.update();
        const t = this.time / 125.0;
        PLANETS.forEach((config, i) => {
            const planet = this.planets[i];
            const angle = t * config.orbitSpeed;
            planet.rotate(config.axialTilt, Math.PI / 2048.0);
            planet.setTranslation(new Vec3([
                config.orbitRadius * Math.cos(angle),
                0.0,
                config.orbitRadius * Math.sin(angle),
            ]));
        });
        this.camera.orbitTarget(new Vec3([1.0, 0.0, 0.0]), Math.PI / 8192.0);
        this.camera.orbitTarget(new Vec3([0.0, 1.0, 0.0]), Math.PI / 8192.0);
        this.camera.orbitTarget(new Vec3([0.0, 0.0, 1.0]), Math.PI / 8192.0);
    }
    onKeydown(key) {
        switch (key.code) {
        }
    }
}
export class VideoAnimation extends Animation {
    constructor(gl, extVAO, chain) {
        super(gl, extVAO, 1, chain);
        this.videoTexture = -1;
        this.video = document.getElementById("video");
        this.videoUpload = document.getElementById("upload");
        this.init();
    }
    init() {
        const gl = this.gl;
        this.videoTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.fx.source.texture = this.videoTexture;
        this.videoUpload.addEventListener("change", () => {
            var _a;
            const file = (_a = this.videoUpload.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file)
                return;
            this.video.src = URL.createObjectURL(file);
        });
        super.init();
    }
    draw() {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
        this.fx.draw();
    }
    onKeydown(key) {
        switch (key.code) {
            case "Space":
                this.video.paused ? this.video.play() : this.video.pause();
                break;
        }
    }
}
export class FXChain {
    constructor(gl, extVAO, source, chain) {
        this.source = source;
        this.chain = chain;
        // by default, push a fx layer that does nothing
        this.chain.push(new FXProgram(gl, extVAO, defaultfxVSText, defaultfxFSText));
        this.intermediates = [];
        for (let i = 0; i < chain.length - 1; i++) {
            this.intermediates.push(new RenderTarget(gl));
        }
        this.wire();
    }
    wire() {
        let currentSource = this.source;
        for (let i = 0; i < this.chain.length; i++) {
            const isLast = i === this.chain.length - 1;
            const target = isLast ? null : this.intermediates[i];
            this.chain[i].connect(currentSource, target);
            if (!isLast) {
                currentSource = target;
            }
        }
    }
    draw() {
        for (const fx of this.chain) {
            fx.draw();
        }
    }
    getAllAsciiFX() {
        let asciis = [];
        for (let program of this.chain) {
            if (program instanceof AsciiProgram) {
                asciis.push(program);
            }
        }
        return asciis;
    }
}
//# sourceMappingURL=Animation.js.map