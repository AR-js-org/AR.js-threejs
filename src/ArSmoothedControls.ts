import { ArBaseControls } from "./ArBaseControls";
import { ISmoothedControlsParameters, IArSmoothedControls } from "./CommonInterfaces/THREEx-interfaces";
import { setParameters } from './common-functions/utilityFunctions';
import { Object3D } from "three";

export class ArSmoothedControls extends ArBaseControls implements IArSmoothedControls {
    private _lastLerpStepAt: number | null;
    private _visibleStartedAt: number | null;
    private _unvisibleStartedAt: number | null;
    public parameters: ISmoothedControlsParameters;
    /**
     * - lerp position/quaternino/scale
     * - minDelayDetected
     * - minDelayUndetected
     * @constructor
     * @param {[type]} object3d   [description]
     * @param {[type]} parameters [description]
     */
    constructor(object3d: Object3D, parameters?: ISmoothedControlsParameters) {
        super(object3d);
        // copy parameters
        this.object3d.visible = false;

        this._lastLerpStepAt = null;
        this._visibleStartedAt = null;
        this._unvisibleStartedAt = null;

        // handle default parameters
        this.parameters = {
            // lerp coeficient for the position - between [0,1] - default to 1
            lerpPosition: 0.8,
            // lerp coeficient for the quaternion - between [0,1] - default to 1
            lerpQuaternion: 0.2,
            // lerp coeficient for the scale - between [0,1] - default to 1
            lerpScale: 0.7,
            // delay for lerp fixed steps - in seconds - default to 1/120
            lerpStepDelay: 1 / 60,
            // minimum delay the sub-control must be visible before this controls become visible - default to 0 seconds
            minVisibleDelay: 0.0,
            // minimum delay the sub-control must be unvisible before this controls become unvisible - default to 0 seconds
            minUnvisibleDelay: 0.2,
        };

        //////////////////////////////////////////////////////////////////////////////
        //		setParameters
        //////////////////////////////////////////////////////////////////////////////
        setParameters(parameters, this);
    }
    
    /**
     * update the object3d with the targetObject3d
     * @param {Object3D} targetObject3d 
     * @returns {void}
     */
    update(targetObject3d: Object3D): void {
        var object3d = this.object3d;
        var parameters = this.parameters;
        var wasVisible = object3d.visible;
        var present = performance.now() / 1000;

        //////////////////////////////////////////////////////////////////////////////
        //		handle object3d.visible with minVisibleDelay/minUnvisibleDelay
        //////////////////////////////////////////////////////////////////////////////
        if (targetObject3d.visible === false) this._visibleStartedAt = null;
        if (targetObject3d.visible === true) this._unvisibleStartedAt = null;

        if (targetObject3d.visible === true && this._visibleStartedAt === null)
            this._visibleStartedAt = present;
        if (targetObject3d.visible === false && this._unvisibleStartedAt === null)
            this._unvisibleStartedAt = present;

        if (wasVisible === false && targetObject3d.visible === true) {
            var visibleFor = present - this._visibleStartedAt;
            if (visibleFor >= this.parameters.minVisibleDelay) {
                object3d.visible = true;
                snapDirectlyToTarget();
            }
            // console.log('visibleFor', visibleFor)
        }

        if (wasVisible === true && targetObject3d.visible === false) {
            var unvisibleFor = present - this._unvisibleStartedAt;
            if (unvisibleFor >= this.parameters.minUnvisibleDelay) {
                object3d.visible = false;
            }
        }
        //////////////////////////////////////////////////////////////////////////////
        //		apply lerp on positon/quaternion/scale
        //////////////////////////////////////////////////////////////////////////////

        // apply lerp steps - require fix time steps to behave the same no matter the fps
        if (this._lastLerpStepAt === null) {
            applyOneSlerpStep();
            this._lastLerpStepAt = present;
        } else {
            var nStepsToDo = Math.floor(
                (present - this._lastLerpStepAt) / this.parameters.lerpStepDelay
            );
            for (var i = 0; i < nStepsToDo; i++) {
                applyOneSlerpStep();
                this._lastLerpStepAt += this.parameters.lerpStepDelay;
            }
        }

        // disable the lerp by directly copying targetObject3d position/quaternion/scale
        if (false) {
            snapDirectlyToTarget();
        }

        // update the matrix
        this.object3d.updateMatrix();

        //////////////////////////////////////////////////////////////////////////////
        //		honor becameVisible/becameUnVisible event
        //////////////////////////////////////////////////////////////////////////////
        // honor becameVisible event
        if (wasVisible === false && object3d.visible === true) {
            this.dispatchEvent({ type: "becameVisible" });
        }
        // honor becameUnVisible event
        if (wasVisible === true && object3d.visible === false) {
            this.dispatchEvent({ type: "becameUnVisible" });
        }
        return;

        function snapDirectlyToTarget() {
            object3d.position.copy(targetObject3d.position);
            object3d.quaternion.copy(targetObject3d.quaternion);
            object3d.scale.copy(targetObject3d.scale);
        }

        function applyOneSlerpStep() {
            object3d.position.lerp(targetObject3d.position, parameters.lerpPosition);
            object3d.quaternion.slerp(
                targetObject3d.quaternion,
                parameters.lerpQuaternion
            );
            object3d.scale.lerp(targetObject3d.scale, parameters.lerpScale);
        }
    }

    name(): string {
        return "";
    }
}
