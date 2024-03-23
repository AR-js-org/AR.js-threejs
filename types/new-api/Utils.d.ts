import { PerspectiveCamera } from "three";
export declare class Utils {
    constructor();
    static createDefaultCamera(trackingMethod: string): PerspectiveCamera;
    static parseTrackingMethod(trackingMethod: string): {
        trackingBackend: string;
        markersAreaEnabled: boolean;
    };
}
