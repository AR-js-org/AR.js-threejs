import { Box3, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { ArBaseControls } from "../ArBaseControls";
import { ArMarkerControls } from "../ArMarkerControls";
import { IArMarkerControls, IArMarkerAreaControlsParameters } from "../CommonInterfaces/THREEx-interfaces";
/**
 * @class {MarkersAreaControls}
 * @param {*} arToolkitContext 
 * @param {*} object3d 
 * @param {*} parameters 
 */

export class MarkersAreaControls extends ArBaseControls {
  public subMarkersControls: IArMarkerControls[];
  public subMarkerPoses: THREE.Matrix4[];
  public parameters: IArMarkerAreaControlsParameters;
  //public object3d: any;
  constructor(arToolkitContext: any, object3d: Object3D, parameters: any) {
    super(object3d)
    var _this = this;

    this.parameters = {} as IArMarkerAreaControlsParameters;

    if (arguments.length > 3)
      //console.assert("wrong api for", MarkersAreaControls);

      // have a parameters in argument
      this.parameters = {
        // list of controls for each subMarker
        subMarkersControls: parameters.subMarkersControls,
        // list of pose for each subMarker relative to the origin
        subMarkerPoses: parameters.subMarkerPoses,
        // change matrix mode - [modelViewMatrix, cameraTransformMatrix]
        changeMatrixMode:
          parameters.changeMatrixMode !== undefined
            ? parameters.changeMatrixMode
            : "modelViewMatrix",
      };

    this.object3d.visible = false;
    // honor obsolete stuff - add a warning to use
    this.subMarkersControls = this.parameters.subMarkersControls;
    this.subMarkerPoses = this.parameters.subMarkerPoses;

    // listen to arToolkitContext event 'sourceProcessed'
    // - after we fully processed one image, aka when we know all detected poses in it
    arToolkitContext.addEventListener("sourceProcessed", function () {
      _this._onSourceProcessed();
    });
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Code Separator
  //////////////////////////////////////////////////////////////////////////////

  /**
   * What to do when a image source is fully processed
   */
  _onSourceProcessed() {
    var _this = this;
    var stats = {
      count: 0,
      position: {
        sum: new Vector3(0, 0, 0),
        average: new Vector3(0, 0, 0),
      },
      quaternion: {
        sum: new Quaternion(0, 0, 0, 0),
        average: new Quaternion(0, 0, 0, 0),
      },
      scale: {
        sum: new Vector3(0, 0, 0),
        average: new Vector3(0, 0, 0),
      },
    };

    var firstQuaternion =
      _this.parameters.subMarkersControls[0].object3d.quaternion;

    this.parameters.subMarkersControls.forEach(function (
      markerControls: any,
      markerIndex: any
    ) {
      var markerObject3d = markerControls.object3d;
      // if this marker is not visible, ignore it
      if (markerObject3d.visible === false) return;

      // transformation matrix of this.object3d according to this sub-markers
      var matrix = markerObject3d.matrix.clone();
      var markerPose = _this.parameters.subMarkerPoses[markerIndex];
      matrix.multiply(new Matrix4().copy(markerPose).invert());

      // decompose the matrix into .position, .quaternion, .scale
      var position = new Vector3();
      var quaternion = new Quaternion();
      var scale = new Vector3();
      matrix.decompose(position, quaternion, scale);

      // http://wiki.unity3d.com/index.php/Averaging_Quaternions_and_Vectors
      stats.count++;

      MarkersAreaControls.averageVector3(
        stats.position.sum,
        position,
        stats.count,
        stats.position.average
      );
      MarkersAreaControls.averageQuaternion(
        stats.quaternion.sum,
        quaternion,
        firstQuaternion,
        stats.count,
        stats.quaternion.average
      );
      MarkersAreaControls.averageVector3(
        stats.scale.sum,
        scale,
        stats.count,
        stats.scale.average
      );
    });

    // honor _this.object3d.visible
    if (stats.count > 0) {
      _this.object3d.visible = true;
    } else {
      _this.object3d.visible = false;
    }

    // if at least one sub-marker has been detected, make the average of all detected markers
    if (stats.count > 0) {
      // compute modelViewMatrix
      var modelViewMatrix = new Matrix4();
      modelViewMatrix.compose(
        stats.position.average,
        stats.quaternion.average,
        stats.scale.average
      );

      // change _this.object3d.matrix based on parameters.changeMatrixMode
      if (this.parameters.changeMatrixMode === "modelViewMatrix") {
        _this.object3d.matrix.copy(modelViewMatrix);
      } else if (this.parameters.changeMatrixMode === "cameraTransformMatrix") {
        _this.object3d.matrix.copy(modelViewMatrix).invert();
      } else {
        console.assert(false);
      }

      // decompose - the matrix into .position, .quaternion, .scale
      _this.object3d.matrix.decompose(
        _this.object3d.position,
        _this.object3d.quaternion,
        _this.object3d.scale
      );
    }
  };

  update() { }

  name(): string { return ""; }

  //////////////////////////////////////////////////////////////////////////////
  //		Utility functions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * from http://wiki.unity3d.com/index.php/Averaging_Quaternions_and_Vectors
   */
  static averageQuaternion(
    quaternionSum: any,
    newQuaternion: any,
    firstQuaternion: any,
    count: any,
    quaternionAverage: any
  ) {
    quaternionAverage = quaternionAverage || new Quaternion();
    // sanity check
    console.assert(firstQuaternion instanceof Quaternion === true);

    // from http://wiki.unity3d.com/index.php/Averaging_Quaternions_and_Vectors
    if (newQuaternion.dot(firstQuaternion) > 0) {
      newQuaternion = new Quaternion(
        -newQuaternion.x,
        -newQuaternion.y,
        -newQuaternion.z,
        -newQuaternion.w
      );
    }

    quaternionSum.x += newQuaternion.x;
    quaternionSum.y += newQuaternion.y;
    quaternionSum.z += newQuaternion.z;
    quaternionSum.w += newQuaternion.w;

    quaternionAverage.x = quaternionSum.x / count;
    quaternionAverage.y = quaternionSum.y / count;
    quaternionAverage.z = quaternionSum.z / count;
    quaternionAverage.w = quaternionSum.w / count;

    quaternionAverage.normalize();

    return quaternionAverage;
  };

  static averageVector3(
    vector3Sum: any,
    vector3: any,
    count: any,
    vector3Average: any
  ) {
    vector3Average = vector3Average || new Vector3();

    vector3Sum.x += vector3.x;
    vector3Sum.y += vector3.y;
    vector3Sum.z += vector3.z;

    vector3Average.x = vector3Sum.x / count;
    vector3Average.y = vector3Sum.y / count;
    vector3Average.z = vector3Sum.z / count;

    return vector3Average;
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Utility function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * compute the center of this multimarker file
   */
  static computeCenter(jsonData: any) {
    var multiMarkerFile = JSON.parse(jsonData);
    var stats = {
      count: 0,
      position: {
        sum: new Vector3(0, 0, 0),
        average: new Vector3(0, 0, 0),
      },
      quaternion: {
        sum: new Quaternion(0, 0, 0, 0),
        average: new Quaternion(0, 0, 0, 0),
      },
      scale: {
        sum: new Vector3(0, 0, 0),
        average: new Vector3(0, 0, 0),
      },
    };
    var firstQuaternion = new Quaternion(); // FIXME ???

    multiMarkerFile.subMarkersControls.forEach(function (item: any) {
      var poseMatrix = new Matrix4().fromArray(item.poseMatrix);

      var position = new Vector3();
      var quaternion = new Quaternion();
      var scale = new Vector3();
      poseMatrix.decompose(position, quaternion, scale);

      // http://wiki.unity3d.com/index.php/Averaging_Quaternions_and_Vectors
      stats.count++;

      MarkersAreaControls.averageVector3(
        stats.position.sum,
        position,
        stats.count,
        stats.position.average
      );
      MarkersAreaControls.averageQuaternion(
        stats.quaternion.sum,
        quaternion,
        firstQuaternion,
        stats.count,
        stats.quaternion.average
      );
      MarkersAreaControls.averageVector3(
        stats.scale.sum,
        scale,
        stats.count,
        stats.scale.average
      );
    });

    var averageMatrix = new Matrix4();
    averageMatrix.compose(
      stats.position.average,
      stats.quaternion.average,
      stats.scale.average
    );

    return averageMatrix;
  };

  static computeBoundingBox(jsonData: any) {
    var multiMarkerFile = JSON.parse(jsonData);
    var boundingBox = new Box3();

    multiMarkerFile.subMarkersControls.forEach(function (item: any) {
      var poseMatrix = new Matrix4().fromArray(item.poseMatrix);

      var position = new Vector3();
      var quaternion = new Quaternion();
      var scale = new Vector3();
      poseMatrix.decompose(position, quaternion, scale);

      boundingBox.expandByPoint(position);
    });

    return boundingBox;
  };
  //////////////////////////////////////////////////////////////////////////////
  //		updateSmoothedControls
  //////////////////////////////////////////////////////////////////////////////

  updateSmoothedControls(
    smoothedControls: any,
    lerpsValues: any
  ) {
    // handle default values
    if (lerpsValues === undefined) {
      // FIXME this parameter format is uselessly cryptic
      // lerpValues = [
      // {lerpPosition: 0.5, lerpQuaternion: 0.2, lerpQuaternion: 0.7}
      // ]
      lerpsValues = [
        [0.3 + 0.1, 0.1, 0.3],
        [0.4 + 0.1, 0.1, 0.4],
        [0.4 + 0.1, 0.2, 0.5],
        [0.5 + 0.1, 0.2, 0.7],
        [0.5 + 0.1, 0.2, 0.7],
      ];
    }
    // count how many subMarkersControls are visible
    var nVisible = 0;
    this.parameters.subMarkersControls.forEach(function (
      markerControls: any,
      markerIndex: any
    ) {
      var markerObject3d = markerControls.object3d;
      if (markerObject3d.visible === true) nVisible++;
    });

    // find the good lerpValues
    if (lerpsValues[nVisible - 1] !== undefined) {
      var lerpValues = lerpsValues[nVisible - 1];
    } else {
      var lerpValues = lerpsValues[lerpsValues.length - 1];
    }

    // modify lerpValues in smoothedControls
    smoothedControls.parameters.lerpPosition = lerpValues[0];
    smoothedControls.parameters.lerpQuaternion = lerpValues[1];
    smoothedControls.parameters.lerpScale = lerpValues[2];
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Create ArMultiMarkerControls from JSON
  //////////////////////////////////////////////////////////////////////////////

  static fromJSON(
    arToolkitContext: any,
    parent3D: any,
    markerRoot: any,
    jsonData: any,
    parameters?: any
  ) {
    var multiMarkerFile = JSON.parse(jsonData);
    // declare variables
    var subMarkersControls: any = [];
    var subMarkerPoses: any = [];
    // handle default arguments
    parameters = parameters || {};

    // prepare the parameters
    multiMarkerFile.subMarkersControls.forEach(function (item: any) {
      // create a markerRoot
      var markerRoot = new Object3D();
      parent3D.add(markerRoot);

      // create markerControls for our markerRoot
      var subMarkerControls = new ArMarkerControls(
        arToolkitContext,
        markerRoot,
        item.parameters
      );

      // if( true ){
      // store it in the parameters
      subMarkersControls.push(subMarkerControls);
      subMarkerPoses.push(new Matrix4().fromArray(item.poseMatrix));
      // }else{
      // 		// build a smoothedControls
      // 		var smoothedRoot = new THREE.Group()
      // 		parent3D.add(smoothedRoot)
      // 		var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
      // 			lerpPosition : 0.1,
      // 			lerpQuaternion : 0.1,
      // 			lerpScale : 0.1,
      // 			minVisibleDelay: 0,
      // 			minUnvisibleDelay: 0,
      // 		})
      // 		onRenderFcts.push(function(delta){
      // 			smoothedControls.update(markerRoot)	// TODO this is a global
      // 		})
      //
      //
      // 		// store it in the parameters
      // 		subMarkersControls.push(smoothedControls)
      // 		subMarkerPoses.push(new THREE.Matrix4().fromArray(item.poseMatrix))
      // }
    });

    parameters.subMarkersControls = subMarkersControls;
    parameters.subMarkerPoses = subMarkerPoses;
    // create a new ArMultiMarkerControls
    var multiMarkerControls = new MarkersAreaControls(
      arToolkitContext,
      markerRoot,
      parameters
    );

    // return it
    return multiMarkerControls;
  };
}