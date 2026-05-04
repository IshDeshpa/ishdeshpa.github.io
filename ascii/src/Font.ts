// http://delphic.me.uk/tutorials/webgl-text

const numChars: number = 95;
export class Font {
  public texture!: WebGLTexture;
  public weightTex!: WebGLTexture;
  private weights!: Float32Array;

  public size!: number;
  public charWidth!: number;
  public charHeight!: number;

  public canvasWidth!: number;
  public canvasHeight!: number;

  private fontfamily!: string;
  private fullFontString!: string;

  private inverted!: boolean;
  private version!: number;

  private gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext, version: number, size: number, inverted: boolean = false, fontfamily: string = 'monospace'){
    this.gl = gl;
    this.init(version, size, inverted, fontfamily);
  }

  private init(version: number, size: number, inverted: boolean, fontfamily: string){
    this.fullFontString = `${size}px "${fontfamily}"`;

    this.version = version;
    this.size = size;
    this.inverted = inverted;
    this.fontfamily = fontfamily;

    let bg, fg;
    if(inverted){
      bg = "#000000";
      fg = "#FFFFFF";
    } else {
      bg = "#FFFFFF";
      fg = "#000000";
    }

    const gl = this.gl;
    const canvas = document.getElementById("texturecanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.font = this.fullFontString;
    
    const charWidth = ctx.measureText("M").width;

    const printable = Array.from({ length: numChars }, (_, i) => String.fromCharCode(32 + i)).join('');

    canvas.width = this.getPowerOfTwo(charWidth * numChars);
    canvas.height = this.getPowerOfTwo(size);

    ctx.font = this.fullFontString;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fg;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let numComponents = 0;
    let numActualComponents = 0;
    let computeVector: (char: string, size: number, charWidth: number) => number[] = (char, size, charWidth) => {return [0];};
    let texWidth = 0;

    if(version == 1){
      numActualComponents = 1;
      numComponents = 4;
      computeVector = this.measureLuminance.bind(this);
      texWidth = numChars;
    } else if(version == 2){
      numActualComponents = 2;
      numComponents = 4;
      computeVector = this.compute2DShapeVector.bind(this);
      texWidth = numChars;
    } else if(version == 3){
      numActualComponents = 6;
      numComponents = 8;
      computeVector = this.compute6DShapeVector.bind(this);
      texWidth = numChars * 2;
    }

    this.weights = new Float32Array(numChars * numComponents);

    let maxes: number[] = new Array(numActualComponents);
    maxes.fill(0, 0, numActualComponents);

    for(let i=0; i<printable.length; i++){
      ctx.fillText(printable[i], i*charWidth, 0);
      const weightVec: number[] = computeVector(String.fromCharCode(32 + i), size, charWidth);
      // if(this.inverted){
      //   for(let j=0; j<weightVec.length; j++){
      //     weightVec[j] = 1.0 - weightVec[j];
      //   }
      // }

      const base = i * numComponents;

      this.weights.fill(0.0, base, base + numComponents);
      this.weights[base + numComponents - 1] = 1.0;

      for (let j = 0; j < numActualComponents; j++) {
        this.weights[base + j] = weightVec[j];
        if(weightVec[j] > maxes[j]){
          maxes[j] = weightVec[j]
        }
      }
    }

    for(let i=0; i<numChars; i++){
      for(let j=0; j<numActualComponents; j++){
        if(!this.inverted){
          this.weights[i*numComponents + j] = (1 - (this.weights[i*numComponents + j] / maxes[j])) ** 4;
        } else{
          this.weights[i*numComponents + j] = ((this.weights[i*numComponents + j] / maxes[j])) ** 4;
        }
      }
    }

    this.texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);

    this.weightTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.weightTex);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, 1, 0, gl.RGBA, gl.FLOAT, this.weights);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);

    this.charWidth = charWidth;
    this.charHeight = canvas.height;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }
  
  private compute6DShapeVector(char: string, size: number, charWidth: number){
    const canvas = document.getElementById("charcanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = charWidth;
    canvas.height = Math.ceil(size * 1.5); 

    ctx.font = this.fullFontString;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.fillText(char, canvas.width / 2, canvas.height / 2);

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let topLeft = 0;
    let topRight = 0;
    let midLeft = 0;
    let midRight = 0;
    let botLeft = 0;
    let botRight = 0;

    const heightTripoint = Math.floor(canvas.height / 3);
    const widthMidpoint = Math.floor(canvas.width / 2);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {

        const i = (y * canvas.width + x) * 4; // index since pixels is RGBA format
        const avg = pixels[i + 3] / 255; // alpha value

        if (y < heightTripoint) {
          if(x < widthMidpoint){
            topLeft += avg;
          }
          else{
            topRight += avg;
          }
        } 
        else if (y < heightTripoint * 2){
          if (x < widthMidpoint){
            midLeft += avg;
          }
          else{
            midRight += avg;
          }
        }
        else {
          if (x < widthMidpoint){
            botLeft += avg;
          }
          else {
            botRight+= avg;
          }
        }
      }
    }

    const pixelsPerSection = (canvas.width * canvas.height) / 6; // technically not completely true if the numPixels is not divisible by 6. hm

    return [topLeft / pixelsPerSection, topRight / pixelsPerSection,
            midLeft / pixelsPerSection, midRight / pixelsPerSection,
            botLeft / pixelsPerSection, botRight / pixelsPerSection];
  }


  private compute2DShapeVector(char: string, size: number, charWidth: number): number[]{
    const canvas = document.getElementById("charcanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = charWidth;
    canvas.height = Math.ceil(size * 1.5); // i did this so that long letters (like g and p and whatnot) dont get chopped

    ctx.font = this.fullFontString;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.fillText(char, canvas.width / 2, (canvas.height / 2) );

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let topLuminance = 0;
    let botLuminance = 0;

    const midpoint = Math.floor(canvas.height / 2);

    // switched to x and y implementation to make later subdivisions easier
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {

        const i = (y * canvas.width + x) * 4; // index

        // const r = pixels[i] / 255;
        // const g = pixels[i + 1] / 255;
        // const b = pixels[i + 2] / 255;
        // const avg = (r + g + b) / 3;
        const avg = pixels[i + 3] / 255;

        if (y < midpoint) {
          topLuminance += avg;
        } else {
          botLuminance += avg;
        }
      }
    }

    const pixelsPerHalf = (canvas.width * canvas.height) / 2;
    return [(topLuminance / pixelsPerHalf), (botLuminance / pixelsPerHalf)];
  }

  private measureLuminance(char: string, size: number, charWidth: number): number[]{
    const canvas = document.getElementById("charcanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = charWidth;
    canvas.height = Math.ceil(size * 1.5);

    ctx.font = this.fullFontString;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.fillText(char, canvas.width / 2, canvas.height / 2);

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let luminance = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        luminance += pixels[i + 3] / 255;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    return [luminance / totalPixels];
  }

  private getPowerOfTwo(value: number, pow: number = 1){
    while(pow<value) {
      pow *= 2;
    }
    return pow;
  }

  public setSize(size: number){
    size = Math.max(size, 2);
    this.init(this.version, size, this.inverted, this.fontfamily);
  }

  public async setFont(fontfamily: string){
    await document.fonts.load(`${this.size}px "${fontfamily}"`);
    this.init(this.version, this.size, this.inverted, fontfamily);
  }

  public setVersion(version: number){
    this.init(version, this.size, this.inverted, this.fontfamily);
  }

  public setInverted(inverted: boolean){
    this.init(this.version, this.size, inverted, this.fontfamily);
  }
}
