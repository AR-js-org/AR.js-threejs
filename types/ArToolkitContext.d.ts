import * as THREE from 'three';
import { IContextParameters } from './CommonInterfaces/THREEx-interfaces';
import jsartoolkit from "@ar-js-org/artoolkit5-js";
declare const ARController: typeof jsartoolkit.ARController;
export declare class ArToolkitContext {
    static baseURL: string;
    private _updatedAt;
    parameters: IContextParameters;
    arController: typeof ARController;
    private initialized;
    private _arMarkersControls;
    private _artoolkitProjectionAxisTransformMatrix;
    constructor(parameters: any);
    dispatchEvent: (event: any) => void;
    addEventListener: <T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>) => void;
    hasEventListener: <T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>) => boolean;
    removeEventListener: <T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>) => void;
    createDefaultCamera(trackingBackend: string): THREE.Camera;
    init(onCompleted: any): void;
    update(srcElement: any): boolean;
    private _initArtoolkit;
    getProjectionMatrix(): THREE.Matrix4;
    _updateArtoolkit(srcElement: any): void;
    private setParameters;
}
export {};
