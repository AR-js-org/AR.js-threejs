import * as THREE from 'three';
import { IArToolkitContext, IContextParameters } from './CommonInterfaces/THREEx-interfaces';
import { ArMarkerControls } from "./ArMarkerControls";
export declare class ArToolkitContext implements IArToolkitContext {
    private _updatedAt;
    parameters: IContextParameters;
    arController: any;
    private initialized;
    private _arMarkersControls;
    _artoolkitProjectionAxisTransformMatrix: any;
    private className;
    constructor(parameters: IContextParameters);
    dispatchEvent: (event: any) => void;
    addEventListener: <T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>) => void;
    hasEventListener: <T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>) => boolean;
    removeEventListener: <T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>) => void;
    static baseURL: string;
    static REVISION: string;
    createDefaultCamera(trackingBackend: string): THREE.Camera;
    init(onCompleted: Function): void;
    update(srcElement: HTMLImageElement | HTMLVideoElement): boolean;
    addMarker(arMarkerControls: ArMarkerControls): void;
    removeMarker(arMarkerControls: ArMarkerControls): void;
    private _initArtoolkit;
    getProjectionMatrix(): THREE.Matrix4;
    private _updateArtoolkit;
}
