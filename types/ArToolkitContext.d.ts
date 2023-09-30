import { EventDispatcher, EventListener, PerspectiveCamera, Matrix4 } from 'three';
import { IArToolkitContext, IContextParameters } from './CommonInterfaces/THREEx-interfaces';
import { ArMarkerControls } from "./ArMarkerControls";
declare global {
    var arToolkitContext: IArToolkitContext;
}
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
    addEventListener: <T extends any>(type: T, listener: EventListener<any, T, EventDispatcher<any>>) => void;
    hasEventListener: <T extends any>(type: T, listener: EventListener<any, T, EventDispatcher<any>>) => boolean;
    removeEventListener: <T extends any>(type: T, listener: EventListener<any, T, EventDispatcher<any>>) => void;
    static baseURL: string;
    static REVISION: string;
    createDefaultCamera(trackingBackend: string): PerspectiveCamera;
    init(onCompleted: Function): void;
    update(srcElement: HTMLImageElement | HTMLVideoElement): boolean;
    addMarker(arMarkerControls: ArMarkerControls): void;
    removeMarker(arMarkerControls: ArMarkerControls): void;
    private _initArtoolkit;
    getProjectionMatrix(): Matrix4;
    private _updateArtoolkit;
}
