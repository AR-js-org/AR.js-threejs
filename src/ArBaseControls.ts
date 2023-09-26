import { EventDispatcher, Object3D } from "three";
import { IArBaseControls } from "./CommonInterfaces/THREEx-interfaces";

export abstract class ArBaseControls extends EventDispatcher implements IArBaseControls {
    static _id: number = 0;
    public id: number;
    protected object3d: Object3D;
    /**
     * THe ArBaseControls constructor, you need to pass a Three.js Object3D to it.
     * @param object3d the Three.js Object3D to pass.
     */
    constructor(object3d: Object3D) {
        super()
        this.id = ArBaseControls._id++
        this.object3d = object3d;
        this.object3d.matrixAutoUpdate = false;
        this.object3d.visible = false;
    }

    /**
     * a virtual update method to implement in the derived class.
     * @return {void}
     */
    abstract update(object3d: Object3D): void;

    /**
     * a virtual name method to implement in the derived class.
     * @return {string}
     */
    abstract name(): string;
}