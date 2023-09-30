import { Camera } from "three";
export declare class ArVideoInWebgl {
    object3d: any;
    private seethruPlane;
    constructor(videoTexture: any);
    update(camera: Camera): void;
}
