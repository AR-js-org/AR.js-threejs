export declare class ARClickability {
    private _sourceElement;
    private _cameraPicking;
    constructor(sourceElement: HTMLElement);
    onResize(): void;
    computeIntersects(domEvent: any, objects: any): import("three").Intersection<import("three").Object3D<import("three").Event>>[];
    update(): void;
}
