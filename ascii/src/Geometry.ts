import { Vec3, Vec4, Quat } from "./lib/TSM.js";

export abstract class Geometry {
  protected numVertices: number = 0;
  protected numTriangles: number = 0;

  protected positions: Float32Array = new Float32Array(0);
  protected normals: Float32Array = new Float32Array(0);
  protected indices: Uint32Array = new Uint32Array(0);

  protected translation: Vec3 = new Vec3([0, 0, 0]);
  protected rotation: Quat = Quat.identity.copy();
  protected color: Vec3 = new Vec3([0, 0, 0]);

  protected centroid: Vec3 = new Vec3([0, 0, 0]);

  protected isDirty: boolean;

  constructor(numVertices: number, numTriangles: number, translation: Vec3, rotation: Quat, color: Vec3){
    this.numVertices = numVertices;
    this.numTriangles = numTriangles;
    this.positions = new Float32Array(4 * numVertices);
    this.normals = new Float32Array(4 * numVertices);
    this.indices = new Uint32Array(3 * this.numTriangles);

    this.translation = translation;
    this.rotation = rotation;
    this.color = color;

    this.isDirty = true;
  }

  public getNumVertices(): number{
    return this.numVertices;
  }
  public getNumTriangles(): number{
    return this.numTriangles;
  }
  public getPositions(): Float32Array{
    return this.positions;
  }
  public getNormals(): Float32Array{
    return this.normals;
  }
  public getColor(): Vec3{
    return this.color;
  }
  public getIndices(): Uint32Array{
    return this.indices;
  }

  public getTranslation(): Vec3{
    return this.translation;
  }
  public getRotation(): Quat{
    return this.rotation;
  }
  public getLocalCentroid(): Vec3{
    return this.centroid;
  }
  public getWorldSpaceCentroid(): Vec3{
    return this.centroid.copy().add(this.translation);
  }

  protected computeLocalCentroid(): void{
    const n = this.numVertices;
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;

    for(let i=0; i<this.numVertices; i++){
      xSum += this.positions[i*4 + 0];
      ySum += this.positions[i*4 + 1];
      zSum += this.positions[i*4 + 2];
    }

    this.centroid = new Vec3([xSum/n, ySum/n, zSum/n]);
  }

  // Transformations

  // axis in local coordinates, angle in radians
  public rotate(axis: Vec3, angle: number): void{
    const rotQuat = Quat.fromAxisAngle(axis, angle)
    this.rotation = Quat.product(rotQuat, this.rotation);
    this.isDirty = true;
  }
  
  public translate(t: Vec3): void{
    this.translation.add(new Vec3([t.x, t.y, t.z]));
    this.isDirty = true;
  }

  public setTranslation(t: Vec3): void{
    const trans = t.copy();
    this.translation = new Vec3([trans.x, trans.y, trans.z]);
    this.isDirty = true;
  }

  public setClean(): void{
    this.isDirty = false;
  }

  public getDirty(): boolean{
    return this.isDirty;
  }
} 

export class CubeGeometry extends Geometry {
  private size: number;

  constructor(size: number, translation: Vec3, rotation: Quat, color: Vec3){
    super(24, 12, translation, rotation, color);
    this.size = size;

    this.positions = new Float32Array([
      -size/2.0, -size/2.0, -size/2.0, 1.0,
      -size/2.0, -size/2.0, -size/2.0, 1.0,
      -size/2.0, -size/2.0, -size/2.0, 1.0,

      -size/2.0, -size/2.0, size/2.0, 1.0,
      -size/2.0, -size/2.0, size/2.0, 1.0,
      -size/2.0, -size/2.0, size/2.0, 1.0,

      -size/2.0, size/2.0, -size/2.0, 1.0,
      -size/2.0, size/2.0, -size/2.0, 1.0,
      -size/2.0, size/2.0, -size/2.0, 1.0,

      -size/2.0, size/2.0, size/2.0, 1.0,
      -size/2.0, size/2.0, size/2.0, 1.0,
      -size/2.0, size/2.0, size/2.0, 1.0,

      size/2.0, -size/2.0, -size/2.0, 1.0,
      size/2.0, -size/2.0, -size/2.0, 1.0,
      size/2.0, -size/2.0, -size/2.0, 1.0,

      size/2.0, -size/2.0, size/2.0, 1.0,
      size/2.0, -size/2.0, size/2.0, 1.0,
      size/2.0, -size/2.0, size/2.0, 1.0,

      size/2.0, size/2.0, -size/2.0, 1.0,
      size/2.0, size/2.0, -size/2.0, 1.0,
      size/2.0, size/2.0, -size/2.0, 1.0,
      
      size/2.0, size/2.0, size/2.0, 1.0,
      size/2.0, size/2.0, size/2.0, 1.0,
      size/2.0, size/2.0, size/2.0, 1.0
    ]);

    this.normals = new Float32Array([
      -1.0, 0.0, 0.0, 0.0,
      0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0,

      -1.0, 0.0, 0.0, 0.0,
      0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,

      -1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0,

      -1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,

      1.0, 0.0, 0.0, 0.0,
      0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0,

      1.0, 0.0, 0.0, 0.0,
      0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,

      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0,

      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0
    ]);

    this.indices = new Uint32Array([
        // face A
        0, 6, 9,
        0, 9, 3,

        // face B
        12, 15, 21,
        12, 21, 18,

        // face C
        1, 4, 16,
        1, 16, 13,

        // face D
        7, 19, 22,
        7, 22, 10,

        // face E
        2, 14, 20,
        2, 20, 8,

        // face F
        5, 11, 23,
        5, 23, 17
    ]);

    this.computeLocalCentroid();
  }
}

export class ConeGeometry extends Geometry{
  private radius: number;
  private height: number;
  private numDivisions: number;

  constructor(radius: number, height: number, numDivisions: number, translation: Vec3, rotation: Quat, color: Vec3){
    super(
      1 + numDivisions * 3,
      numDivisions * 2,
      translation,
      rotation,
      color
    )

    this.radius = radius;
    this.height = height;
    this.numDivisions = numDivisions;

    let positions: number[] = [
      0.0, 0.0, 0.0, 1.0
    ];

    let normals: number[] = [
      0.0, -1.0, 0.0, 0.0
    ];

    let indices: number[] = [];

    const slantLen: number = Math.sqrt(height*height + radius*radius);
    
    for(let i=0; i<numDivisions; i++){
      // For each division, generate two vertices for the edge of the circle (one per normal) and one vertex for the top
      const radians = 2*Math.PI/numDivisions * i;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);

      positions = positions.concat([
        cos * this.radius, 0.0, sin * this.radius, 1.0,
        cos * this.radius, 0.0, sin * this.radius, 1.0,
        0.0, height, 0.0, 1.0
      ]);

      const sideNX = (cos * height) / slantLen;
      const sideNY = radius / slantLen;
      const sideNZ = (sin * height) / slantLen;

      normals = normals.concat([
        0.0, -1.0, 0.0, 0.0,
        sideNX, sideNY, sideNZ, 0.0,
        sideNX, sideNY, sideNZ, 0.0,
      ]);

      const next = (i+1)%numDivisions;
      indices = indices.concat([
        0, 1 + i*3, 1 + next*3,

        1 + i*3 + 1,
        1 + next*3 + 1,
        1 + i*3 + 2
      ]);
    }

    this.positions = new Float32Array(positions);
    this.normals = new Float32Array(normals);
    this.indices = new Uint32Array(indices);

    this.computeLocalCentroid();
  }
}

export class SphereGeometry extends Geometry {
  private radius: number;
  private numStacks: number;
  private numSlices: number;

  constructor(radius: number, numStacks: number, numSlices: number, translation: Vec3, rotation: Quat, color: Vec3){
    super(
      (numSlices+1) * (numStacks+1),
      2 * numSlices * numStacks,
      translation,
      rotation,
      color
    );

    this.radius = radius;
    this.numStacks = numStacks;
    this.numSlices = numSlices;

    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for(let i=0; i<=numStacks; i++){
      const tau = Math.PI / numStacks * i;
      const tauCos = Math.cos(tau);
      const tauSin = Math.sin(tau);

      for(let j=0; j<=numSlices; j++){
        const phi = 2 * Math.PI / numSlices * j;

        const phiCos = Math.cos(phi);
        const phiSin = Math.sin(phi);

        const nx = phiCos * tauSin;
        const ny = tauCos;
        const nz = phiSin * tauSin;

        positions.push(radius * nx, radius * ny, radius * nz, 1.0);
        normals.push(nx, ny, nz, 0.0);
      }
    }

    for(let i=0; i<numStacks; i++){
      for(let j=0; j<numSlices; j++){
        const tl = j + i*(numSlices+1);
        const tr = j + i*(numSlices+1) + 1;
        const bl = j + (i+1)*(numSlices+1);
        const br = j + (i+1)*(numSlices+1) + 1;

        // indices.push(tl, tr, bl);
        // indices.push(tr, br, bl);
        indices.push(bl, tr, tl);
        indices.push(bl, br, tr);
      }
    }

    this.positions = new Float32Array(positions);
    this.normals = new Float32Array(normals);
    this.indices = new Uint32Array(indices);

    this.computeLocalCentroid();
  }
}
