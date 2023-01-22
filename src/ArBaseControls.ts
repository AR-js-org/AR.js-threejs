import { EventDispatcher, Object3D} from "three";
import { IArBaseControls } from "./CommonInterfaces/THREEx-interfaces";

export class ArBaseControls extends EventDispatcher implements IArBaseControls {
    static id: number;
    private _id;
    protected object3d: Object3D;
    /**
     * THe ArBaseControls constructor, you need to pass a Theee.js Object3d to it.
     * @param object3d the Threejs Object3D to pass.
     */
    constructor(object3d: Object3D) {
        super()
        this._id = ArBaseControls.id++;

        this.object3d = object3d;
        this.object3d.matrixAutoUpdate = false;
        this.object3d.visible = false;
    }

    /**
     * a virtual update method to implement in the derived class.
     * @return {void}
     */
    update(): void {
        console.assert(false, "you need to implement your own update");
    };

    /**
     * a virtual name method to implement in the derived class.
     * @return {string}
     */
    name(): string {
        console.assert(false, "you need to implement your own .name()");
        return "Not yet implemented - name()";
    };
}