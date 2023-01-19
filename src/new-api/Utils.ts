import * as THREE from "three";

export class Utils {

    constructor() {}
    /**
     * Create a default rendering camera for this trackingBackend. They may be modified later. to fit physical camera parameters
     *
     * @param {string} trackingBackend - the tracking to user
     * @return {THREE.Camera} the created camera
     */
    static createDefaultCamera(trackingMethod: string) {
        var trackingBackend =
            Utils.parseTrackingMethod(trackingMethod).trackingBackend;
        // Create a camera
        if (trackingBackend === "artoolkit") {
            var camera = new THREE.Camera();
        } else console.assert(false, "unknown trackingBackend: " + trackingBackend);

        return camera;
    };

    /**
     * parse tracking method
     *
     * @param {String} trackingMethod - the tracking method to parse
     * @return {Object} - various field of the tracking method
     */
    static parseTrackingMethod(trackingMethod: string) {
        if (trackingMethod === "best") {
            trackingMethod = "area-artoolkit";
        }

        if (trackingMethod.startsWith("area-")) {
            return {
                trackingBackend: trackingMethod.replace("area-", ""),
                markersAreaEnabled: true,
            };
        } else {
            return {
                trackingBackend: trackingMethod,
                markersAreaEnabled: false,
            };
        }
    };
}