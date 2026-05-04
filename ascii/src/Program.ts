import { Camera } from "./Camera.js";
import { Vec3, Vec4 } from "./lib/TSM.js";
import { WebGLUtilities } from "./WebGLUtilities.js";
import { Geometry } from "./Geometry.js";
import { asciifxFSTextV1, asciifxFSTextV2, asciifxFSTextV3, defaultfxFSText, defaultfxVSText, sliderfxFSText } from "./Shaders.js";
import { Font } from "./Font.js";

export abstract class Program {
  protected gl: WebGLRenderingContext;

  // Program
  protected program: WebGLProgram = -1;
  protected vsText: string;
  protected fsText: string;
  protected bg: Vec4;

  // VAO
  protected VAO: WebGLVertexArrayObjectOES = -1;
  protected extVAO: OES_vertex_array_object;

  // Dirty
  protected isDirty: boolean;

  // Target
  protected target: RenderTarget | null = null;

  constructor(
    gl: WebGLRenderingContext,
    extVAO: OES_vertex_array_object,
    bg: Vec4,
    vsText: string,
    fsText: string,
    target: RenderTarget | null,
  ){
    this.gl = gl;
    this.extVAO = extVAO;
    this.bg = bg;
    this.vsText = vsText;
    this.fsText = fsText;
    this.target = target;
    this.isDirty = true;
  }

  public abstract init(): void;
  public initCommon(): void{
    const gl: WebGLRenderingContext = this.gl;

    this.program = WebGLUtilities.createProgram(
      gl,
      this.vsText,
      this.fsText 
    );

    this.VAO = this.extVAO.createVertexArrayOES() as WebGLVertexArrayObjectOES;
  }
  
  public draw(): void{
    const gl: WebGLRenderingContext = this.gl;
    const bg: Vec4 = this.bg;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.target ? this.target.framebuffer : null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(bg.r, bg.g, bg.b, bg.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.BLEND);
    gl.frontFace(gl.CW);
  }
}

export class GeometryProgram extends Program{
  private camera: Camera;

  // Positions of everything
  private positionsF32: Float32Array = new Float32Array(0);
  private offsetsF32: Float32Array = new Float32Array(0);
  private quatsF32: Float32Array = new Float32Array(0);
  private colorsF32: Float32Array = new Float32Array(0)
  private normsF32: Float32Array = new Float32Array(0);
  private indicesU32: Uint32Array = new Uint32Array(0);

  // Light
  private lightPosition: Vec4 = new Vec4([10.0, 10.0, -10.0, 1.0]);

  // Uniforms
  private lightPositionUniformLocation: WebGLUniformLocation = -1;
  private viewUniformLocation: WebGLUniformLocation = -1;
  private projUniformLocation: WebGLUniformLocation = -1;

  // Attributes
  private vertPositionAttrLocation: GLint = -1;
  private vertPositionAttrBuffer: WebGLBuffer = -1;

  private vertOffsetAttrLocation: GLint = -1;
  private vertOffsetAttrBuffer: WebGLBuffer = -1;

  private vertQuatAttrLocation: GLint = -1;
  private vertQuatAttrBuffer: WebGLBuffer = -1;
  
  private vertColorAttrLocation: GLint = -1;
  private vertColorAttrBuffer: WebGLBuffer = -1;

  private vertNormAttrLocation: GLint = -1;
  private vertNormAttrBuffer: WebGLBuffer = -1;

  // Index buffer
  private indexBuffer: WebGLBuffer = -1;

  // Geometries
  private geometries: Geometry[] = [];
  private geometryCentroid: Vec3 = new Vec3([0, 0, 0]);

  constructor(
    gl: WebGLRenderingContext,
    extVAO: OES_vertex_array_object,
    bg: Vec4,
    vsText: string,
    fsText: string,
    target: RenderTarget | null,
    camera: Camera,
  ){
    super(gl, extVAO, bg, vsText, fsText, target);

    this.camera = camera;
    this.init();
  }

  public init(): void{
    const gl: WebGLRenderingContext = this.gl;
    super.initCommon();

    // Init attributes
    this.vertPositionAttrLocation = gl.getAttribLocation(
      this.program,
      "aPosition"
    );
    this.vertPositionAttrBuffer = gl.createBuffer() as WebGLBuffer;

    this.vertOffsetAttrLocation = gl.getAttribLocation(
      this.program,
      "aOffset"
    );
    this.vertOffsetAttrBuffer = gl.createBuffer() as WebGLBuffer;

    this.vertQuatAttrLocation = gl.getAttribLocation(
      this.program,
      "aQuat"
    );
    this.vertQuatAttrBuffer = gl.createBuffer() as WebGLBuffer;

    this.vertColorAttrLocation = gl.getAttribLocation(
      this.program,
      "aColor"
    );
    this.vertColorAttrBuffer = gl.createBuffer() as WebGLBuffer;

    this.vertNormAttrLocation = gl.getAttribLocation(
      this.program,
      "aNorm"
    );
    this.vertNormAttrBuffer = gl.createBuffer() as WebGLBuffer;
    this.indexBuffer = gl.createBuffer() as WebGLBuffer;

    // Init uniforms
    this.lightPositionUniformLocation = gl.getUniformLocation(
      this.program,
      "uLightPosition"
    ) as WebGLUniformLocation;

    this.viewUniformLocation = gl.getUniformLocation(
      this.program,
      "uView",
    ) as WebGLUniformLocation;

    this.projUniformLocation = gl.getUniformLocation(
      this.program,
      "uProj",
    ) as WebGLUniformLocation;
  }

  private updateAttributes(): void {
    const gl: WebGLRenderingContext = this.gl;

    // Positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPositionAttrBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positionsF32, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.vertPositionAttrLocation,
      4,
      gl.FLOAT,
      false,
      4 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.vertPositionAttrLocation);

    // Offsets
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertOffsetAttrBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsetsF32, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.vertOffsetAttrLocation,
      4,
      gl.FLOAT,
      false,
      4 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.vertOffsetAttrLocation);

    // Quats
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertQuatAttrBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.quatsF32, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.vertQuatAttrLocation,
      4,
      gl.FLOAT,
      false,
      4 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.vertQuatAttrLocation);

    // Colors 
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertColorAttrBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colorsF32, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.vertColorAttrLocation,
      3,
      gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.vertColorAttrLocation);

    // Norms
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertNormAttrBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normsF32, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.vertNormAttrLocation,
      4,
      gl.FLOAT,
      true,
      4 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.vertNormAttrLocation);

    // Index Buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      this.indicesU32,
      gl.STATIC_DRAW
    );
  }

  private updateUniforms(): void {
    const gl: WebGLRenderingContext = this.gl;

    // Update uniforms
    gl.uniformMatrix4fv(
      this.projUniformLocation,
      false,
      new Float32Array(this.camera.projMatrix().all())
    );
    gl.uniformMatrix4fv(
      this.viewUniformLocation,
      false,
      new Float32Array(this.camera.viewMatrix().all())
    );
    gl.uniform4fv(
      this.lightPositionUniformLocation,
      this.lightPosition.xyzw
    );
  }

  private updateBuffers(): void {
    let offset: number = 0;
    for(let i=0; i<this.geometries.length; i++){
      const g: Geometry = this.geometries[i];

      this.positionsF32.set(g.getPositions(), offset*4);
      this.normsF32.set(g.getNormals(), offset*4);
      
      // Give every vertex the same translation, rotation, color
      for(let v=0; v<g.getNumVertices(); v++){
        this.offsetsF32[offset*4 + v*4 + 0] = g.getTranslation().x;
        this.offsetsF32[offset*4 + v*4 + 1] = g.getTranslation().y;
        this.offsetsF32[offset*4 + v*4 + 2] = g.getTranslation().z;
        this.offsetsF32[offset*4 + v*4 + 3] = 0.0;

        this.quatsF32[offset*4 + v*4 + 0] = g.getRotation().x;
        this.quatsF32[offset*4 + v*4 + 1] = g.getRotation().y;
        this.quatsF32[offset*4 + v*4 + 2] = g.getRotation().z;
        this.quatsF32[offset*4 + v*4 + 3] = g.getRotation().w;

        this.colorsF32[offset*3 + v*3 + 0] = g.getColor().x;
        this.colorsF32[offset*3 + v*3 + 1] = g.getColor().y;
        this.colorsF32[offset*3 + v*3 + 2] = g.getColor().z;
      }

      offset += g.getNumVertices();
    }

    offset = 0;
    let vertexOffset = 0;
    for(let i=0; i<this.geometries.length; i++){
      const g: Geometry = this.geometries[i];
      const indices = g.getIndices();
      const offsetIndices = indices.map(idx => idx + vertexOffset);
      this.indicesU32.set(offsetIndices, offset);

      offset += g.getNumTriangles() * 3;
      vertexOffset += g.getNumVertices();
    }
  }

  public draw(): void {
    const gl : WebGLRenderingContext = this.gl;
    super.draw();

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.enable(gl.DEPTH_TEST);

    for(let g of this.geometries){
      // If any geometry is dirty, this program is dirty
      if(g.getDirty()){
        this.isDirty = true;
        g.setClean();
      }
    }

    gl.useProgram(this.program);
    this.extVAO.bindVertexArrayOES(this.VAO);

    if(this.isDirty){
      // Render here
      this.updateBuffers();
      this.updateAttributes();
      this.computeGeometryCentroid();
      this.isDirty = false;
    }
    
    this.updateUniforms();

    gl.drawElements(
      gl.TRIANGLES,
      this.indicesU32.length, 
      gl.UNSIGNED_INT,
      0
    );

    this.extVAO.bindVertexArrayOES(null);
  }

  public setDirty(): void {
    this.isDirty = true;
  }

  // Geometry stuff
  public registerGeometry(g: Geometry){
    // Reserve space for this geometry's positions, normals, indices
    this.geometries.push(g);

    this.positionsF32 = new Float32Array(this.positionsF32.length + g.getNumVertices() * 4);
    this.offsetsF32 = new Float32Array(this.offsetsF32.length + g.getNumVertices() * 4);
    this.normsF32 = new Float32Array(this.normsF32.length + g.getNumVertices() * 4);
    this.quatsF32 = new Float32Array(this.quatsF32.length + g.getNumVertices() * 4);
    this.colorsF32 = new Float32Array(this.colorsF32.length + g.getNumVertices() * 3);
    this.indicesU32 = new Uint32Array(this.indicesU32.length + g.getNumTriangles() * 3);

    this.computeGeometryCentroid();
  }

  public getGeometryCentroid(): Vec3{
    return this.geometryCentroid;
  }

  private computeGeometryCentroid(): void{
    const n = this.geometries.length;
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;
    for(let g of this.geometries){
      const centroid: Vec3 = g.getWorldSpaceCentroid();

      xSum += centroid.x;
      ySum += centroid.y;
      zSum += centroid.z;
    }

    this.geometryCentroid = new Vec3([xSum/n, ySum/n, zSum/n]);
  }
}

export class FXProgram extends Program {
  private source!: RenderTarget | null;

  // uniforms
  private resUniformLocation: WebGLUniformLocation = -1;
  private texUniformLocation: WebGLUniformLocation = -1;

  // fx
  private fxPositionBuffer: WebGLBuffer = -1;
  private fxPositionLocation: GLint = -1;

  constructor(
    gl: WebGLRenderingContext,
    extVAO: OES_vertex_array_object,
    vsText: string,
    fsText: string
  ){
    super(gl, extVAO, new Vec4([1.0, 1.0, 1.0, 1.0]), vsText, fsText, null);
    this.init();
  }

  public init(): void {
    const gl: WebGLRenderingContext = this.gl;
    super.initCommon();

    this.fxPositionBuffer = gl.createBuffer() as WebGLBuffer;
    this.fxPositionLocation = gl.getAttribLocation(this.program, "aFxPosition");

    this.resUniformLocation = gl.getUniformLocation(
      this.program,
      "uResolution",
    ) as WebGLUniformLocation;

    this.texUniformLocation = gl.getUniformLocation(
      this.program, 
      "uTexture"
    ) as WebGLUniformLocation;

    // Verts of four corners of the screen in UV
    const verts = new Float32Array([
      -1, -1,  1, -1,  -1,  1,
      -1,  1,  1, -1,   1,  1,
    ]);
    this.extVAO.bindVertexArrayOES(this.VAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fxPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.fxPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.fxPositionLocation);
    this.extVAO.bindVertexArrayOES(null);
  }

  protected bindTextures(): void{
    if(this.source == null) throw new Error("source = null");

    const gl: WebGLRenderingContext = this.gl;
    const textureIndices = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3];

    gl.activeTexture(textureIndices[0]);
    gl.bindTexture(gl.TEXTURE_2D, this.source.texture);
  }

  protected bindUniforms(): void{
    if(this.source == null) throw new Error("source = null");

    const gl: WebGLRenderingContext = this.gl;

    gl.uniform1i(this.texUniformLocation, 0); // specify texture index 0
    gl.uniform2fv(this.resUniformLocation, new Float32Array([gl.drawingBufferWidth, gl.drawingBufferHeight]));
  }

  public draw(): void {
    if(this.source == null) throw new Error("source = null");

    const gl: WebGLRenderingContext = this.gl;
    super.draw();

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    this.bindTextures();

    gl.useProgram(this.program);
    this.extVAO.bindVertexArrayOES(this.VAO);

    this.bindUniforms();

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.extVAO.bindVertexArrayOES(null);
  }

  public connect(source: RenderTarget, target: RenderTarget | null){
    this.source = source;
    this.target = target;
  }
}

export class AsciiProgram extends FXProgram{
  private charResolutionLocation!: WebGLUniformLocation;
  private texResolutionLocation!: WebGLUniformLocation;
  private fontTexLocation!: WebGLUniformLocation;
  private weightsUniformLocation!: WebGLUniformLocation;
  private sliderUniformLocation!: WebGLUniformLocation;

  private font: Font;

  private sliderPosGetter: () => number;

  constructor(
    gl: WebGLRenderingContext,
    extVAO: OES_vertex_array_object,
    version: number, // 1, 2, 3
    sliderPosGetter: ()=>number,
    font: Font
  ){
    super(gl, extVAO, defaultfxVSText, [asciifxFSTextV1, asciifxFSTextV2, asciifxFSTextV3][version-1]);
    this.font = font;
    this.sliderPosGetter = sliderPosGetter;
  }
  
  public init(){
    super.init();

    const gl = this.gl;
    this.charResolutionLocation = gl.getUniformLocation(this.program, "uCharResolution") as WebGLUniformLocation;
    this.texResolutionLocation = gl.getUniformLocation(this.program, "uTexResolution") as WebGLUniformLocation;
    this.fontTexLocation = gl.getUniformLocation(this.program, "uFontTex") as WebGLUniformLocation;
    this.weightsUniformLocation = gl.getUniformLocation(this.program, "uWeights") as WebGLUniformLocation;
    this.sliderUniformLocation = gl.getUniformLocation(this.program, "uSliderPos") as WebGLUniformLocation;
  }

  protected bindTextures(){
    super.bindTextures();

    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.font.texture);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.font.weightTex);
  }

  protected bindUniforms(){
    super.bindUniforms();

    const gl = this.gl;
    
    gl.uniform2fv(this.charResolutionLocation, [this.font.charWidth, this.font.charHeight]);
    gl.uniform2fv(this.texResolutionLocation, [this.font.canvasWidth, this.font.canvasHeight]);
    gl.uniform1i(this.fontTexLocation, 1);
    gl.uniform1i(this.weightsUniformLocation, 2);
    gl.uniform1f(this.sliderUniformLocation, this.sliderPosGetter()/this.gl.drawingBufferWidth);
  }

  public setVersion(version: number){
    this.fsText = [asciifxFSTextV1, asciifxFSTextV2, asciifxFSTextV3][version-1];
    this.program = WebGLUtilities.createProgram(
      this.gl,
      this.vsText,
      this.fsText 
    );
    this.init();
  }
}

export class SliderProgram extends FXProgram{
  private sliderUniformLocation!: WebGLUniformLocation;

  private sliderPosGetter: ()=>number;

  constructor(
    gl: WebGLRenderingContext,
    extVAO: OES_vertex_array_object,
    sliderPosGetter: ()=>number
  ){
    super(gl, extVAO, defaultfxVSText, sliderfxFSText);
    this.sliderPosGetter = sliderPosGetter;
  }

  public init(){
    super.init();

    const gl = this.gl;
    this.sliderUniformLocation = gl.getUniformLocation(this.program, "uSliderPos") as WebGLUniformLocation;
  }

  protected bindUniforms(): void {
    super.bindUniforms();
    
    const gl = this.gl;

    gl.uniform1f(this.sliderUniformLocation, this.sliderPosGetter()/this.gl.drawingBufferWidth);
  }
}

export class RenderTarget{
  public framebuffer: WebGLFramebuffer = -1;
  public texture: WebGLTexture = -1;

  constructor(gl: WebGLRenderingContext){
    // create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth, gl.drawingBufferHeight);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`Framebuffer is not complete: ${status}`);
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.texture = texture;
    this.framebuffer = framebuffer;
  }
}
