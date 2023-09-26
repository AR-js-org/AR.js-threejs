import { ArBaseControls } from "./ArBaseControls";
import { Matrix4, Object3D } from "three";
import { IArMarkerControls, IArMarkerControlsParameters, IArToolkitContext } from "./CommonInterfaces/THREEx-interfaces";
declare global {
    var arMarkerControls: IArMarkerControls;
}
export declare class ArMarkerControls extends ArBaseControls implements IArMarkerControls {
    private context;
    parameters: IArMarkerControlsParameters;
    private smoothMatrices;
    private onGetMarker;
    private className;
    object3d: Object3D;
    constructor(context: IArToolkitContext, object3d: Object3D, parameters: IArMarkerControlsParameters);
    dispose(): void;
    updateWithModelViewMatrix(modelViewMatrix: Matrix4): boolean;
    update(object3d: Object3D): void;
    name(): string;
    private _initArtoolkit;
}
