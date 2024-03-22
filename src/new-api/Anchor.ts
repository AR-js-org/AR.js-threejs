import { Group, Object3D } from "three";
import { ArMarkerControls } from "../ArMarkerControls";
import { ArSmoothedControls } from "../ArSmoothedControls";
import { IArSmoothedControls } from "../CommonInterfaces/THREEx-interfaces";

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
    private readonly object3d: Object3D;
    private smoothedControls: IArSmoothedControls;
    private markerRoot: Group;
    constructor(arSession: any, markerParameters: any) {
        //var _this = this;
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

        this.markerRoot = new Group();
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
            console.log(arContext.parameters.trackingBackend);
            

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
                //var resolutionW = parseInt(matches[1]);
                //var resolutionH = parseInt(matches[2]);
                var arContext = arSession.arContext;
            }
            
            var parent3D;
            // set controlledObject depending on changeMatrixMode
            if (markerParameters.changeMatrixMode === "modelViewMatrix") {
                parent3D = this.markerRoot;
            } else if (markerParameters.changeMatrixMode === "cameraTransformMatrix") {
                parent3D = camera;
            } else console.assert(false);

            // build a multiMarkerControls
            
            var markerControls = new ArMarkerControls(
                arContext,
                parent3D,
                markerParameters
            );
            this.controls = markerControls;
        }

        this.object3d = new Group();

        //////////////////////////////////////////////////////////////////////////////
        //		THREEx.ArSmoothedControls
        //////////////////////////////////////////////////////////////////////////////

        var shouldBeSmoothed = true;

        if (shouldBeSmoothed === true) {
            // build a smoothedControls
            var smoothedRoot = new Group();
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

        if (this.smoothedControls !== undefined) {

            // update smoothedControls
            this.smoothedControls.update(this.markerRoot);
        }
    }
};