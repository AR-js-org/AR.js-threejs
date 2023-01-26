import { IArToolkitSource, IArToolkitContext, ISourceParameters } from "./CommonInterfaces/THREEx-interfaces";
import { Renderer, Camera } from 'three';
declare global {
    var arToolkitSource: IArToolkitSource;
}
export declare class ArToolkitSource implements IArToolkitSource {
    ready: boolean;
    domElement: any;
    parameters: ISourceParameters;
    private className;
    constructor(parameters: ISourceParameters);
    init(onReady: Function, onError: Function): this;
    domElementWidth(): number;
    domElementHeight(): number;
    onResizeElement(): void;
    copyElementSizeTo(otherElement: any): void;
    copySizeTo(): void;
    onResize(arToolkitContext: IArToolkitContext, renderer: Renderer, camera: Camera): void;
    private onInitialClick;
    private _initSourceImage;
    private _initSourceVideo;
    private _initSourceWebcam;
}
