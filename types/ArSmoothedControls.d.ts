import { ArBaseControls } from "./ArBaseControls";
import { ISmoothedControlsParameters, IArSmoothedControls } from "./CommonInterfaces/THREEx-interfaces";
import { Object3D } from "three";
export declare class ArSmoothedControls extends ArBaseControls implements IArSmoothedControls {
    private _lastLerpStepAt;
    private _visibleStartedAt;
    private _unvisibleStartedAt;
    parameters: ISmoothedControlsParameters;
    constructor(object3d: Object3D, parameters?: ISmoothedControlsParameters);
    update(targetObject3d: Object3D): void;
    name(): string;
}
