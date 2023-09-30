//import * as THREE from "three";
import { Camera, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, Quaternion, Raycaster, Scene, Vector2, Vector3 } from "three";

// TODO this is useless - prefere arjs-HitTesting.js

/**
 * - maybe support .onClickFcts in each object3d
 * - seems an easy light layer for clickable object
 * - up to
 */
export class HitTestingPlane  {
    private _sourceElement: any;
    private _pickingScene: any;
    private _pickingPlane: any;
    private _pickingCamera: any;
    constructor (sourceElement: HTMLElement) {
        this._sourceElement = sourceElement;

        // create _pickingScene
        this._pickingScene = new Scene();
      
        // create _pickingPlane
        var geometry = new PlaneGeometry(20, 20, 19, 19).rotateX(-Math.PI / 2);
        // var geometry = new THREE.PlaneGeometry(20,20).rotateX(-Math.PI/2)
        var material = new MeshBasicMaterial({
          // opacity: 0.5,
          // transparent: true,
          wireframe: true,
        });
        // material.visible = false
        this._pickingPlane = new Mesh(geometry, material);
        this._pickingScene.add(this._pickingPlane);
      
        // Create pickingCamera
        var fullWidth = parseInt(sourceElement.style.width);
        var fullHeight = parseInt(sourceElement.style.height);
        // TODO hardcoded fov - couch
        this._pickingCamera = new PerspectiveCamera(
          42,
          fullWidth / fullHeight,
          0.1,
          30
        );
    }


//////////////////////////////////////////////////////////////////////////////
//		update function
//////////////////////////////////////////////////////////////////////////////

update (
  camera: Camera,
  pickingRoot: Object3D,
  changeMatrixMode: string
) {
  this.onResize();

  if (changeMatrixMode === "modelViewMatrix") {
    // set pickingPlane position
    var pickingPlane = this._pickingPlane;
    pickingRoot.parent.updateMatrixWorld();
    pickingPlane.matrix.copy(pickingRoot.parent.matrixWorld);
    // set position/quaternion/scale from pickingPlane.matrix
    pickingPlane.matrix.decompose(
      pickingPlane.position,
      pickingPlane.quaternion,
      pickingPlane.scale
    );
  } else if (changeMatrixMode === "cameraTransformMatrix") {
    // set pickingPlane position
    var pickingCamera = this._pickingCamera;
    camera.updateMatrixWorld();
    pickingCamera.matrix.copy(camera.matrixWorld);
    // set position/quaternion/scale from pickingCamera.matrix
    pickingCamera.matrix.decompose(
      pickingCamera.position,
      pickingCamera.quaternion,
      pickingCamera.scale
    );
  } else console.assert(false);

  // var position = this._pickingPlane.position
  // console.log('pickingPlane position', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2))
  // var position = this._pickingCamera.position
  // console.log('his._pickingCamera position', position.x.toFixed(2), position.y.toFixed(2), position.z.toFixed(2))
};

//////////////////////////////////////////////////////////////////////////////
//		resize camera
//////////////////////////////////////////////////////////////////////////////

onResize () {
  var sourceElement = this._sourceElement;
  var pickingCamera = this._pickingCamera;

  // FIXME why using css here ??? not even computed style
  // should get the size of the elment directly independantly
  var fullWidth = parseInt(sourceElement.style.width);
  var fullHeight = parseInt(sourceElement.style.height);
  pickingCamera.aspect = fullWidth / fullHeight;

  pickingCamera.updateProjectionMatrix();
};

//////////////////////////////////////////////////////////////////////////////
//		Perform test
//////////////////////////////////////////////////////////////////////////////
test (mouseX: number, mouseY: number) {
  // convert mouseX, mouseY to [-1, +1]
  mouseX = (mouseX - 0.5) * 2;
  mouseY = -(mouseY - 0.5) * 2;

  this._pickingScene.updateMatrixWorld(true);

  // compute intersections between mouseVector3 and pickingPlane
  var raycaster = new Raycaster();
  //var mouseVector3 = new THREE.Vector3(mouseX, mouseY, 1);
  var mouseVector2 = new Vector2(mouseX, mouseY);
  raycaster.setFromCamera(mouseVector2, this._pickingCamera);
  var intersects = raycaster.intersectObjects([this._pickingPlane]);

  if (intersects.length === 0) return null;

  // set new demoRoot position
  var position = this._pickingPlane.worldToLocal(intersects[0].point.clone());
  // TODO here do a look at the camera ?
  var quaternion = new Quaternion();
  var scale = new Vector3(1, 1, 1); //.multiplyScalar(1)

  return {
    position: position,
    quaternion: quaternion,
    scale: scale,
  };
};

//////////////////////////////////////////////////////////////////////////////
//		render the pickingPlane for debug
//////////////////////////////////////////////////////////////////////////////

renderDebug (renderer: any) {
  // render sceneOrtho
  renderer.render(this._pickingScene, this._pickingCamera);
};
};