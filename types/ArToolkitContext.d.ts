import * as THREE from 'three';
import { IContextParameters } from './CommonInterfaces/THREEx-interfaces';
export declare class ArToolkitContext {
    static baseURL: string;
    private _updatedAt;
    parameters: IContextParameters;
    arController: any;
    private initialized;
    private _arMarkersControls;
    constructor(parameters: any);
    createDefaultCamera(trackingBackend: string): THREE.Camera;
    private setParameters;
}
