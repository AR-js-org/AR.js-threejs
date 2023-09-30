import { EventDispatcher, EventListener, PerspectiveCamera, Matrix4 } from 'three'
import { IArToolkitContext, IContextParameters } from './CommonInterfaces/THREEx-interfaces';
import { ArMarkerControls } from "./ArMarkerControls";
import { setParameters } from './common-functions/utilityFunctions';
import jsartoolkit from "@ar-js-org/artoolkit5-js"; // TODO comment explanation
const { ARController } = jsartoolkit;

declare global {
    var arToolkitContext: IArToolkitContext;
}
/**
 * @class ArToolkitContext
 */
export class ArToolkitContext implements IArToolkitContext {
    private _updatedAt: any;
    public parameters: IContextParameters;
    public arController: any;
    private initialized: boolean;
    private _arMarkersControls: any;
    public _artoolkitProjectionAxisTransformMatrix: any;
    private className: string;
    /**
     * Create a new instance of the ARToolkitContext, provide some valid paramters to it.
     * @param {IContextParameters} parameters
     * @see {IContextParameters}
     */
    constructor(parameters: IContextParameters) {
        this.className = "ArToolkitContext";
        this._updatedAt = null;

        // handle default parameters
        this.parameters = {
            // AR backend - ['artoolkit']
            trackingBackend: 'artoolkit',
            // debug - true if one should display artoolkit debug canvas, false otherwise
            debug: false,
            // the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
            detectionMode: 'mono',
            // type of matrix code - valid iif detectionMode end with 'matrix' - [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
            matrixCodeType: '3x3',

            // url of the camera parameters
            cameraParametersUrl: ArToolkitContext.baseURL + '../data/data/camera_para.dat',

            // tune the maximum rate of pose detection in the source image
            maxDetectionRate: 60,
            // resolution of at which we detect pose in the source image
            canvasWidth: 640,
            canvasHeight: 480,

            // the patternRatio inside the artoolkit marker - artoolkit only
            patternRatio: 0.5,

            // Labeling mode for markers - ['black_region', 'white_region']
            // black_region: Black bordered markers on a white background, white_region: White bordered markers on a black background
            labelingMode: "black_region",

            // enable image smoothing or not for canvas copy - default to true
            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
            imageSmoothingEnabled: false,
        }
        // parameters sanity check
        console.assert(
            ['artoolkit'].indexOf(String(this.parameters.trackingBackend)) !==
            -1,
            'invalid parameter trackingBackend',
            this.parameters.trackingBackend)
        console.assert(
            ['color', 'color_and_matrix', 'mono', 'mono_and_matrix'].indexOf(this.parameters.detectionMode) !==
            -1,
            'invalid parameter detectionMode',
            this.parameters.detectionMode)
        console.assert(
            ["black_region", "white_region"].indexOf(this.parameters.labelingMode) !==
            -1,
            "invalid parameter labelingMode",
            this.parameters.labelingMode
        );
        this.arController = null;

        this.initialized = false


        this._arMarkersControls = [];
        this._artoolkitProjectionAxisTransformMatrix = null;

        //////////////////////////////////////////////////////////////////////////////
        //		setParameters
        //////////////////////////////////////////////////////////////////////////////
        setParameters(parameters, this)
    }
    /**
     * dispatch an Event as a THREE.EventDispatcher
     * @param {any} event
     */
    dispatchEvent = EventDispatcher.prototype.dispatchEvent;
    /**
     * Add an Event listeners as a THREE.EventDispatcher
     * @param {T extends any} type
     * @param {EventListener} listener
     */
    addEventListener = EventDispatcher.prototype.addEventListener;
    /**
     * Check if has an Event listeners as a THREE.EventDispatcher
     * @param {T extends any} type
     * @param {EventListener} listener
     */
    hasEventListener = EventDispatcher.prototype.hasEventListener;
    /**
     * Remove an Event listeners as a THREE.EventDispatcher
     * @param {T extends any} type
     * @param {EventListener} listener
     */
    removeEventListener = EventDispatcher.prototype.removeEventListener;

    static baseURL = "https://ar-js-org.github.io/AR.js/three.js/";
    static REVISION = "3.4.3-threejs-0.2.0";

    /**
     * Create a default Camera 
     * @param {string} trackingBackend 
     * @returns {Camera}
     * @deprecated use ARjs.Utils.createDefaultCamera instead
     */
    createDefaultCamera(trackingBackend: string) {
        console.assert(false, 'use ARjs.Utils.createDefaultCamera instead')
        // Create a camera
        let camera;
        if (trackingBackend === 'artoolkit') {
            camera = new PerspectiveCamera();
        } else console.assert(false);
        return camera
    }

    /**
     * Init the artoolkit backend. This is one of the first steps in your app.
     * @param {Function} onCompleted 
     * @returns {void}
     */
    init(onCompleted: Function): void {
        var _this = this;
        if (this.parameters.trackingBackend === "artoolkit") {
            this._initArtoolkit(done);
        } else console.assert(false);
        return;

        function done() {
            // dispatch event
            _this.dispatchEvent({
                type: "initialized",
            });

            _this.initialized = true;

            onCompleted && onCompleted();
        }
    };

    /**
     * update is where the data from an image or video stream is processed.
     * This is mandatory otherwise the marker can not be detected.
     * @param {HTMLImageElement | HTMLVideoElement} srcElement 
     * @returns {boolean}
     */
    update(srcElement: HTMLImageElement | HTMLVideoElement) {
        // be sure arController is fully initialized
        if (
            this.parameters.trackingBackend === "artoolkit" &&
            this.arController === null
        )
            return false;

        // honor this.parameters.maxDetectionRate
        var present = performance.now();
        if (
            this._updatedAt !== null &&
            present - this._updatedAt < 1000 / this.parameters.maxDetectionRate
        ) {
            return false;
        }
        this._updatedAt = present;

        var prevVisibleMarkers: any[] = [];

        // mark all markers to invisible before processing this frame
        this._arMarkersControls.forEach(function (markerControls: any) {
            if (markerControls.object3d.visible) {
                prevVisibleMarkers.push(markerControls);
            }
            if (!markerControls.context.arController.showObject) {
                markerControls.object3d.visible = false;
            }
        });

        // process this frame
        if (this.parameters.trackingBackend === "artoolkit") {
            this._updateArtoolkit(srcElement);
        } else {
            console.assert(false);
        }

        // dispatch event
        this.dispatchEvent({
            type: "sourceProcessed",
        });

        // After frame is processed, check visibility of each marker to determine if it was found or lost
        this._arMarkersControls.forEach(function (markerControls: any) {
            var wasVisible = prevVisibleMarkers.includes(markerControls);
            var isVisible = markerControls.object3d.visible;

            if (isVisible === true && wasVisible === false) {
                window.dispatchEvent(
                    new CustomEvent("markerFound", {
                        detail: markerControls,
                    })
                );
            } else if (isVisible === false && wasVisible === true) {
                window.dispatchEvent(
                    new CustomEvent("markerLost", {
                        detail: markerControls,
                    })
                );
            }
        });

        // return true as we processed the frame
        return true;
    };

    ////////////////////////////////////////////////////////////////////////////////
    //          Add/Remove markerControls
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * Add a marker to be detected.
     * @param {ArMarkerControls} arMarkerControls
     * @returns {void}
     */
    addMarker(arMarkerControls: ArMarkerControls): void {
        console.assert(arMarkerControls instanceof ArMarkerControls);
        this._arMarkersControls.push(arMarkerControls);
    };

    /**
     * Remove a marker from the class.
     * @param {ArMarkerControls} arMarkerControls
     * @returns {void}
     */
    removeMarker(arMarkerControls: ArMarkerControls): void {
        console.assert(arMarkerControls instanceof ArMarkerControls);
        var index = this._arMarkersControls.indexOf(arMarkerControls);
        if (index < 0) {
            return;
        }
        this._arMarkersControls.splice(index, 1);
    };

    private _initArtoolkit(onCompleted: Function) {
        var _this = this;

        // set this._artoolkitProjectionAxisTransformMatrix to change artoolkit projection matrix axis to match usual webgl one
        this._artoolkitProjectionAxisTransformMatrix = new Matrix4();
        this._artoolkitProjectionAxisTransformMatrix.multiply(
            new Matrix4().makeRotationY(Math.PI)
        );
        this._artoolkitProjectionAxisTransformMatrix.multiply(
            new Matrix4().makeRotationZ(Math.PI)
        );

        // init controller

        ARController.initWithDimensions(
            _this.parameters.canvasWidth,
            _this.parameters.canvasHeight,
            _this.parameters.cameraParametersUrl,
            {}
        )
            .then((arController: any) => {
                _this.arController = arController;

                // honor this.parameters.imageSmoothingEnabled
                arController.ctx.mozImageSmoothingEnabled =
                    _this.parameters.imageSmoothingEnabled;
                arController.ctx.webkitImageSmoothingEnabled =
                    _this.parameters.imageSmoothingEnabled;
                arController.ctx.msImageSmoothingEnabled =
                    _this.parameters.imageSmoothingEnabled;
                arController.ctx.imageSmoothingEnabled =
                    _this.parameters.imageSmoothingEnabled;

                // honor this.parameters.debug
                if (_this.parameters.debug === true) {
                    arController.debugSetup();
                    arController.canvas.style.position = "absolute";
                    arController.canvas.style.top = "0px";
                    arController.canvas.style.opacity = "0.6";
                    arController.canvas.style.pointerEvents = "none";
                    arController.canvas.style.zIndex = "-1";
                }

                // setPatternDetectionMode
                var detectionModes = {
                    color: arController.artoolkit.AR_TEMPLATE_MATCHING_COLOR,
                    color_and_matrix:
                        arController.artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX,
                    mono: arController.artoolkit.AR_TEMPLATE_MATCHING_MONO,
                    mono_and_matrix:
                        arController.artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX,
                };
                //@ts-ignore
                var detectionMode = detectionModes[_this.parameters.detectionMode];
                console.assert(detectionMode !== undefined);
                arController.setPatternDetectionMode(detectionMode);

                // setMatrixCodeType
                var matrixCodeTypes = {
                    "3x3": arController.artoolkit.AR_MATRIX_CODE_3x3,
                    "3x3_HAMMING63": arController.artoolkit.AR_MATRIX_CODE_3x3_HAMMING63,
                    "3x3_PARITY65": arController.artoolkit.AR_MATRIX_CODE_3x3_PARITY65,
                    "4x4": arController.artoolkit.AR_MATRIX_CODE_4x4,
                    "4x4_BCH_13_9_3": arController.artoolkit.AR_MATRIX_CODE_4x4_BCH_13_9_3,
                    "4x4_BCH_13_5_5": arController.artoolkit.AR_MATRIX_CODE_4x4_BCH_13_5_5,
                    "5x5_BCH_22_12_5": arController.artoolkit.AR_MATRIX_CODE_5x5_BCH_22_12_5,
                    "5x5_BCH_22_7_7": arController.artoolkit.AR_MATRIX_CODE_5x5_BCH_22_7_7,
                    "5x5": arController.artoolkit.AR_MATRIX_CODE_5x5,
                    "6x6": arController.artoolkit.AR_MATRIX_CODE_6x6,
                };
                //@ts-ignore
                var matrixCodeType = matrixCodeTypes[_this.parameters.matrixCodeType];
                console.assert(matrixCodeType !== undefined);
                arController.setMatrixCodeType(matrixCodeType);

                // set the patternRatio for artoolkit
                arController.setPattRatio(_this.parameters.patternRatio);

                // set the labelingMode for artoolkit
                var labelingModeTypes = {
                    black_region: arController.artoolkit.AR_LABELING_BLACK_REGION,
                    white_region: arController.artoolkit.AR_LABELING_WHITE_REGION,
                };
                //@ts-ignore
                var labelingModeType = labelingModeTypes[_this.parameters.labelingMode];
                console.assert(labelingModeType !== undefined);
                arController.setLabelingMode(labelingModeType);

                // set thresholding in artoolkit
                // this seems to be the default
                // arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_MANUAL)
                // adatative consume a LOT of cpu...
                // arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_AUTO_ADAPTIVE)
                // arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_AUTO_OTSU)

                // notify
                onCompleted();
            });
        return this;
    };

    /**
     * getProjectionMatrix return the Camera Projection Matrix from the ARController camera.
     * @returns {Matrix4}
     */
    getProjectionMatrix(): Matrix4 {
        // FIXME rename this function to say it is artoolkit specific - getArtoolkitProjectMatrix
        // keep a backward compatibility with a console.warn

        console.assert(this.parameters.trackingBackend === "artoolkit");
        console.assert(
            this.arController,
            "arController MUST be initialized to call this function"
        );

        // get projectionMatrixArr from artoolkit       
        var projectionMatrixArr = this.arController.getCameraMatrix();
        var projectionMatrix = new Matrix4().fromArray(projectionMatrixArr);

        // projectionMatrix.multiply(this._artoolkitProjectionAxisTransformMatrix)
        // return the result
        return projectionMatrix;
    };

    private _updateArtoolkit(srcElement: HTMLImageElement | HTMLVideoElement) {
        this.arController.process(srcElement);
    };
}