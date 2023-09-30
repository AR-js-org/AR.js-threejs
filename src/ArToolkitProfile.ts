import { IArToolkitProfile, IContextParameters, IDefaultMarkerParameters, ISourceParameters } from './CommonInterfaces/THREEx-interfaces'
import { ArToolkitContext } from './ArToolkitContext'
import { Utils } from './new-api/Utils'

declare global {
    var arToolkitProfile: IArToolkitProfile;
}
/**
 * ArToolkitProfile set the basic parameters to init the ARjs app:
 * sourceParameters, contextParameters and defaultMarkerParameters.
 * @class ArToolkitProfile
 */
export class ArToolkitProfile implements IArToolkitProfile {
    sourceParameters: ISourceParameters;
    contextParameters: IContextParameters;
    defaultMarkerParameters: IDefaultMarkerParameters;

    /**
     * The default ArToolkitProfile constructor. It reset to default parameters.
     * See the reset and performace function.
     * @constructor
     */
    constructor() {
        this.sourceParameters = {} as ISourceParameters;
        this.contextParameters = {} as IContextParameters;
        this.defaultMarkerParameters = {} as IDefaultMarkerParameters;

        this.reset()

        this.performance('default')
    }

    /**
     * Used internally by the class when an new instance is created. It reset to default parameters. 
     * @returns {this} this
     */
    reset(): this {
        this.sourceParameters.sourceType = 'webcam'

        this.contextParameters.cameraParametersUrl = ArToolkitContext.baseURL + '../data/data/camera_para.dat';
        this.contextParameters.detectionMode = 'mono';
        this.contextParameters.trackingBackend = 'artoolkit';

        this.defaultMarkerParameters.type = 'pattern';
        this.defaultMarkerParameters.patternUrl = ArToolkitContext.baseURL + '../data/data/patt.hiro';
        this.defaultMarkerParameters.changeMatrixMode = 'modelViewMatrix';

        return this
    };

    /**
     * Set canvasWidth and canvasHeight contextParameters based on the type of device.
     * @param {string} label 
     * @returns {this} this
     */
    performance(label: string): this {

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

    /**
     * Set defaults marker parameters using artoolkit as backend. 
     * It set detectionMode (mono), the type of marker (pattern) and the url of the pattern.
     * @param trackingBackend 
     * @returns this
     */
    defaultMarker(trackingBackend?: string): this {
        var _trackingBackend = trackingBackend || this.contextParameters.trackingBackend;

        if (_trackingBackend === 'artoolkit') {
            this.contextParameters.detectionMode = 'mono'
            this.defaultMarkerParameters.type = 'pattern'
            this.defaultMarkerParameters.patternUrl = ArToolkitContext.baseURL + '../data/data/patt.hiro'
        } else console.assert(false)

        return this
    }

    /**
     * Set the source parameter type to webcam.
     * @returns this
     */
    sourceWebcam(): this {
        this.sourceParameters.sourceType = 'webcam'
        delete this.sourceParameters.sourceUrl
        return this
    }

    /**
     * Set the source parameter type to video. 
     * You must provide a valid video url.
     * @param {string} url 
     * @returns this
     */
    sourceVideo(url: string): this {
        this.sourceParameters.sourceType = 'video'
        this.sourceParameters.sourceUrl = url
        return this
    }

    /**
     * Set the source parameter type to Image. 
     * You must provide a valid Image url.
     * @param {string} url 
     * @returns this
     */
    sourceImage(url: string): this {
        this.sourceParameters.sourceType = 'image'
        this.sourceParameters.sourceUrl = url
        return this
    }

    /**
     * Set the context tracking backend parameter.
     * This is an obsolete function use trackingMethod() instead.
     * @param {string} trackingBackend 
     * @returns 
     */
    trackingBackend(trackingBackend: string): this {
        console.warn('stop profile.trackingBackend() obsolete function. use .trackingMethod instead')
        this.contextParameters.trackingBackend = trackingBackend
        return this
    }

    /**
     * This change the changeMatrixMode parameter: It can be modelViewMatrix or cameraTransformMatrix.
     * @param {string} changeMatrixMode 
     * @returns this
     */
    changeMatrixMode(changeMatrixMode: string): this {
        this.defaultMarkerParameters.changeMatrixMode = changeMatrixMode
        return this
    }

    /**
     * Set the trackingBackend and the makersAreaEnabled params.
     * @param {string} trackingMethod 
     * @returns 
     */
    trackingMethod(trackingMethod: string): this {
        var data = Utils.parseTrackingMethod(trackingMethod)

        this.defaultMarkerParameters.markersAreaEnabled = data.markersAreaEnabled
        this.contextParameters.trackingBackend = data.trackingBackend
        return this
    }

    /**
     * check if the profile is valid. Throw an exception is not valid
     */
    checkIfValid(): this {
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