import { Animation, ShapeAnimation, SpaceAnimation, VideoAnimation } from "./Animation.js";
import { Artist } from "./Artist.js";
import { AsciiProgram, SliderProgram } from "./Program.js";
import { Font } from "./Font.js";

class Ascii extends Artist {
  private dragging: boolean = false;
  private sliderPos: number = 10;
  
  private fontSizeSlider!: HTMLInputElement;
  private fontSelect!: HTMLSelectElement;
  private modeSelect!: NodeListOf<HTMLInputElement>;
  private invertSelect!: HTMLInputElement;

  private loadedAnimation: Animation;
  private font: Font = new Font(this.gl, 1, 10);
  private options: Animation[] = [
    new ShapeAnimation(this.gl, this.extVAO, [
      new AsciiProgram(this.gl, this.extVAO, 1, ()=>this.sliderPos, this.font),
      new SliderProgram(this.gl, this.extVAO, ()=>this.sliderPos)
    ]),
    new SpaceAnimation(this.gl, this.extVAO, [
      new AsciiProgram(this.gl, this.extVAO, 1, ()=>this.sliderPos, this.font),
      new SliderProgram(this.gl, this.extVAO, ()=>this.sliderPos)
    ]),
    new VideoAnimation(this.gl, this.extVAO, [
      new AsciiProgram(this.gl, this.extVAO, 1, ()=>this.sliderPos, this.font),
      new SliderProgram(this.gl, this.extVAO, ()=>this.sliderPos)
    ])
  ];

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.loadedAnimation = this.options[0];
    this.init();
  }

  public init(): void {
    this.fontSizeSlider = document.getElementById("fontSize") as HTMLInputElement;
    this.fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
    this.modeSelect = document.querySelectorAll('input[name="mode"]');
    this.invertSelect = document.getElementById("inverted") as HTMLInputElement;

    this.registerEventListeners();
    this.loadedAnimation.init();
  }

  public reset(): void {
    this.init();
  }

  public draw(): void {
    this.loadedAnimation.draw();

  }

  public load(option: number): void{
    this.loadedAnimation = this.options[option];
  }
  
  private onKeydown(key: KeyboardEvent): void{
    this.loadedAnimation.onKeydown(key);
    switch(key.code){
      case "Digit1": {
        this.load(0);
        break;
      }
      case "Digit2": {
        this.load(1);
        break;
      }
      case "Digit3": {
        this.load(2);
        break;
      }
      case "Equal":{
        this.fontSizeSlider.value = String(parseInt(this.fontSizeSlider.value) + 1);
        this.fontSizeSlider.dispatchEvent(new Event("input"));
        break;
      }
      case "Minus":{
        this.fontSizeSlider.value = String(parseInt(this.fontSizeSlider.value) - 1);
        this.fontSizeSlider.dispatchEvent(new Event("input"));
        break;
      }
    }
  }

  private dragStart(mouse: MouseEvent): void{
    if(mouse.x < this.sliderPos + 10 && mouse.x > this.sliderPos - 10){
      this.dragging = true;   
    }
  }

  private drag(mouse: MouseEvent): void{
    if(this.dragging && mouse.x < this.gl.drawingBufferWidth - 10 && mouse.x > 10){
      this.sliderPos = mouse.x;
    }
  }

  private dragEnd(mouse: MouseEvent): void{
    this.dragging = false;
  }

  private registerEventListeners(): void {
    const canvas = this.canvas;

    /* Event listener for key controls */
    window.addEventListener("keydown", (key: KeyboardEvent) =>
      this.onKeydown(key)
    );

    document.addEventListener("mousedown", (mouse: MouseEvent) =>
      this.dragStart(mouse)
    );

    canvas.addEventListener("mousemove", (mouse: MouseEvent) =>
      this.drag(mouse)
    );

    document.addEventListener("mouseup", (mouse: MouseEvent) =>
      this.dragEnd(mouse)
    );

    /* Event listener to stop the right click menu */
    canvas.addEventListener("contextmenu", (event: any) =>
      event.preventDefault()
    );

    this.fontSizeSlider.addEventListener("input", (ev: Event) => {
      this.font.setSize(parseInt(this.fontSizeSlider.value));
    });

    this.fontSelect.addEventListener('change', async () => {
      const font = this.fontSelect.value;
      await this.font.setFont(font);
    });

    this.modeSelect.forEach(radio => {
      radio.addEventListener('change', (e) => {
        let version = parseInt((e.target as HTMLInputElement).value);
        this.font.setVersion(version);
        for(let option of this.options){
          let asciis = option.fx.getAllAsciiFX();
          for(let ascii of asciis){
            ascii.setVersion(version);
          }
        }
      });
    });

    this.invertSelect.addEventListener('change', () => {
      this.font.setInverted(this.invertSelect.checked);
    });
  }
}

export function initializeCanvas(): void {
  const canvas = document.getElementById("canvaselement") as HTMLCanvasElement | null;
  if (canvas === null) throw new Error("Could not find canvas element");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const canvasAnimation : Ascii = new Ascii(canvas);
  canvasAnimation.start();
}

