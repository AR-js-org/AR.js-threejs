import { EventDispatcher, Object3D } from "three";
import { IArBaseControls } from "./CommonInterfaces/THREEx-interfaces";
export declare class ArBaseControls extends EventDispatcher implements IArBaseControls {
    static _id: number;
    private id;
    protected object3d: Object3D;
    constructor(object3d: Object3D);
    update(): void;
    name(): string;
}
