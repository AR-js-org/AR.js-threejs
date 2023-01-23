import { Renderer, Camera, Matrix4 } from "three";
export interface IArBaseControls {
    update(): void;
    name(): string;
}

export interface IArToolkitContext{
    parameters: IContextParameters;
    arController: any;
    dispatchEvent(event: any): void;
    addEventListener<T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>): void;
    hasEventListener<T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>): boolean;
    removeEventListener<T extends any>(type: T, listener: THREE.EventListener<any, T, THREE.EventDispatcher<any>>): void;
    createDefaultCamera(trackingBackend: string): void;
    init(onCompleted: Function): void;
    update(srcElement: HTMLImageElement | HTMLVideoElement): void;
    addMarker(arMarkerControls: any): void;
    removeMarker(arMarkerControls: any): void
    getProjectionMatrix(): Matrix4;
}

export interface IArToolkitProfile {
    sourceParameters: ISourceParameters;
    contextParameters: IContextParameters;
    defaultMarkerParameters: IDefaultMarkerParameters;
    reset(): void;
    performance(label: string): void;
    defaultMarker(trackingBackend: string): void;
    sourceWebcam(): this;
    sourceVideo(url: string): this;
    sourceImage(url: string): this;
    trackingBackend(trackingBackend: string): void;
    changeMatrixMode(changeMatrixMode: string): void;
    trackingMethod(trackingMethod: string): void;
    checkIfValid(): void;
}

export interface IArToolkitSource {
    ready: boolean;
    domElement: HTMLImageElement | HTMLVideoElement;
    parameters: ISourceParameters;
    init(onReady: Function, onError: Function): this;
    domElementWidth(): number;
    domElementHeight(): number;
    onResizeElement(): void;
    copyElementSizeTo(otherElement: any): void;
    copySizeTo(): void;
    onResize(arToolkitContext: IArToolkitContext, renderer: Renderer, camera: Camera): void;
}

export interface IContextParameters {
    canvasWidth: number,
    canvasHeight: number,
    debug: boolean,
    cameraParametersUrl: string,
    detectionMode: string,
    maxDetectionRate: number,
    matrixCodeType: string,
    patternRatio: number,
    labelingMode: string,
    trackingBackend: string,
    imageSmoothingEnabled: boolean
}

export interface IDefaultMarkerParameters {
    type: string,
    patternUrl: string,
    changeMatrixMode: string,
    markersAreaEnabled: boolean
}

export interface ISourceParameters {
    sourceType: string,
    sourceUrl: string,
    deviceId: string,
    sourceWidth: number,
    sourceHeight: number,
    displayWidth: number,
    displayHeight: number
}

export interface IUserMediaConstraints {
    audio: boolean
    video: {
        width: {
            min?: number,
            max?: number,
            ideal: number
        },
        height:  {
            min?: number,
            max?: number,
            ideal: number
        },
        facingMode: string,
        deviceId: {
            exact: string
        }
    }

}