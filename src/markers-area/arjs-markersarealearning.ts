import { Matrix4, Quaternion, Vector3} from "three";
import { MarkersAreaControls } from "./arjs-markersareacontrols";
import { ArToolkitContext } from "../ArToolkitContext";

export class MarkersAreaLearning {
  private _arToolkitContext: any;
  private subMarkersControls: any;
  private enabled: boolean;
  constructor(arToolkitContext: any, subMarkersControls: any) {
    //var _this = this;
    this._arToolkitContext = arToolkitContext;

    // Init variables
    this.subMarkersControls = subMarkersControls;
    this.enabled = true;

    // listen to arToolkitContext event 'sourceProcessed'
    // - after we fully processed one image, aka when we know all detected poses in it
    arToolkitContext.addEventListener("sourceProcessed", () => {
      this._onSourceProcessed();
    });
  };

  //////////////////////////////////////////////////////////////////////////////
  //		statistic collection
  //////////////////////////////////////////////////////////////////////////////

  /**
   * What to do when a image source is fully processed
   */
  _onSourceProcessed() {
    var originQuaternion = this.subMarkersControls[0].object3d.quaternion;
    // here collect the statistic on relative positioning

    // honor this.enabled
    if (this.enabled === false) return;

    // keep only the visible markers
    var visibleMarkerControls = this.subMarkersControls.filter(function (
      markerControls: any
    ) {
      return markerControls.object3d.visible === true;
    });

    var count = Object.keys(visibleMarkerControls).length;

    var positionDelta = new Vector3();
    var quaternionDelta = new Quaternion();
    var scaleDelta = new Vector3();
    var tmpMatrix = new Matrix4();

    // go thru all the visibleMarkerControls
    for (var i = 0; i < count; i++) {
      var markerControls1 = visibleMarkerControls[i];
      for (var j = 0; j < count; j++) {
        var markerControls2 = visibleMarkerControls[j];

        // if markerControls1 is markerControls2, then skip it
        if (i === j) continue;

        //////////////////////////////////////////////////////////////////////////////
        //		create data in markerControls1.object3d.userData if needed
        //////////////////////////////////////////////////////////////////////////////
        // create seenCouples for markerControls1 if needed
        if (markerControls1.object3d.userData.seenCouples === undefined) {
          markerControls1.object3d.userData.seenCouples = {};
        }
        var seenCouples = markerControls1.object3d.userData.seenCouples;
        // create the multiMarkerPosition average if needed`
        if (seenCouples[markerControls2.id] === undefined) {
          // console.log('create seenCouples between', markerControls1.id, 'and', markerControls2.id)
          seenCouples[markerControls2.id] = {
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
        }

        //////////////////////////////////////////////////////////////////////////////
        //		Compute markerControls2 position relative to markerControls1
        //////////////////////////////////////////////////////////////////////////////

        // compute markerControls2 position/quaternion/scale in relation with markerControls1
        tmpMatrix.copy(markerControls1.object3d.matrix).invert();
        tmpMatrix.multiply(markerControls2.object3d.matrix);
        tmpMatrix.decompose(positionDelta, quaternionDelta, scaleDelta);

        //////////////////////////////////////////////////////////////////////////////
        //		update statistics
        //////////////////////////////////////////////////////////////////////////////
        var stats = seenCouples[markerControls2.id];
        // update the count
        stats.count++;

        // update the average of position/rotation/scale
        MarkersAreaControls.averageVector3(
          stats.position.sum,
          positionDelta,
          stats.count,
          stats.position.average
        );
        MarkersAreaControls.averageQuaternion(
          stats.quaternion.sum,
          quaternionDelta,
          originQuaternion,
          stats.count,
          stats.quaternion.average
        );
        MarkersAreaControls.averageVector3(
          stats.scale.sum,
          scaleDelta,
          stats.count,
          stats.scale.average
        );
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Compute markers transformation matrix from current stats
  //////////////////////////////////////////////////////////////////////////////

  computeResult() {
    var _this = this;
    var originSubControls = this.subMarkersControls[0];

    this.deleteResult();

    // special case of originSubControls averageMatrix
    originSubControls.object3d.userData.result = {
      averageMatrix: new Matrix4(),
      confidenceFactor: 1,
    };
    // TODO here check if the originSubControls has been seen at least once!!

    /**
     * ALGO in pseudo code
     *
     * - Set confidenceFactor of origin sub markers as 1
     *
     * Start Looping
     * - For a given sub marker, skip it if it already has a result.
     * - if no result, check all seen couple and find n ones which has a progress of 1 or more.
     * - So the other seen sub markers, got a valid transformation matrix.
     * - So take local averages position/orientation/scale, compose a transformation matrix.
     *   - aka transformation matrix from parent matrix * transf matrix pos/orientation/scale
     * - Multiple it by the other seen marker matrix.
     * - Loop on the array until one pass could not compute any new sub marker
     */

    do {
      var resultChanged = false;
      // loop over each subMarkerControls
      this.subMarkersControls.forEach(function (subMarkerControls: any) {
        // if subMarkerControls already has a result, do nothing
        var result = subMarkerControls.object3d.userData.result;
        var isLearned =
          result !== undefined && result.confidenceFactor >= 1 ? true : false;
        if (isLearned === true) return;

        // console.log('compute subMarkerControls', subMarkerControls.name())
        var otherSubControlsID = _this._getLearnedCoupleStats(subMarkerControls);
        if (otherSubControlsID === null) {
          // console.log('no learnedCoupleStats')
          return;
        }

        var otherSubControls =
          _this._getSubMarkerControlsByID(otherSubControlsID);

        var seenCoupleStats =
          subMarkerControls.object3d.userData.seenCouples[otherSubControlsID];

        var averageMatrix = new Matrix4();
        averageMatrix.compose(
          seenCoupleStats.position.average,
          seenCoupleStats.quaternion.average,
          seenCoupleStats.scale.average
        );

        var otherAverageMatrix =
          otherSubControls.object3d.userData.result.averageMatrix;

        //var matrix = new THREE.Matrix4()
        //  .invert(otherAverageMatrix)
        var matrix = otherAverageMatrix.invert()
          .multiply(averageMatrix);
        matrix.invert()// = new THREE.Matrix4().getInverse(matrix);

        console.assert(subMarkerControls.object3d.userData.result === undefined);
        subMarkerControls.object3d.userData.result = {
          averageMatrix: matrix,
          confidenceFactor: 1,
        };

        resultChanged = true;
      });
      // console.log('loop')
    } while (resultChanged === <boolean>true);

    // debugger
    // console.log('json:', this.toJSON())
    // this.subMarkersControls.forEach(function(subMarkerControls){
    // 	var hasResult = subMarkerControls.object3d.userData.result !== undefined
    // 	console.log('marker', subMarkerControls.name(), hasResult ? 'has' : 'has NO', 'result')
    // })
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Utility function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * get a _this.subMarkersControls id based on markerControls.id
   */
  _getLearnedCoupleStats(
    subMarkerControls: any
  ) {
    // if this subMarkerControls has never been seen with another subMarkerControls
    if (subMarkerControls.object3d.userData.seenCouples === undefined)
      return null;

    var seenCouples = subMarkerControls.object3d.userData.seenCouples;
    var coupleControlsIDs = Object.keys(seenCouples).map(Number);

    for (var i = 0; i < coupleControlsIDs.length; i++) {
      var otherSubControlsID = coupleControlsIDs[i];
      // get otherSubControls
      var otherSubControls = this._getSubMarkerControlsByID(otherSubControlsID);

      // if otherSubControls isnt learned, skip it
      var result = otherSubControls.object3d.userData.result;
      var isLearned =
        result !== undefined && result.confidenceFactor >= 1 ? true : false;
      if (isLearned === false) continue;

      // return this seenCouplesStats
      return otherSubControlsID;
    }

    // if none is found, return null
    return null;
  };

  /**
   * get a _this.subMarkersControls based on markerControls.id
   */
  _getSubMarkerControlsByID(
    controlsID: any
  ) {
    for (var i = 0; i < this.subMarkersControls.length; i++) {
      var subMarkerControls = this.subMarkersControls[i];
      if (subMarkerControls.id === controlsID) {
        return subMarkerControls;
      }
    }

    return null;
  };
  //////////////////////////////////////////////////////////////////////////////
  //		JSON file building
  //////////////////////////////////////////////////////////////////////////////

  toJSON() {
    // compute the average matrix before generating the file
    this.computeResult();

    //////////////////////////////////////////////////////////////////////////////
    //		actually build the json
    //////////////////////////////////////////////////////////////////////////////
    var data = {
      meta: {
        createdBy: "Area Learning - AR.js " + ArToolkitContext.REVISION, // TODO: ArToolkitContext depending on build
        createdAt: new Date().toJSON(),
      },
      trackingBackend: this._arToolkitContext.parameters.trackingBackend,
      subMarkersControls: [] as any[],
    };

    var originSubControls = this.subMarkersControls[0];
    var originMatrixInverse = new Matrix4()
      .copy(originSubControls.object3d.matrix)
      .invert();
    this.subMarkersControls.forEach(function (subMarkerControls: any, index: number) {
      // if a subMarkerControls has no result, ignore it
      if (subMarkerControls.object3d.userData.result === undefined) return;

      var poseMatrix = subMarkerControls.object3d.userData.result.averageMatrix;
      console.assert(poseMatrix instanceof Matrix4);

      // build the info
      var info: any = {
        parameters: {
          // to fill ...
        },
        poseMatrix: poseMatrix.toArray(),
      };
      if (subMarkerControls.parameters.type === "pattern") {
        info.parameters.type = subMarkerControls.parameters.type;
        info.parameters.patternUrl = subMarkerControls.parameters.patternUrl;
      } else if (subMarkerControls.parameters.type === "barcode") {
        info.parameters.type = subMarkerControls.parameters.type;
        info.parameters.barcodeValue = subMarkerControls.parameters.barcodeValue;
      } else console.assert(false);

      data.subMarkersControls.push(info);
    });

    var strJSON = JSON.stringify(data, null, "\t");

    //////////////////////////////////////////////////////////////////////////////
    //		round matrix elements to ease readability - for debug
    //////////////////////////////////////////////////////////////////////////////
    var humanReadable = false;
    if (humanReadable === <boolean>true) {
      var tmp = JSON.parse(strJSON);
      tmp.subMarkersControls.forEach(function (markerControls: any) {
        markerControls.poseMatrix = markerControls.poseMatrix.map(function (
          value: any
        ) {
          var roundingFactor = 100;
          return Math.round(value * roundingFactor) / roundingFactor;
        });
      });
      strJSON = JSON.stringify(tmp, null, "\t");
    }

    return strJSON;
  };

  //////////////////////////////////////////////////////////////////////////////
  //		utility function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * reset all collected statistics
   */
  resetStats() {
    this.deleteResult();

    this.subMarkersControls.forEach(function (markerControls: any) {
      delete markerControls.object3d.userData.seenCouples;
    });
  };
  /**
   * reset all collected statistics
   */
  deleteResult() {
    this.subMarkersControls.forEach(function (markerControls: any) {
      delete markerControls.object3d.userData.result;
    });
  };
}