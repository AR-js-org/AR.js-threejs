import { ISourceParameters } from "./CommonInterfaces/THREEx-interfaces";
export declare class ArToolkitSource {
    ready: boolean;
    domElement: HTMLImageElement | HTMLVideoElement;
    parameters: ISourceParameters;
    constructor(parameters: any);
    private onInitialClick;
    init(onReady: any, onError: any): this;
    private _initSourceImage;
    private _initSourceVideo;
    private _initSourceWebcam;
    private setParameters;
    domElementWidth(): number;
    domElementHeight(): number;
    onResizeElement(): void;
    copyElementSizeTo(otherElement: any): void;
    copySizeTo(): void;
    onResize(arToolkitContext: any, renderer: any, camera: any): void;
}
