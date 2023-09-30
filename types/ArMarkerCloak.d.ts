import { Matrix4 } from "three";
export declare class ArMarkerCloak {
    static vertexShader: string;
    static fragmentShader: string;
    static markerSpaceShaderFunction: string;
    object3d: any;
    private orthoMesh;
    private cloakMesh;
    private originalsFaceVertexUvs;
    private originalOrthoVertices;
    private updateInShaderEnabled;
    constructor(videoTexture: Uint8ClampedArray);
    private updateUvs;
    private updateOrtho;
    update(modelViewMatrix: Matrix4, cameraProjectionMatrix: Matrix4): void;
}
