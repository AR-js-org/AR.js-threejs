import { Camera, Object3D, Quaternion, Vector3 } from "three";
export declare class HitTestingPlane {
    private _sourceElement;
    private _pickingScene;
    private _pickingPlane;
    private _pickingCamera;
    constructor(sourceElement: HTMLElement);
    update(camera: Camera, pickingRoot: Object3D, changeMatrixMode: string): void;
    onResize(): void;
    test(mouseX: number, mouseY: number): {
        position: any;
        quaternion: Quaternion;
        scale: Vector3;
    };
    renderDebug(renderer: any): void;
}
