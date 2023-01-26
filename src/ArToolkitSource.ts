import { IArToolkitSource, IArToolkitContext, ISourceParameters, IUserMediaConstraints } from "./CommonInterfaces/THREEx-interfaces";
import { setParameters } from "./common-functions/utilityFunctions";
import { Renderer, Camera } from 'three'

declare global {
  var arToolkitSource: IArToolkitSource;
}
/**
 * ArToolkitSource
 * @class ArToolkitSource
 */
export class ArToolkitSource implements IArToolkitSource {
  public ready: boolean;
  //public domElement: HTMLImageElement | HTMLVideoElement;
  public domElement: any;
  public parameters: ISourceParameters;
  private className: string;

  /**
   * The ArToolkitSource constructor. Create a new instance of the class with all the parameters.
   * @constructor
   * @param {ISourceParameters} parameters 
   */
  constructor(parameters: ISourceParameters) {
    this.className = "ArToolkitSource";
    this.ready = false;
    this.domElement = null;

    // handle default parameters
    this.parameters = {
      // type of source - ['webcam', 'image', 'video']
      sourceType: "webcam",
      // url of the source - valid if sourceType = image|video
      sourceUrl: null,

      // Device id of the camera to use (optional)
      deviceId: null,

      // resolution of at which we initialize in the source image
      sourceWidth: 640,
      sourceHeight: 480,
      // resolution displayed for the source
      displayWidth: 640,
      displayHeight: 480,
    };
    //////////////////////////////////////////////////////////////////////////////
    //		setParameters
    //////////////////////////////////////////////////////////////////////////////
    setParameters(parameters, this);
  }

  /**
   * The most useful function in the ArToolkitSource class.
   * It initialize all the necessary to grab the source data and the domElement used internally.
   * You must provide a onReady and a onError function as a callback.
   * @param onReady 
   * @param onError 
   * @returns this
   */
  init(onReady: Function, onError: Function): this {
    var _this = this;
    var domElement: any;

    if (this.parameters.sourceType === "image") {
      domElement = this._initSourceImage(onSourceReady, onError);
    } else if (this.parameters.sourceType === "video") {
      domElement = this._initSourceVideo(onSourceReady, onError);
    } else if (this.parameters.sourceType === "webcam") {
      domElement = this._initSourceWebcam(onSourceReady, onError);
    } else {
      console.assert(false);
    }

    // attach
    this.domElement = domElement;
    this.domElement.style.position = "absolute";
    this.domElement.style.top = "0px";
    this.domElement.style.left = "0px";
    this.domElement.style.zIndex = "-2";
    this.domElement.setAttribute("id", "arjs-video");

    return this;
    function onSourceReady() {
      if (!_this.domElement) {
        return;
      }

      document.body.appendChild(_this.domElement);
      window.dispatchEvent(
        new CustomEvent("arjs-video-loaded", {
          detail: {
            component: document.querySelector("#arjs-video"),
          },
        })
      );

      _this.ready = true;

      onReady && onReady();
    }
  };

  /**
   * domElementWidth return the style.width of the queried domElement.
   * @returns {number} width of the domElement
   */
  domElementWidth(): number {
    return parseInt(this.domElement.style.width);
  };

  /**
   * domElementHeigth return the style.height of the queried domElement.
   * @returns {number} height of the domElement
   */
  domElementHeight(): number {
    return parseInt(this.domElement.style.height);
  };

  /**
   * onResizeElement resize the domElement when source change.
   * You need to call copyElementSizeTo after it.
   */
  onResizeElement(): void {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    // sanity check
    console.assert(arguments.length === 0);

    // compute sourceWidth, sourceHeight
    if (this.domElement.nodeName === "IMG" && this.domElement instanceof HTMLImageElement) {
      var sourceWidth: number = this.domElement.naturalWidth;
      var sourceHeight = this.domElement.naturalHeight;
    } else if (this.domElement.nodeName === "VIDEO" && this.domElement instanceof HTMLVideoElement) {
      var sourceWidth = this.domElement.videoWidth;
      var sourceHeight = this.domElement.videoHeight;
    } else {
      console.assert(false);
    }

    // compute sourceAspect
    var sourceAspect = sourceWidth / sourceHeight;
    // compute screenAspect
    var screenAspect = screenWidth / screenHeight;

    // if screenAspect < sourceAspect, then change the width, else change the height
    if (screenAspect < sourceAspect) {
      // compute newWidth and set .width/.marginLeft
      var newWidth = sourceAspect * screenHeight;
      this.domElement.style.width = newWidth + "px";
      this.domElement.style.marginLeft = -(newWidth - screenWidth) / 2 + "px";

      // init style.height/.marginTop to normal value
      this.domElement.style.height = screenHeight + "px";
      this.domElement.style.marginTop = "0px";
    } else {
      // compute newHeight and set .height/.marginTop
      var newHeight = 1 / (sourceAspect / screenWidth);
      this.domElement.style.height = newHeight + "px";
      this.domElement.style.marginTop = -(newHeight - screenHeight) / 2 + "px";

      // init style.width/.marginLeft to normal value
      this.domElement.style.width = screenWidth + "px";
      this.domElement.style.marginLeft = "0px";
    }
  };
  /*
  Source.prototype.copyElementSizeTo = function(otherElement){
    otherElement.style.width = this.domElement.style.width
    otherElement.style.height = this.domElement.style.height
    otherElement.style.marginLeft = this.domElement.style.marginLeft
    otherElement.style.marginTop = this.domElement.style.marginTop
  }
  */

  /**
   * copyElementSizeTo let make a copy of the style settings of the domElement.
   * It copy width, height, marginLeft and marginTop.
   * @param {any} otherElement  
   */
  copyElementSizeTo(otherElement: any): void {
    if (window.innerWidth > window.innerHeight) {
      //landscape
      otherElement.style.width = this.domElement.style.width;
      otherElement.style.height = this.domElement.style.height;
      otherElement.style.marginLeft = this.domElement.style.marginLeft;
      otherElement.style.marginTop = this.domElement.style.marginTop;
    } else {
      //portrait
      otherElement.style.height = this.domElement.style.height;
      otherElement.style.width =
        (parseInt(otherElement.style.height) * 4) / 3 + "px";
      otherElement.style.marginLeft =
        (window.innerWidth - parseInt(otherElement.style.width)) / 2 + "px";
      otherElement.style.marginTop = 0;
    }
  };

  /**
   * Depreacted function use copyELementSizeTo instead.
   */
  copySizeTo() {
    console.warn(
      "obsolete function arToolkitSource.copySizeTo. Use arToolkitSource.copyElementSizeTo"
    );
    //@ts-ignore
    this.copyElementSizeTo.apply(this, arguments);
  };

  /**
   * Depreacted function use onResizeElement instead.
   */
  onResize(arToolkitContext: IArToolkitContext, renderer: Renderer, camera: Camera) {
    if (arguments.length !== 3) {
      console.warn(
        "obsolete function arToolkitSource.onResize. Use arToolkitSource.onResizeElement"
      );
      //@ts-ignore
      return this.onResizeElement.apply(this, arguments);
    }

    var trackingBackend = arToolkitContext.parameters.trackingBackend;

    // RESIZE DOMELEMENT
    if (trackingBackend === "artoolkit") {
      this.onResizeElement();

      var isAframe = renderer.domElement.dataset.aframeCanvas ? true : false;
      if (isAframe === false) {
        this.copyElementSizeTo(renderer.domElement);
      } else {
      }

      if (arToolkitContext.arController !== null) {
        this.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    } else console.assert(false, "unhandled trackingBackend " + trackingBackend);

    // UPDATE CAMERA
    if (trackingBackend === "artoolkit") {
      if (arToolkitContext.arController !== null) {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
      }
    } else console.assert(false, "unhandled trackingBackend " + trackingBackend);
  };

  // private methods used internally by the class.

  private onInitialClick() {
    if (this.domElement && this.domElement instanceof HTMLVideoElement) {
      this.domElement.play().then(() => { });
    }
  };

  private _initSourceImage(onReady: any, onError: any): HTMLImageElement {
    // TODO make it static
    var domElement: HTMLImageElement = document.createElement("img");
    domElement.src = this.parameters.sourceUrl;

    domElement.width = this.parameters.sourceWidth;
    domElement.height = this.parameters.sourceHeight;
    domElement.style.width = this.parameters.displayWidth + "px";
    domElement.style.height = this.parameters.displayHeight + "px";

    domElement.onload = onReady;
    return domElement;
  };

  private _initSourceVideo(onReady: any, onError: any): HTMLVideoElement {
    // TODO make it static
    var domElement: HTMLVideoElement = document.createElement("video");
    domElement.src = this.parameters.sourceUrl;

    domElement.style.objectFit = "initial";

    domElement.autoplay = true;
    // error in tsc!
    //domElement.webkitPlaysinline = true;
    domElement.controls = false;
    domElement.loop = true;
    domElement.muted = true;

    // start the video on first click if not started automatically
    document.body.addEventListener("click", this.onInitialClick, { once: true });

    domElement.width = this.parameters.sourceWidth;
    domElement.height = this.parameters.sourceHeight;
    domElement.style.width = this.parameters.displayWidth + "px";
    domElement.style.height = this.parameters.displayHeight + "px";

    domElement.onloadeddata = onReady;
    return domElement;
  };

  private _initSourceWebcam(onReady: any, onError: any): HTMLVideoElement {
    var _this = this;

    // init default value
    onError =
      onError ||
      function (error: any) {
        var event = new CustomEvent("camera-error", { detail: { error: error } });
        window.dispatchEvent(event);

        setTimeout(() => {
          if (!document.getElementById("error-popup")) {
            var errorPopup = document.createElement("div");
            errorPopup.innerHTML =
              "Webcam Error\nName: " + error.name + "\nMessage: " + error.message;
            errorPopup.setAttribute("id", "error-popup");
            document.body.appendChild(errorPopup);
          }
        }, 1000);
      };

    var domElement = document.createElement("video");
    domElement.setAttribute("autoplay", "");
    domElement.setAttribute("muted", "");
    domElement.setAttribute("playsinline", "");
    domElement.style.width = this.parameters.displayWidth + "px";
    domElement.style.height = this.parameters.displayHeight + "px";

    // check API is available
    if (
      navigator.mediaDevices === undefined ||
      navigator.mediaDevices.enumerateDevices === undefined ||
      navigator.mediaDevices.getUserMedia === undefined
    ) {
      if (navigator.mediaDevices === undefined)
        var fctName = "navigator.mediaDevices";
      else if (navigator.mediaDevices.enumerateDevices === undefined)
        var fctName = "navigator.mediaDevices.enumerateDevices";
      else if (navigator.mediaDevices.getUserMedia === undefined)
        var fctName = "navigator.mediaDevices.getUserMedia";
      else console.assert(false);
      onError({
        name: "",
        message: "WebRTC issue-! " + fctName + " not present in your browser",
      });
      return null;
    }

    // get available devices
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        var userMediaConstraints: IUserMediaConstraints = {
          audio: false,
          //@ts-ignore
          video: {
            facingMode: "environment",
            width: {
              ideal: _this.parameters.sourceWidth,
              // min: 1024,
              // max: 1920
            },
            height: {
              ideal: _this.parameters.sourceHeight,
              // min: 776,
              // max: 1080
            },
            //deviceId: { exact: '' }
          },
        };

        if (!!_this.parameters.deviceId) {
          userMediaConstraints.video.deviceId.exact = _this.parameters.deviceId;
        }

        // get a device which satisfy the constraints
        navigator.mediaDevices
          .getUserMedia(userMediaConstraints)
          .then((stream) => {
            // set the .src of the domElement
            domElement.srcObject = stream;

            var event = new CustomEvent<object>("camera-init", { detail: { stream: stream } });
            window.dispatchEvent(event);

            // start the video on first click if not started automatically
            document.body.addEventListener("click", _this.onInitialClick, {
              once: true,
            });

            onReady();
          })
          .catch(function (error) {
            onError({
              name: error.name,
              message: error.message,
            });
          });
      })
      .catch(function (error) {
        onError({
          message: error.message,
        });
      });

    return domElement;
  };
}