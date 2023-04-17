import { AxesHelper, CanvasTexture, Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import { ArMarkerControls } from './ArMarkerControls'

export class ArMarkerHelper {
    public object3d: Group;
    /**
     * A simple helper class to display a 3d axesHelper mesh and the marker id on the marker.
     * @constructor 
     * @param markerControls 
     */
    constructor(markerControls: ArMarkerControls) {
        this.object3d = new Group();

        var axesHelper = new AxesHelper();
        this.object3d.add(axesHelper);

        var text = <string><unknown>markerControls.id;
        // debugger
        // var text = markerControls.parameters.patternUrl.slice(-1).toUpperCase();

        var canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;

        var context = canvas.getContext("2d");
        var texture = new CanvasTexture(canvas);

        // put the text in the sprite
        context.font = "48px monospace";
        context.fillStyle = "rgba(192,192,255, 0.5)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "darkblue";
        context.fillText(text, canvas.width / 4, (3 * canvas.height) / 4);
        texture.needsUpdate = true;

        // var geometry = new THREE.CubeGeometry(1, 1, 1)
        var geometry = new PlaneGeometry(1, 1);
        var material = new MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        var mesh = new Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;

        this.object3d.add(mesh);
    }
}