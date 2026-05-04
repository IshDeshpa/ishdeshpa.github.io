import { WebGLUtilities } from "./WebGLUtilities.js";

export abstract class Artist {
  protected canvas: HTMLCanvasElement;
  protected gl: WebGLRenderingContext;
  protected extVAO: OES_vertex_array_object;

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas;

    const gl = WebGLUtilities.requestWebGLContext(this.canvas);
    if (gl === null) throw new Error("Could not get WebGL context");
    this.gl = gl;

    WebGLUtilities.requestIntIndicesExt(this.gl);
    this.extVAO = WebGLUtilities.requestVAOExt(this.gl);
  }

  public abstract reset(): void;
  public abstract draw(): void;

  public drawLoop(): void {
      this.draw();
      window.requestAnimationFrame(() => this.drawLoop());
  }

  public start(): void {
    window.requestAnimationFrame(() => this.drawLoop());
  }
}
