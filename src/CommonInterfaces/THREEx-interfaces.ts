export interface IContextParameters {
    canvasWidth: number,
    canvasHeight: number,
    debug: boolean,
    cameraParametersUrl: string,
    detectionMode: string,
    maxDetectionRate: number,
    matrixCodeType: string,
    patternRatio: number,
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