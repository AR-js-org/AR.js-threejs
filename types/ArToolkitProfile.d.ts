import { IArToolkitProfile, IContextParameters, IDefaultMarkerParameters, ISourceParameters } from './CommonInterfaces/THREEx-interfaces';
declare global {
    var arToolkitProfile: IArToolkitProfile;
}
export declare class ArToolkitProfile implements IArToolkitProfile {
    sourceParameters: ISourceParameters;
    contextParameters: IContextParameters;
    defaultMarkerParameters: IDefaultMarkerParameters;
    constructor();
    reset(): this;
    performance(label: string): this;
    defaultMarker(trackingBackend?: string): this;
    sourceWebcam(): this;
    sourceVideo(url: string): this;
    sourceImage(url: string): this;
    trackingBackend(trackingBackend: string): this;
    changeMatrixMode(changeMatrixMode: string): this;
    trackingMethod(trackingMethod: string): this;
    checkIfValid(): this;
    private _guessPerformanceLabel;
}
