import { ArBaseControls } from "./ArBaseControls";
import { Matrix4, Object3D } from "three";
import Worker from "worker-loader?inline=no-fallback!./Worker";
import { setParameters } from "./common-functions/utilityFunctions";
import { IArMarkerControls, IArMarkerControlsParameters, IArToolkitContext } from "./CommonInterfaces/THREEx-interfaces";
import jsartoolkit from "@ar-js-org/artoolkit5-js";
const { ARToolkit } = jsartoolkit;

declare global {
    var arMarkerControls: IArMarkerControls;
}

/**
 * ArMarkerControls class. This is the class where you can set up the marker
 * and attach it to a Three.js Object3D
 * @class ArMarkerControls
 */
export class ArMarkerControls extends ArBaseControls implements IArMarkerControls {
    private context: IArToolkitContext;
    public parameters: IArMarkerControlsParameters;
    private smoothMatrices: any[];
    private onGetMarker: Function;
    private className: string;
    declare public object3d: Object3D;

    /**
     * ArMarkerControls constructor, needs context, object3d and a bunch of parameters.
     * @constructor
     * @param {IArToolkitContext} context 
     * @param {Object3D} object3d 
     * @param {IArMarkerControlsParameters} parameters 
     */
    constructor(context: IArToolkitContext, object3d: Object3D, parameters: IArMarkerControlsParameters) {
        super(object3d)
        var _this = this;
        this.className = "ArMarkerControls";
        this.context = context;
        // handle default parameters
        this.parameters = {
            // size of the marker in meter
            size: 1,
            // type of marker - ['pattern', 'barcode', 'nft', 'unknown' ]
            type: "unknown",
            // url of the pattern - IIF type='pattern'
            patternUrl: null,
            // value of the barcode - IIF type='barcode'
            barcodeValue: null,
            // url of the descriptors of image - IIF type='nft'
            descriptorsUrl: null,
            // change matrix mode - [modelViewMatrix, cameraTransformMatrix]
            changeMatrixMode: "modelViewMatrix",
            // minimal confidence in the marke recognition - between [0, 1] - default to 1
            minConfidence: 0.6,
            // turn on/off camera smoothing
            smooth: false,
            // number of matrices to smooth tracking over, more = smoother but slower follow
            smoothCount: 5,
            // distance tolerance for smoothing, if smoothThreshold # of matrices are under tolerance, tracking will stay still
            smoothTolerance: 0.01,
            // threshold for smoothing, will keep still unless enough matrices are over tolerance
            smoothThreshold: 2,
        };

        // sanity check
        var possibleValues = ["pattern", "barcode", "nft", "unknown"];
        console.assert(
            possibleValues.indexOf(this.parameters.type) !== -1,
            "illegal value",
            this.parameters.type
        );
        var possibleValues = ["modelViewMatrix", "cameraTransformMatrix"];
        console.assert(
            possibleValues.indexOf(this.parameters.changeMatrixMode) !== -1,
            "illegal value",
            this.parameters.changeMatrixMode
        );

        // create the marker Root
        this.object3d = object3d;
        this.object3d.matrixAutoUpdate = false;
        this.object3d.visible = false;

        //////////////////////////////////////////////////////////////////////////////
        //		setParameters
        //////////////////////////////////////////////////////////////////////////////
        setParameters(parameters, this);
        if (this.parameters.smooth) {
            this.smoothMatrices = []; // last DEBOUNCE_COUNT modelViewMatrix
        }

        //////////////////////////////////////////////////////////////////////////////
        //		Code Separator
        //////////////////////////////////////////////////////////////////////////////
        // add this marker to artoolkitsystem
        // TODO rename that .addMarkerControls
        context.addMarker(this);

        if (_this.context.parameters.trackingBackend === "artoolkit") {
            this._initArtoolkit();
        } else console.assert(false);
    };

    /**
     * dispose is used to dispose the marker and all objects associated.
     * @returns {void} void
     */
    dispose(): void {
        if (this.context && this.context.arController) {
            this.context.arController.removeEventListener(
                "getMarker",
                this.onGetMarker
            );
        }

        this.context.removeMarker(this);

        this.object3d = null;
        this.smoothMatrices = [];
    };

    //////////////////////////////////////////////////////////////////////////////
    //		update controls with new modelViewMatrix
    //////////////////////////////////////////////////////////////////////////////

    /**
     * When you actually got a new modelViewMatrix, you need to perfom a whole bunch
     * of things. it is done here.
     * @param {Matrix4} modelViewMatrix
     * @returns {boolean} renderReqd
     */
    updateWithModelViewMatrix(modelViewMatrix: Matrix4) {
        var markerObject3D = this.object3d;

        // mark object as visible
        markerObject3D.visible = true;

        if (this.context.parameters.trackingBackend === "artoolkit") {
            // apply context._axisTransformMatrix - change artoolkit axis to match usual webgl one
            var tmpMatrix = new Matrix4().copy(
                this.context._artoolkitProjectionAxisTransformMatrix
            );
            tmpMatrix.multiply(modelViewMatrix);

            modelViewMatrix.copy(tmpMatrix);
        } else {
            console.assert(false);
        }

        // change axis orientation on marker - artoolkit say Z is normal to the marker - ar.js say Y is normal to the marker
        var markerAxisTransformMatrix = new Matrix4().makeRotationX(
            Math.PI / 2
        );
        modelViewMatrix.multiply(markerAxisTransformMatrix);

        var renderReqd = false;

        // change markerObject3D.matrix based on parameters.changeMatrixMode
        if (this.parameters.changeMatrixMode === "modelViewMatrix") {
            if (this.parameters.smooth) {
                var sum,
                    i,
                    j,
                    averages: any, // average values for matrix over last smoothCount
                    exceedsAverageTolerance = 0;

                this.smoothMatrices.push(modelViewMatrix.elements.slice()); // add latest

                if (this.smoothMatrices.length < this.parameters.smoothCount + 1) {
                    markerObject3D.matrix.copy(modelViewMatrix); // not enough for average
                } else {
                    this.smoothMatrices.shift(); // remove oldest entry
                    averages = [];

                    for (i in modelViewMatrix.elements) {
                        // loop over entries in matrix
                        sum = 0;
                        for (j in this.smoothMatrices) {
                            // calculate average for this entry
                            sum += this.smoothMatrices[j][i];
                        }
                        averages[i] = sum / this.parameters.smoothCount;
                        // check how many elements vary from the average by at least AVERAGE_MATRIX_TOLERANCE
                        if (
                            Math.abs(averages[i] - modelViewMatrix.elements[i]) >=
                            this.parameters.smoothTolerance
                        ) {
                            exceedsAverageTolerance++;
                        }
                    }

                    // if moving (i.e. at least AVERAGE_MATRIX_THRESHOLD entries are over AVERAGE_MATRIX_TOLERANCE)
                    if (exceedsAverageTolerance >= this.parameters.smoothThreshold) {
                        // then update matrix values to average, otherwise, don't render to minimize jitter
                        for (i in modelViewMatrix.elements) {
                            modelViewMatrix.elements[i] = averages[i];
                        }
                        markerObject3D.matrix.copy(modelViewMatrix);
                        renderReqd = true; // render required in animation loop
                    }
                }
            } else {
                markerObject3D.matrix.copy(modelViewMatrix);
            }
        } else if (this.parameters.changeMatrixMode === "cameraTransformMatrix") {
            markerObject3D.matrix.copy(modelViewMatrix).invert();
        } else {
            console.assert(false);
        }

        // decompose - the matrix into .position, .quaternion, .scale

        markerObject3D.matrix.decompose(
            markerObject3D.position,
            markerObject3D.quaternion,
            markerObject3D.scale
        );

        // dispatchEvent
        this.dispatchEvent({ type: "markerFound" });

        return renderReqd;
    };


    update(object3d: Object3D) {
        console.log("update not required", object3d)
    }

    //////////////////////////////////////////////////////////////////////////////
    //		utility functions
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Method to get the name of the marker.
     * @returns {string}
     */
    name(): string {
        var name = "";
        name += this.parameters.type;

        if (this.parameters.type === "pattern") {
            var url = this.parameters.patternUrl;
            var basename = url.replace(/^.*\//g, "");
            name += " - " + basename;
        } else if (this.parameters.type === "barcode") {
            name += " - " + this.parameters.barcodeValue;
        } else if (this.parameters.type === "nft") {
            var url = this.parameters.descriptorsUrl;
            var basename = url.replace(/^.*\//g, "");
            name += " - " + basename;
        } else {
            console.assert(false, "no .name() implemented for this marker controls");
        }

        return name;
    };

    //////////////////////////////////////////////////////////////////////////////
    //		init for Artoolkit
    //////////////////////////////////////////////////////////////////////////////
    private _initArtoolkit() {
        var _this = this;

        var artoolkitMarkerId: any = null;

        var delayedInitTimerId = setInterval(() => {
            // check if arController is init
            var arController = _this.context.arController;
            if (arController === null) return;
            // stop looping if it is init
            clearInterval(delayedInitTimerId);
            delayedInitTimerId = null;
            // launch the _postInitArtoolkit
            postInit();
        }, 1000 / 50);

        return;

        function postInit() {
            // check if arController is init
            var arController = _this.context.arController;
            console.assert(arController !== null);

            // start tracking this pattern
            if (_this.parameters.type === "pattern") {
                arController
                    .loadMarker(_this.parameters.patternUrl)
                    .then(function (markerId: any) {
                        artoolkitMarkerId = markerId;
                        arController.trackPatternMarkerId(
                            artoolkitMarkerId,
                            _this.parameters.size
                        );
                    });
            } else if (_this.parameters.type === "barcode") {
                artoolkitMarkerId = _this.parameters.barcodeValue;
                arController.trackBarcodeMarkerId(
                    artoolkitMarkerId,
                    _this.parameters.size
                );
            } else if (_this.parameters.type === "nft") {
                // use workers as default
                handleNFT(_this.parameters.descriptorsUrl, arController);
            } else if (_this.parameters.type === "unknown") {
                artoolkitMarkerId = null;
            } else {
                console.log(false, "invalid marker type", _this.parameters.type);
            }

            // listen to the event
            arController.addEventListener("getMarker", function (event: { data: { type: any; marker: { idPatt: any; idMatrix: any; }; }; }) {
                //console.log(event);

                if (
                    event.data.type === ARToolkit.PATTERN_MARKER &&
                    _this.parameters.type === "pattern"
                ) {
                    if (artoolkitMarkerId === null) return;
                    if (event.data.marker.idPatt === artoolkitMarkerId)
                        onMarkerFound(event);
                } else if (
                    event.data.type === ARToolkit.BARCODE_MARKER &&
                    _this.parameters.type === "barcode"
                ) {
                    if (artoolkitMarkerId === null) return;
                    if (event.data.marker.idMatrix === artoolkitMarkerId)
                        onMarkerFound(event);
                } else if (
                    event.data.type === ARToolkit.UNKNOWN_MARKER &&
                    _this.parameters.type === "unknown"
                ) {
                    onMarkerFound(event);
                }
            });
        }

        function setMatrix(matrix: Matrix4, value: { [x: string]: any; }) {
            var array: any[] = [];
            for (var key in value) {
                //@ts-ignore
                array[key] = value[key];
            }
            //@ts-ignore
            if (typeof matrix.elements.set === "function") {
                //@ts-ignore
                matrix.elements.set(array);
            } else {
                matrix.elements = [].slice.call(array);
            }
        }

        function handleNFT(descriptorsUrl: any, arController: { canvas: { style: { clientWidth: string; clientHeight: string; }; width: number; height: number; getContext: (arg0: string) => any; }; cameraParam: any; }) {
            var worker = new Worker();

            window.addEventListener("arjs-video-loaded", function (ev: any) {
                var video = ev.detail.component;
                var vw = video.clientWidth;
                var vh = video.clientHeight;

                var pscale = 320 / Math.max(vw, (vh / 3) * 4);

                const w = vw * pscale;
                const h = vh * pscale;
                const pw = Math.max(w, (h / 3) * 4);
                const ph = Math.max(h, (w / 4) * 3);
                const ox = (pw - w) / 2;
                const oy = (ph - h) / 2;

                arController.canvas.style.clientWidth = pw + "px";
                arController.canvas.style.clientHeight = ph + "px";
                arController.canvas.width = pw;
                arController.canvas.height = ph;

                var context_process = arController.canvas.getContext("2d");

                function process() {
                    context_process.fillStyle = "black";
                    context_process.fillRect(0, 0, pw, ph);
                    context_process.drawImage(video, 0, 0, vw, vh, ox, oy, w, h);

                    var imageData = context_process.getImageData(0, 0, pw, ph);
                    worker.postMessage({ type: "process", imagedata: imageData }, [
                        imageData.data.buffer,
                    ]);
                }

                // initialize the worker
                worker.postMessage({
                    type: "init",
                    pw: pw,
                    ph: ph,
                    marker: descriptorsUrl,
                    param: arController.cameraParam,
                });

                worker.onmessage = function (ev: any) {
                    if (ev && ev.data && ev.data.type === "endLoading") {
                        var loader = document.querySelector(".arjs-loader");
                        if (loader) {
                            loader.remove();
                        }
                        var endLoadingEvent = new Event("arjs-nft-loaded");
                        window.dispatchEvent(endLoadingEvent);
                    }

                    if (ev && ev.data && ev.data.type === "loaded") {
                        var proj = JSON.parse(ev.data.proj);
                        var ratioW = pw / w;
                        var ratioH = ph / h;
                        proj[0] *= ratioW;
                        proj[4] *= ratioW;
                        proj[8] *= ratioW;
                        proj[12] *= ratioW;
                        proj[1] *= ratioH;
                        proj[5] *= ratioH;
                        proj[9] *= ratioH;
                        proj[13] *= ratioH;

                        setMatrix(_this.object3d.matrix, proj);
                    }

                    if (ev && ev.data && ev.data.type === "markerInfos") {
                        var nft = JSON.parse(ev.data.marker);
                        var nftEvent = new CustomEvent("arjs-nft-init-data", {
                            detail: { dpi: nft.dpi, width: nft.width, height: nft.height },
                        });
                        window.dispatchEvent(nftEvent);
                    }

                    if (ev && ev.data && ev.data.type === "found") {
                        var matrix = JSON.parse(ev.data.matrix);

                        onMarkerFound({
                            data: {
                                type: ARToolkit.NFT_MARKER,
                                matrix: matrix,
                                msg: ev.data.type,
                            },
                        });

                        _this.context.arController.showObject = true;
                    } else {
                        _this.context.arController.showObject = false;
                    }

                    process();
                };
            });
        }

        function onMarkerFound(event: { data: any; }) {
            if (
                event.data.type === ARToolkit.PATTERN_MARKER &&
                event.data.marker.cfPatt < _this.parameters.minConfidence
            )
                return;
            if (
                event.data.type === ARToolkit.BARCODE_MARKER &&
                event.data.marker.cfMatrix < _this.parameters.minConfidence
            )
                return;

            var modelViewMatrix = new Matrix4().fromArray(event.data.matrix);
            _this.updateWithModelViewMatrix(modelViewMatrix);
        }
    }
}