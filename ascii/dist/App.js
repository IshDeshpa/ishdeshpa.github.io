var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShapeAnimation, SpaceAnimation, VideoAnimation } from "./Animation.js";
import { Artist } from "./Artist.js";
import { AsciiProgram, SliderProgram } from "./Program.js";
import { Font } from "./Font.js";
class Ascii extends Artist {
    constructor(canvas) {
        super(canvas);
        this.dragging = false;
        this.sliderPos = 10;
        this.font = new Font(this.gl, 1, 10);
        this.options = [
            new ShapeAnimation(this.gl, this.extVAO, [
                new AsciiProgram(this.gl, this.extVAO, 1, () => this.sliderPos, this.font),
                new SliderProgram(this.gl, this.extVAO, () => this.sliderPos)
            ]),
            new SpaceAnimation(this.gl, this.extVAO, [
                new AsciiProgram(this.gl, this.extVAO, 1, () => this.sliderPos, this.font),
                new SliderProgram(this.gl, this.extVAO, () => this.sliderPos)
            ]),
            new VideoAnimation(this.gl, this.extVAO, [
                new AsciiProgram(this.gl, this.extVAO, 1, () => this.sliderPos, this.font),
                new SliderProgram(this.gl, this.extVAO, () => this.sliderPos)
            ])
        ];
        this.loadedAnimation = this.options[0];
        this.init();
    }
    init() {
        this.fontSizeSlider = document.getElementById("fontSize");
        this.fontSelect = document.getElementById("fontSelect");
        this.modeSelect = document.querySelectorAll('input[name="mode"]');
        this.invertSelect = document.getElementById("inverted");
        this.registerEventListeners();
        this.loadedAnimation.init();
    }
    reset() {
        this.init();
    }
    draw() {
        this.loadedAnimation.draw();
    }
    load(option) {
        this.loadedAnimation = this.options[option];
    }
    onKeydown(key) {
        this.loadedAnimation.onKeydown(key);
        switch (key.code) {
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
            case "Equal": {
                this.fontSizeSlider.value = String(parseInt(this.fontSizeSlider.value) + 1);
                this.fontSizeSlider.dispatchEvent(new Event("input"));
                break;
            }
            case "Minus": {
                this.fontSizeSlider.value = String(parseInt(this.fontSizeSlider.value) - 1);
                this.fontSizeSlider.dispatchEvent(new Event("input"));
                break;
            }
        }
    }
    dragStart(mouse) {
        if (mouse.x < this.sliderPos + 10 && mouse.x > this.sliderPos - 10) {
            this.dragging = true;
        }
    }
    drag(mouse) {
        if (this.dragging && mouse.x < this.gl.drawingBufferWidth - 10 && mouse.x > 10) {
            this.sliderPos = mouse.x;
        }
    }
    dragEnd(mouse) {
        this.dragging = false;
    }
    registerEventListeners() {
        const canvas = this.canvas;
        /* Event listener for key controls */
        window.addEventListener("keydown", (key) => this.onKeydown(key));
        document.addEventListener("mousedown", (mouse) => this.dragStart(mouse));
        canvas.addEventListener("mousemove", (mouse) => this.drag(mouse));
        document.addEventListener("mouseup", (mouse) => this.dragEnd(mouse));
        /* Event listener to stop the right click menu */
        canvas.addEventListener("contextmenu", (event) => event.preventDefault());
        this.fontSizeSlider.addEventListener("input", (ev) => {
            this.font.setSize(parseInt(this.fontSizeSlider.value));
        });
        this.fontSelect.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
            const font = this.fontSelect.value;
            yield this.font.setFont(font);
        }));
        this.modeSelect.forEach(radio => {
            radio.addEventListener('change', (e) => {
                let version = parseInt(e.target.value);
                this.font.setVersion(version);
                for (let option of this.options) {
                    let asciis = option.fx.getAllAsciiFX();
                    for (let ascii of asciis) {
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
export function initializeCanvas() {
    const canvas = document.getElementById("canvaselement");
    if (canvas === null)
        throw new Error("Could not find canvas element");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasAnimation = new Ascii(canvas);
    canvasAnimation.start();
}
//# sourceMappingURL=App.js.map