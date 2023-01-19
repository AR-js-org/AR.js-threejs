import { IContextParameters, IDefaultMarkerParameters, ISourceParameters } from './CommonInterfaces/THREEx-interfaces'
import { ArToolkitContext } from './ArToolkitContext'
import { Utils } from './new-api/Utils'

//namespace THREEx {
export class ArToolkitProfile {
    sourceParameters: ISourceParameters;
    contextParameters: IContextParameters;
    defaultMarkerParameters: IDefaultMarkerParameters;

    constructor() {
        this.reset()

        this.performance('default')
    }

    reset() {
        this.sourceParameters.sourceType = 'webcam'

        this.contextParameters.cameraParametersUrl = ArToolkitContext.baseURL + '../data/data/camera_para.dat';
        this.contextParameters.detectionMode = 'mono';

        this.defaultMarkerParameters.type = 'pattern';
        this.defaultMarkerParameters.patternUrl = ArToolkitContext.baseURL + '../data/data/patt.hiro';
        this.defaultMarkerParameters.changeMatrixMode = 'modelViewMatrix';

        return this
    };

    performance(label: string) {

        if (label === 'default') {
            label = this._guessPerformanceLabel()
        }

        if (label === 'desktop-fast') {
            this.contextParameters.canvasWidth = 640 * 3
            this.contextParameters.canvasHeight = 480 * 3

            this.contextParameters.maxDetectionRate = 30
        } else if (label === 'desktop-normal') {
            this.contextParameters.canvasWidth = 640
            this.contextParameters.canvasHeight = 480

            this.contextParameters.maxDetectionRate = 60
        } else if (label === 'phone-normal') {
            this.contextParameters.canvasWidth = 80 * 4
            this.contextParameters.canvasHeight = 60 * 4

            this.contextParameters.maxDetectionRate = 30
        } else if (label === 'phone-slow') {
            this.contextParameters.canvasWidth = 80 * 3
            this.contextParameters.canvasHeight = 60 * 3

            this.contextParameters.maxDetectionRate = 30
        } else {
            console.assert(false, 'unknonwn label ' + label)
        }
        return this
    }

    defaultMarker(trackingBackend: string) {
        this.trackingBackend(trackingBackend || this.contextParameters.trackingBackend);

        if (trackingBackend === 'artoolkit') {
            this.contextParameters.detectionMode = 'mono'
            this.defaultMarkerParameters.type = 'pattern'
            this.defaultMarkerParameters.patternUrl = ArToolkitContext.baseURL + '../data/data/patt.hiro'
        } else console.assert(false)

        return this
    }

    sourceWebcam() {
        this.sourceParameters.sourceType = 'webcam'
        delete this.sourceParameters.sourceUrl
        return this
    }

    sourceVideo(url: string) {
        this.sourceParameters.sourceType = 'video'
        this.sourceParameters.sourceUrl = url
        return this
    }

    sourceImage(url: string) {
        this.sourceParameters.sourceType = 'image'
        this.sourceParameters.sourceUrl = url
        return this
    }

    trackingBackend(trackingBackend: string) {
        console.warn('stop profile.trackingBackend() obsolete function. use .trackingMethod instead')
        this.contextParameters.trackingBackend = trackingBackend
        return this
    }

    changeMatrixMode(changeMatrixMode: string) {
        this.defaultMarkerParameters.changeMatrixMode = changeMatrixMode
        return this
    }

    trackingMethod(trackingMethod: string) {
        /// to be fixed Utils not yet implemented...
        var data = Utils.parseTrackingMethod(trackingMethod)

        this.defaultMarkerParameters.markersAreaEnabled = data.markersAreaEnabled
        this.contextParameters.trackingBackend = data.trackingBackend
        return this
    }

    /**
     * check if the profile is valid. Throw an exception is not valid
     */
    checkIfValid() {
        return this
    }

    private _guessPerformanceLabel(): string {
        var isMobile = navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
            ? true : false
        if (isMobile === true) {
            return 'phone-normal'
        }
        return 'desktop-normal'
    }
}
//}
