import { ArBaseControls } from "./ArBaseControls";
import { Object3D } from "three";
export declare class ArMarkerControls extends ArBaseControls {
    private context;
    private parameters;
    private smoothMatrices;
    private onGetMarker;
    constructor(context: any, object3d: Object3D, parameters: any);
    dispose(): void;
    updateWithModelViewMatrix(modelViewMatrix: any): boolean;
    name(): string;
    _initArtoolkit(): void;
}
