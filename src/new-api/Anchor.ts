import * as THREE from "three";
import { ArMarkerControls } from "../ArMarkerControls"; // Alias for dynamic importing
import { ArMarkerHelper } from "../ArMarkerHelper";
import { ArSmoothedControls } from "../ArSmoothedControls";
import { MarkersAreaControls } from "../markers-area/arjs-markersareacontrols";
import { MarkersAreaUtils } from "../markers-area/arjs-markersareautils";
import { IArMarkerAreaControls, IArMarkerAreaControlsParameters, IArMarkerControls } from "../CommonInterfaces/THREEx-interfaces";

// TODO this is a controls... should i give the object3d here ?
// not according to 'no three.js dependancy'

/**
 * Create an anchor in the real world
 *
 * @param {ARjs.Session} arSession - the session on which we create the anchor
 * @param {Object} markerParameters - parameter of this anchor
 */
export class Anchor {
    private arSession: any;
    private parameters: any;
    private controls: any;
    private markersArea: any;
    private object3d: any;
    private smoothedControls: any;
    private multiMarkerControls: any;
    private markerRoot: any;
    constructor(arSession: any, markerParameters: any) {
        var _this = this;
        var arContext = arSession.arContext;
        var scene = arSession.parameters.scene;
        var camera = arSession.parameters.camera;

        this.arSession = arSession;
        this.parameters = markerParameters;

        // log to debug
        console.log(
            "ARjs.Anchor -",
            "changeMatrixMode:",
            this.parameters.changeMatrixMode,
            "/ markersAreaEnabled:",
            markerParameters.markersAreaEnabled
        );

        this.markerRoot = new THREE.Group();
        scene.add(this.markerRoot);
        var controlledObject;
        // set controlledObject depending on changeMatrixMode
        if (markerParameters.changeMatrixMode === "modelViewMatrix") {
            controlledObject = this.markerRoot;
        } else if (markerParameters.changeMatrixMode === "cameraTransformMatrix") {
            controlledObject = camera;
        } else console.assert(false);

        if (markerParameters.markersAreaEnabled === false) {
            var markerControls = new ArMarkerControls(
                arContext,
                controlledObject,
                markerParameters
            );
            this.controls = markerControls;

        } else {
            // sanity check - MUST be a trackingBackend with markers
            console.assert(arContext.parameters.trackingBackend === "artoolkit");

            // honor markers-page-resolution for https://webxr.io/augmented-website
            if (
                location.hash.substring(1).startsWith("markers-page-resolution=") === true
            ) {
                // get resolutionW/resolutionH from url
                var markerPageResolution = location.hash.substring(1);
                var matches = markerPageResolution.match(
                    /markers-page-resolution=(\d+)x(\d+)/
                );
                console.assert(matches.length === 3);
                var resolutionW = parseInt(matches[1]);
                var resolutionH = parseInt(matches[2]);
                var arContext = arSession.arContext;
                // generate and store the ARjsMultiMarkerFile
                MarkersAreaUtils.storeMarkersAreaFileFromResolution(
                    arContext.parameters.trackingBackend,
                    resolutionW,
                    resolutionH
                );
            }

            // if there is no ARjsMultiMarkerFile, build a default one
            if (localStorage.getItem("ARjsMultiMarkerFile") === null) {
                MarkersAreaUtils.storeDefaultMultiMarkerFile(
                    arContext.parameters.trackingBackend
                );
            }

            // get multiMarkerFile from localStorage
            console.assert(localStorage.getItem("ARjsMultiMarkerFile") !== null);
            var multiMarkerFile = localStorage.getItem("ARjsMultiMarkerFile");

            // set controlledObject depending on changeMatrixMode
            if (markerParameters.changeMatrixMode === "modelViewMatrix") {
                var parent3D = scene;
            } else if (markerParameters.changeMatrixMode === "cameraTransformMatrix") {
                var parent3D = camera;
            } else console.assert(false);

            // build a multiMarkerControls
            this.multiMarkerControls = {} as IArMarkerAreaControls
            this.multiMarkerControls = MarkersAreaControls.fromJSON(
                arContext,
                parent3D,
                controlledObject,
                multiMarkerFile
            );
            this.controls = this.multiMarkerControls;

            // honor markerParameters.changeMatrixMode
            this.multiMarkerControls.parameters.changeMatrixMode =
                markerParameters.changeMatrixMode;

            // TODO put subMarkerControls visibility into an external file. with 2 handling for three.js and babylon.js
            // create ArMarkerHelper - useful to debug - super three.js specific
            var markerHelpers: any[] = [];

            this.multiMarkerControls.subMarkersControls.forEach(function (
                subMarkerControls: any
            ) {
                // add an helper to visuable each sub-marker
                var markerHelper = new ArMarkerHelper(subMarkerControls);
                markerHelper.object3d.visible = false;
                // subMarkerControls.object3d.add( markerHelper.object3d )
                subMarkerControls.object3d.add(markerHelper.object3d);
                // add it to markerHelpers
                markerHelpers.push(markerHelper);
            });
            // define API specific to markersArea
            this.markersArea = {};
            this.markersArea.setSubMarkersVisibility = function (visible: any) {
                markerHelpers.forEach(function (markerHelper) {
                    markerHelper.object3d.visible = visible;
                });
            };
        }

        this.object3d = new THREE.Group();

        //////////////////////////////////////////////////////////////////////////////
        //		THREEx.ArSmoothedControls
        //////////////////////////////////////////////////////////////////////////////

        var shouldBeSmoothed = true;

        if (shouldBeSmoothed === true) {
            // build a smoothedControls
            var smoothedRoot = new THREE.Group();
            scene.add(smoothedRoot);
            this.smoothedControls = new ArSmoothedControls(smoothedRoot);
            smoothedRoot.add(this.object3d);
        } else {
            this.markerRoot.add(this.object3d);
        }
    }

    update() {
        // update _this.object3d.visible
        this.object3d.visible = this.object3d.parent.visible;

        // console.log('controlledObject.visible', _this.object3d.parent.visible)
        if (this.smoothedControls !== undefined) {
            // update smoothedControls parameters depending on how many markers are visible in multiMarkerControls
            if (this.multiMarkerControls !== undefined) {
                this.multiMarkerControls.updateSmoothedControls(this.smoothedControls);
            }

            // update smoothedControls
            this.smoothedControls.update(this.markerRoot);
        }
    }
};

export default Anchor;
