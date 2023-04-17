import * as THREE from "three";
import { ArBaseControls } from "../ArBaseControls";
import { IArMarkerControls, IArMarkerAreaControlsParameters } from "../CommonInterfaces/THREEx-interfaces";
export declare class MarkersAreaControls extends ArBaseControls {
    subMarkersControls: IArMarkerControls[];
    subMarkerPoses: THREE.Matrix4[];
    parameters: IArMarkerAreaControlsParameters;
    constructor(arToolkitContext: any, object3d: THREE.Object3D, parameters: any);
    _onSourceProcessed(): void;
    update(): void;
    name(): string;
    static averageQuaternion(quaternionSum: any, newQuaternion: any, firstQuaternion: any, count: any, quaternionAverage: any): any;
    static averageVector3(vector3Sum: any, vector3: any, count: any, vector3Average: any): any;
    static computeCenter(jsonData: any): THREE.Matrix4;
    static computeBoundingBox(jsonData: any): THREE.Box3;
    updateSmoothedControls(smoothedControls: any, lerpsValues: any): void;
    static fromJSON(arToolkitContext: any, parent3D: any, markerRoot: any, jsonData: any, parameters?: any): MarkersAreaControls;
}
