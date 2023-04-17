import { EventDispatcher, Object3D } from "three";
import { IArBaseControls } from "./CommonInterfaces/THREEx-interfaces";
export declare abstract class ArBaseControls extends EventDispatcher implements IArBaseControls {
    static _id: number;
    id: number;
    protected object3d: Object3D;
    constructor(object3d: Object3D);
    abstract update(object3d: Object3D): void;
    abstract name(): string;
}
