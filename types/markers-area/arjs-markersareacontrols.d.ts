import { Box3, Matrix4, Object3D } from "three";
import { ArBaseControls } from "../ArBaseControls";
import { IArToolkitContext, IArMarkerAreaControlsParameters, ISubMarkerControls } from "../CommonInterfaces/THREEx-interfaces";
export declare class MarkersAreaControls extends ArBaseControls {
    subMarkersControls: ISubMarkerControls[];
    subMarkerPoses: Matrix4[];
    parameters: IArMarkerAreaControlsParameters;
    constructor(arToolkitContext: IArToolkitContext, object3d: Object3D, parameters: IArMarkerAreaControlsParameters);
    _onSourceProcessed(): void;
    update(): void;
    name(): string;
    static averageQuaternion(quaternionSum: any, newQuaternion: any, firstQuaternion: any, count: any, quaternionAverage: any): any;
    static averageVector3(vector3Sum: any, vector3: any, count: any, vector3Average: any): any;
    static computeCenter(jsonData: any): Matrix4;
    static computeBoundingBox(jsonData: any): Box3;
    updateSmoothedControls(smoothedControls: any, lerpsValues: any): void;
    static fromJSON(arToolkitContext: any, parent3D: any, markerRoot: any, jsonData: string, parameters?: IArMarkerAreaControlsParameters): any;
}
