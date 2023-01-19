export interface IContextParameters {
    canvasWidth: number;
    canvasHeight: number;
    debug: boolean;
    cameraParametersUrl: string;
    detectionMode: string;
    maxDetectionRate: number;
    matrixCodeType: string;
    patternRatio: number;
    trackingBackend: string;
    imageSmoothingEnabled: boolean;
}
export interface IDefaultMarkerParameters {
    type: string;
    patternUrl: string;
    changeMatrixMode: string;
    markersAreaEnabled: string;
}
export interface ISourceParameters {
    sourceType: string;
    sourceUrl?: string;
}
