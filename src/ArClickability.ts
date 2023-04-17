import { PerspectiveCamera, Vector3, Vector2, Raycaster } from "three";
export class ARClickability {
    private _sourceElement: any;
    private _cameraPicking: PerspectiveCamera;
    constructor(sourceElement: HTMLElement) {
        this._sourceElement = sourceElement;
        // Create cameraPicking
        var fullWidth = parseInt(sourceElement.style.width);
        var fullHeight = parseInt(sourceElement.style.height);
        this._cameraPicking = new PerspectiveCamera(
            42,
            fullWidth / fullHeight,
            0.1,
            100
        );

        console.warn("ARClickability works only in modelViewMatrix");
        console.warn("OBSOLETE OBSOLETE! instead use THREEx.HitTestingPlane");
    }

    onResize() {
        var sourceElement = this._sourceElement;
        var cameraPicking = this._cameraPicking;

        var fullWidth = parseInt(sourceElement.style.width);
        var fullHeight = parseInt(sourceElement.style.height);
        cameraPicking.aspect = fullWidth / fullHeight;
        cameraPicking.updateProjectionMatrix();
    };

    computeIntersects(domEvent: any, objects: any) {
        var sourceElement = this._sourceElement;
        var cameraPicking = this._cameraPicking;

        // compute mouse coordinatge with [-1,1]
        var eventCoords = new Vector2();
        eventCoords.x =
            (domEvent.layerX / parseInt(sourceElement.style.width)) * 2 - 1;
        eventCoords.y =
            -(domEvent.layerY / parseInt(sourceElement.style.height)) * 2 + 1;

        // compute intersections between eventCoords and pickingPlane
        var raycaster = new Raycaster();
        raycaster.setFromCamera(eventCoords, cameraPicking);
        var intersects = raycaster.intersectObjects(objects);

        return intersects;
    };

    update() { };


};