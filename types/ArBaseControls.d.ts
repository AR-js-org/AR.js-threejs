import { EventDispatcher, Object3D } from "three";
export declare class ArBaseControls extends EventDispatcher {
    static id: number;
    private _id;
    protected object3d: Object3D;
    constructor(object3d: Object3D);
    update(): void;
    name(): string;
}
