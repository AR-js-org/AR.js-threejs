import { EventDispatcher, Object3D} from "three";

export class ArBaseControls extends EventDispatcher {
    static id: number;
    private _id;
    protected object3d: Object3D;
    constructor(object3d: Object3D) {
        super()
        this._id = ArBaseControls.id++;

        this.object3d = object3d;
        this.object3d.matrixAutoUpdate = false;
        this.object3d.visible = false;
    }

    update() {
        console.assert(false, "you need to implement your own update");
    };

    name() {
        console.assert(false, "you need to implement your own .name()");
        return "Not yet implemented - name()";
    };
}