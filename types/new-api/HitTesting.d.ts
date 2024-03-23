import { Camera, Object3D, Quaternion, Vector3 } from "three";
export declare class HitTesting {
    enabled: boolean;
    private _arSession;
    private _hitTestingPlane;
    constructor(arSession: any);
    update(camera: Camera, pickingRoot: Object3D, changeMatrixMode: string): void;
    testDomEvent(domEvent: any): any[];
    test(mouseX: number, mouseY: number): any[];
}
export declare class Result {
    private position;
    private scale;
    private quaternion;
    constructor(position: Vector3, quaternion: Quaternion, scale: Vector3);
    apply(object3d: Object3D): void;
    applyPosition(object3d: Object3D): this;
    applyQuaternion(object3d: Object3D): this;
}
