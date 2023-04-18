import { Matrix4 } from "three";
import { Context } from "../Context"; // TODO context build-dependent

export class MarkersAreaUtils {

  //////////////////////////////////////////////////////////////////////////////
  //		navigateToLearnerPage
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Navigate to the multi-marker learner page
   *
   * @param {String} learnerBaseURL  - the base url for the learner
   * @param {String} trackingBackend - the tracking backend to use
   */
  static navigateToLearnerPage(
    learnerBaseURL: any,
    trackingBackend: string
  ) {
    var learnerParameters = {
      backURL: location.href,
      trackingBackend: trackingBackend,
      markersControlsParameters:
        MarkersAreaUtils.createDefaultMarkersControlsParameters(trackingBackend),
    };
    location.href =
      learnerBaseURL +
      "?" +
      encodeURIComponent(JSON.stringify(learnerParameters));
  };

  //////////////////////////////////////////////////////////////////////////////
  //		DefaultMultiMarkerFile
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Create and store a default multi-marker file
   *
   * @param {String} trackingBackend - the tracking backend to use
   */
  static storeDefaultMultiMarkerFile(trackingBackend: string) {
    var file = MarkersAreaUtils.createDefaultMultiMarkerFile(trackingBackend);
    // json.strinfy the value and store it in localStorage
    localStorage.setItem("ARjsMultiMarkerFile", JSON.stringify(file));
  };

  /**
   * Create a default multi-marker file
   * @param {String} trackingBackend - the tracking backend to use
   * @return {Object} - json object of the multi-marker file
   */
  static createDefaultMultiMarkerFile(trackingBackend: string) {
    console.assert(trackingBackend);
    if (trackingBackend === undefined) debugger;

    // create absoluteBaseURL
    var link = document.createElement("a");
    link.href = Context.baseURL;
    var absoluteBaseURL = link.href;

    // create the base file
    var file = {
      meta: {
        createdBy: "AR.js " + Context.REVISION + " - Default Marker",
        createdAt: new Date().toJSON(),
      },
      trackingBackend: trackingBackend,
      subMarkersControls: [
        // empty for now... being filled
      ] as any[],
    };
    // add a subMarkersControls
    file.subMarkersControls[0] = {
      parameters: {},
      poseMatrix: new Matrix4().makeTranslation(0, 0, 0).toArray(),
    };
    if (trackingBackend === "artoolkit") {
      file.subMarkersControls[0].parameters.type = "pattern";
      file.subMarkersControls[0].parameters.patternUrl =
        absoluteBaseURL +
        "examples/marker-training/examples/pattern-files/pattern-hiro.patt";
    } else console.assert(false);

    // json.strinfy the value and store it in localStorage
    return file;
  };

  //////////////////////////////////////////////////////////////////////////////
  //		createDefaultMarkersControlsParameters
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Create a default controls parameters for the multi-marker learner
   *
   * @param {String} trackingBackend - the tracking backend to use
   * @return {Object} - json object containing the controls parameters
   */
  static createDefaultMarkersControlsParameters(
    trackingBackend: any
  ) {
    // create absoluteBaseURL
    var link = document.createElement("a");
    link.href = Context.baseURL;
    var absoluteBaseURL = link.href;

    if (trackingBackend === "artoolkit") {
      // pattern hiro/kanji/a/b/c/f
      var markersControlsParameters = [
        {
          type: "pattern",
          patternUrl:
            absoluteBaseURL +
            "examples/marker-training/examples/pattern-files/pattern-hiro.patt",
        },
        {
          type: "pattern",
          patternUrl:
            absoluteBaseURL +
            "examples/marker-training/examples/pattern-files/pattern-kanji.patt",
        },
        {
          type: "pattern",
          patternUrl:
            absoluteBaseURL +
            "examples/marker-training/examples/pattern-files/pattern-letterA.patt",
        },
        {
          type: "pattern",
          patternUrl:
            absoluteBaseURL +
            "examples/marker-training/examples/pattern-files/pattern-letterB.patt",
        },
        {
          type: "pattern",
          patternUrl:
            absoluteBaseURL +
            "examples/marker-training/examples/pattern-files/pattern-letterC.patt",
        },
        {
          type: "pattern",
          patternUrl:
            absoluteBaseURL +
            "examples/marker-training/examples/pattern-files/pattern-letterF.patt",
        },
      ];
    } else console.assert(false);
    return markersControlsParameters;
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Code Separator
  //////////////////////////////////////////////////////////////////////////////
  /**
   * generate areaFile
   */
  static storeMarkersAreaFileFromResolution(
    trackingBackend: string,
    resolutionW: number,
    resolutionH: number
  ) {
    // generate areaFile
    var areaFile = this.buildMarkersAreaFileFromResolution(
      trackingBackend,
      resolutionW,
      resolutionH
    );
    // store areaFile in localStorage
    localStorage.setItem("ARjsMultiMarkerFile", JSON.stringify(areaFile));
  };

  //////////////////////////////////////////////////////////////////////////////
  //		Code Separator
  //////////////////////////////////////////////////////////////////////////////

  static buildMarkersAreaFileFromResolution(
    trackingBackend: string,
    resolutionW: number,
    resolutionH: number
  ) {
    // create the base file
    var file = {
      meta: {
        createdBy: "AR.js - Augmented Website",
        createdAt: new Date().toJSON(),
      },
      trackingBackend: trackingBackend,
      subMarkersControls: [
        // empty for now...
      ] as any[],
    };

    var whiteMargin = 0.1;
    if (resolutionW > resolutionH) {
      var markerImageSize = 0.4 * resolutionH;
    } else if (resolutionW < resolutionH) {
      var markerImageSize = 0.4 * resolutionW;
    } else if (resolutionW === resolutionH) {
      // specific for twitter player - https://dev.twitter.com/cards/types/player
      var markerImageSize = 0.33 * resolutionW;
    } else console.assert(false);

    // console.warn('using new markerImageSize computation')
    var actualMarkerSize = markerImageSize * (1 - 2 * whiteMargin);

    var deltaX = (resolutionW - markerImageSize) / 2 / actualMarkerSize;
    var deltaZ = (resolutionH - markerImageSize) / 2 / actualMarkerSize;

    var subMarkerControls = buildSubMarkerControls("center", 0, 0);
    file.subMarkersControls.push(subMarkerControls);

    var subMarkerControls = buildSubMarkerControls("topleft", -deltaX, -deltaZ);
    file.subMarkersControls.push(subMarkerControls);

    var subMarkerControls = buildSubMarkerControls("topright", +deltaX, -deltaZ);
    file.subMarkersControls.push(subMarkerControls);

    var subMarkerControls = buildSubMarkerControls(
      "bottomleft",
      -deltaX,
      +deltaZ
    );
    file.subMarkersControls.push(subMarkerControls);

    var subMarkerControls = buildSubMarkerControls(
      "bottomright",
      +deltaX,
      +deltaZ
    );
    file.subMarkersControls.push(subMarkerControls);

    return file;

    //////////////////////////////////////////////////////////////////////////////
    //		Code Separator
    //////////////////////////////////////////////////////////////////////////////

    function buildSubMarkerControls(layout: any, positionX: number, positionZ: number) {
      console.log("buildSubMarkerControls", layout, positionX, positionZ);
      // create subMarkersControls
      var subMarkersControls = {
        parameters: {},
        poseMatrix: new Matrix4()
          .makeTranslation(positionX, 0, positionZ)
          .toArray(),
      };
      // fill the parameters
      if (trackingBackend === "artoolkit") {
        layout2MarkerParametersArtoolkit(subMarkersControls.parameters, layout);
      } else console.assert(false);
      // return subMarkersControls
      return subMarkersControls;
    }

    function layout2MarkerParametersArtoolkit(parameters: any, layout: any) {
      // create absoluteBaseURL
      var link = document.createElement("a");
      link.href = Context.baseURL;
      var absoluteBaseURL = link.href;

      var layout2PatternUrl = {
        center: convertRelativeUrlToAbsolute(
          absoluteBaseURL +
          "examples/marker-training/examples/pattern-files/pattern-hiro.patt"
        ),
        topleft: convertRelativeUrlToAbsolute(
          absoluteBaseURL +
          "examples/marker-training/examples/pattern-files/pattern-letterA.patt"
        ),
        topright: convertRelativeUrlToAbsolute(
          absoluteBaseURL +
          "examples/marker-training/examples/pattern-files/pattern-letterB.patt"
        ),
        bottomleft: convertRelativeUrlToAbsolute(
          absoluteBaseURL +
          "examples/marker-training/examples/pattern-files/pattern-letterC.patt"
        ),
        bottomright: convertRelativeUrlToAbsolute(
          absoluteBaseURL +
          "examples/marker-training/examples/pattern-files/pattern-letterF.patt"
        ),
      };
      //@ts-ignore
      console.assert(layout2PatternUrl[layout] !== undefined);
      parameters.type = "pattern";
      //@ts-ignore
      parameters.patternUrl = layout2PatternUrl[layout];
      return;
      function convertRelativeUrlToAbsolute(relativeUrl: any) {
        var tmpLink = document.createElement("a");
        tmpLink.href = relativeUrl;
        return tmpLink.href;
      }
    }
  };
};
