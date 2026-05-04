export let vsText = `
    precision mediump float;

    attribute vec4 aPosition;
    attribute vec4 aOffset;
    attribute vec4 aNorm;
    attribute vec4 aQuat;
    attribute vec3 aColor;
    
    varying vec4 vLightDir;
    varying vec4 vNormal;   
    varying vec3 vColor;

    uniform vec4 uLightPosition;
    uniform mat4 uView;
    uniform mat4 uProj;

    vec3 qtrans(vec4 q, vec3 v) {
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }

    void main () {
        //  Convert vertex to camera coordinates and the NDC
        vec3 rotated = qtrans(aQuat, aPosition.xyz);
        vec4 worldPos = vec4(rotated, aPosition.w);

        gl_Position = uProj * uView * (worldPos + aOffset);

        //  Pass along the vertex normal (world coordinates)
        vNormal = vec4(qtrans(aQuat, aNorm.xyz), aNorm.w);

        //  Compute light direction (world coordinates)
        vLightDir = uLightPosition - (worldPos + aOffset);

        vColor = aColor;
    }
`;
export let fsText = `
    precision mediump float;

    varying vec4 vLightDir;
    varying vec4 vNormal;    
    varying vec3 vColor;

    void main () {
        vec3 color = vColor;
        vec3 light = normalize(vLightDir.xyz);
        vec4 normal = normalize(vNormal);

        float dotProd = max(dot(normal.xyz, light), 0.2);
        gl_FragColor = vec4(color * dotProd, 1.0);
    }
`;
export let defaultfxVSText = `
    attribute vec2 aFxPosition;

    varying vec2 vUV;

    void main() {
        vUV = aFxPosition * 0.5 + 0.5;
        gl_Position = vec4(aFxPosition, 0.0, 1.0);
    }
`;
export let defaultfxFSText = `
    precision mediump float;

    uniform sampler2D uTexture;
    varying vec2 vUV;

    void main() {
        gl_FragColor = texture2D(uTexture, vUV);
    }
`;
export let asciifxFSTextV1 = `
    precision mediump float;

    uniform sampler2D uTexture;
    uniform sampler2D uFontTex; // font texture

    uniform sampler2D uWeights;

    uniform vec2 uResolution;
    uniform vec2 uCharResolution;
    uniform vec2 uTexResolution;

    uniform float uSliderPos;

    varying vec2 vUV;

    int getBestChar(float lum){
        float bestDistance = 1000.0;
        int bestCharIndex = -1;

        for(int i=0; i<95; i++){
            float u  = (float(i) + 0.5) / 95.0;
            float weight = texture2D(uWeights, vec2(u, 0.5)).r;
            
            float dist = 0.0;
            dist += (weight - lum) * (weight - lum);
            
            if(dist < bestDistance){
                bestDistance = dist;
                bestCharIndex = i;
            }
        }

        return bestCharIndex;
    }

    void main() {
        if(vUV.x >= uSliderPos){
            gl_FragColor = texture2D(uTexture, vUV);
        } else {
            vec2 gridCoords = vUV * uResolution / uCharResolution;
            vec2 gridIdx = floor(gridCoords);
            vec2 localUV = fract(gridCoords); // fractional part of coordinates
        
            float avgBlockLuminance = 0.0;

            for(float y=0.0; y<100.0; y++){
                if(y >= uCharResolution.y) break;
                for(float x=0.0; x<100.0; x++){
                    if(x >= uCharResolution.x) break;
                    
                    vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                    vec3 c = texture2D(uTexture, uv).rgb;
                    avgBlockLuminance += dot(c, vec3(0.299, 0.587, 0.114)); // luminance
                }
            }
            avgBlockLuminance = avgBlockLuminance / (uCharResolution.x * uCharResolution.y);
            
            int index = getBestChar(avgBlockLuminance);
            vec4 asciiPixel = texture2D(uFontTex, vec2((float(index) + localUV.x) * uCharResolution.x / uTexResolution.x, localUV.y));
            gl_FragColor = asciiPixel;
        }
    }
`;
export let asciifxFSTextV2 = `
    precision mediump float;

    uniform sampler2D uTexture;
    uniform sampler2D uFontTex; // font texture

    uniform sampler2D uWeights;

    uniform vec2 uResolution;
    uniform vec2 uCharResolution;
    uniform vec2 uTexResolution;

    uniform float uSliderPos;

    varying vec2 vUV;

    int getBestChar(float top, float bot) {
        // given the top and bottom luminances, find the closest weights
        float bestDistance = 1000.0; // idk what big number to use lol
        int bestCharIndex = -1;

        for (int i = 0; i < 95; i++){
            float u  = (float(i) + 0.5) / 95.0;
            vec2 weights = texture2D(uWeights, vec2(u, 0.5)).rg;
            float charBot = weights.r;
            float charTop = weights.g;
            float dist = 0.0;

            dist += (charTop - top) * (charTop - top);
            dist += (charBot - bot) * (charBot - bot);

            if(dist < bestDistance){
                bestDistance = dist;
                bestCharIndex = i;
            }
        }
        return bestCharIndex;
    }

    void main() {
        if(vUV.x >= uSliderPos){
            gl_FragColor = texture2D(uTexture, vUV);
        } else {
            vec2 gridCoords = vUV * uResolution / uCharResolution;
            vec2 gridIdx = floor(gridCoords);
            vec2 localUV = fract(gridCoords); // fractional part of coordinates

            float topLuminance = 0.0;
            float botLuminance = 0.0;

            for(float y=0.0; y<100.0; y++){
                if(y >= uCharResolution.y) break;
                for(float x=0.0; x<100.0; x++){
                    if(x >= uCharResolution.x) break;
                    
                    if(y < uCharResolution.y / 2.0){ // top half of letter
                        vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                        vec3 c = texture2D(uTexture, uv).rgb;
                        topLuminance += dot(c, vec3(0.299, 0.587, 0.114)); 
                    }
                    else { // bottom half of letter
                        vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                        vec3 c = texture2D(uTexture, uv).rgb;
                        botLuminance += dot(c, vec3(0.299, 0.587, 0.114)); 
                    }
                }
            }
            topLuminance = topLuminance / ((uCharResolution.x * uCharResolution.y) / 2.0);
            botLuminance = botLuminance / ((uCharResolution.x * uCharResolution.y) / 2.0);

            int indexWanted = getBestChar(topLuminance, botLuminance);
            vec4 asciiPixel = texture2D(uFontTex, vec2((float(indexWanted) + localUV.x) * (uCharResolution.x / uTexResolution.x), localUV.y));
            gl_FragColor = asciiPixel;
        }
    }
`;
export let asciifxFSTextV3 = `
    precision mediump float;

    uniform sampler2D uTexture;
    uniform sampler2D uFontTex; // font texture

    uniform sampler2D uWeights;

    uniform vec2 uResolution;
    uniform vec2 uCharResolution;
    uniform vec2 uTexResolution;

    uniform float uSliderPos;

    varying vec2 vUV;

    int getBestChar(float topLeft, float topRight, float midLeft, float midRight, float botLeft, float botRight) {
        float bestDistance = 1000.0; // idk what big number to use lol
        int bestCharIndex = -1;

        for (int i = 0; i < 95; i++){
            float u1 = (float(2*i) + 0.5) / 190.0;
            float u2 = (float(2*i + 1) + 0.5) / 190.0;

            vec4 weightVec1 = texture2D(uWeights, vec2(u1, 0.5));
            vec2 weightVec2 = texture2D(uWeights, vec2(u2, 0.5)).rg;

            float charTL = weightVec1.r;
            float charTR = weightVec1.g;
            float charML = weightVec1.b;
            float charMR = weightVec1.a;
            float charBL = weightVec2.r;
            float charBR = weightVec2.g;

            float dist = 0.0;

            dist += (charTL - topLeft) * (charTL - topLeft);
            dist += (charTR - topRight) * (charTR - topRight);
            dist += (charML - midLeft) * (charML - midLeft);
            dist += (charMR - midRight) * (charMR - midRight);
            dist += (charBL - botLeft) * (charBL - botLeft);
            dist += (charBR - botRight) * (charBR - botRight);

            if(dist < bestDistance){
                bestDistance = dist;
                bestCharIndex = i;
            }
        }
        return bestCharIndex;
    }

    void main() {
        if(vUV.x >= uSliderPos){
            gl_FragColor = texture2D(uTexture, vUV);
        } else {
            vec2 gridCoords = vUV * uResolution / uCharResolution;
            vec2 gridIdx = floor(gridCoords);
            vec2 localUV = fract(gridCoords); // fractional part of coordinates
        
            float TL = 0.0;
            float TR = 0.0;
            float ML = 0.0;
            float MR = 0.0;
            float BL = 0.0;
            float BR = 0.0;

            for(float y=0.0; y<100.0; y++){
                if(y >= uCharResolution.y) break;
                for(float x=0.0; x<100.0; x++){
                    if(x >= uCharResolution.x) break;

                    if(y < uCharResolution.y / 3.0){ // bottom third of letter
                        if(x < uCharResolution.x / 2.0){ // left side of letter... questionably 
                            vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                            vec3 c = texture2D(uTexture, uv).rgb;
                            BR += dot(c, vec3(0.299, 0.587, 0.114)); 
                        }
                        else{
                            vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                            vec3 c = texture2D(uTexture, uv).rgb;
                            BL += dot(c, vec3(0.299, 0.587, 0.114)); 
                        }
                    }
                    else if(y < uCharResolution.y / 3.0 * 2.0){ // middle of letter
                        if(x < uCharResolution.x / 2.0){ // left side of letter... questionably 
                            vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                            vec3 c = texture2D(uTexture, uv).rgb;
                            MR += dot(c, vec3(0.299, 0.587, 0.114)); 
                        }
                        else{
                            vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                            vec3 c = texture2D(uTexture, uv).rgb;
                            ML += dot(c, vec3(0.299, 0.587, 0.114)); 
                        }
                    }
                    else { // top half of letter
                        if(x < uCharResolution.x / 2.0){ // left side of letter... questionably 
                            vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                            vec3 c = texture2D(uTexture, uv).rgb;
                            TR += dot(c, vec3(0.299, 0.587, 0.114)); 
                        }
                        else{
                            vec2 uv = (gridIdx * vec2(uCharResolution.x, uCharResolution.y) + vec2(x, y) + 0.5) / uResolution;
                            vec3 c = texture2D(uTexture, uv).rgb;
                            TL += dot(c, vec3(0.299, 0.587, 0.114)); 
                        }
                    }
                }
            }

            TL = min(TL * 1.25 / ((uCharResolution.x * uCharResolution.y) / 6.0), 1.0);
            TR = min(TR * 1.25 / ((uCharResolution.x * uCharResolution.y) / 6.0), 1.0);
            ML = min(ML * 1.25 / ((uCharResolution.x * uCharResolution.y) / 6.0), 1.0);
            MR = min(MR * 1.25 / ((uCharResolution.x * uCharResolution.y) / 6.0), 1.0);
            BL = min(BL * 1.25 / ((uCharResolution.x * uCharResolution.y) / 6.0), 1.0);
            BR = min(BR * 1.25 / ((uCharResolution.x * uCharResolution.y) / 6.0), 1.0);
            
            int indexWanted = getBestChar(TL, TR, ML, MR, BL, BR);
            vec4 asciiPixel = texture2D(uFontTex, vec2((float(indexWanted) + localUV.x) * (uCharResolution.x / uTexResolution.x), localUV.y));
            gl_FragColor = asciiPixel;
        }
    }
`;
export let sliderfxFSText = `
    precision mediump float;

    uniform sampler2D uTexture;
    uniform float uSliderPos;

    varying vec2 vUV;

    void main() {
        if(vUV.x > uSliderPos - 0.0005 && vUV.x < uSliderPos + 0.0005){
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        } else {
            // default behavior
            gl_FragColor = texture2D(uTexture, vUV);
        }
    }
`;
//# sourceMappingURL=Shaders.js.map