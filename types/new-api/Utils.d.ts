import * as THREE from "three";
export declare class Utils {
    constructor();
    static createDefaultCamera(trackingMethod: string): THREE.Camera;
    static parseTrackingMethod(trackingMethod: string): {
        trackingBackend: string;
        markersAreaEnabled: boolean;
    };
}
