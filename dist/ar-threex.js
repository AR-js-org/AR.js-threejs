(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["THREEx"] = factory(require("three"));
	else
		root["THREEx"] = factory(root["THREE"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ArToolkitContext.ts":
/*!*********************************!*\
  !*** ./src/ArToolkitContext.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArToolkitContext": () => (/* binding */ ArToolkitContext)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);

class ArToolkitContext {
    static baseURL;
    _updatedAt;
    parameters;
    arController;
    initialized;
    _arMarkersControls;
    constructor(parameters) {
        this._updatedAt = null;
        this.parameters = {
            trackingBackend: 'artoolkit',
            debug: false,
            detectionMode: 'mono',
            matrixCodeType: '3x3',
            cameraParametersUrl: ArToolkitContext.baseURL + '../data/data/camera_para.dat',
            maxDetectionRate: 60,
            canvasWidth: 640,
            canvasHeight: 480,
            patternRatio: 0.5,
            imageSmoothingEnabled: false,
        };
        console.assert(['artoolkit'].indexOf(String(this.parameters.trackingBackend)) !== -1, 'invalid parameter trackingBackend', this.parameters.trackingBackend);
        console.assert(['color', 'color_and_matrix', 'mono', 'mono_and_matrix'].indexOf(this.parameters.detectionMode) !== -1, 'invalid parameter detectionMode', this.parameters.detectionMode);
        this.arController = null;
        this.initialized = false;
        this._arMarkersControls = [];
        this.setParameters(parameters);
    }
    createDefaultCamera(trackingBackend) {
        console.assert(false, 'use ARjs.Utils.createDefaultCamera instead');
        let camera;
        if (trackingBackend === 'artoolkit') {
            camera = new three__WEBPACK_IMPORTED_MODULE_0__.Camera();
        }
        else
            console.assert(false);
        return camera;
    }
    setParameters(parameters) {
        if (parameters === undefined)
            return;
        for (var key in parameters) {
            var newValue = parameters[key];
            if (newValue === undefined) {
                console.warn("THREEx.ArToolkitContext: '" + key + "' parameter is undefined.");
                continue;
            }
            var currentValue = this.parameters[key];
            if (currentValue === undefined) {
                console.warn("THREEx.ArToolkitContext: '" + key + "' is not a property of this material.");
                continue;
            }
            this.parameters[key] = newValue;
        }
    }
}


/***/ }),

/***/ "./src/ArToolkitProfile.ts":
/*!*********************************!*\
  !*** ./src/ArToolkitProfile.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArToolkitProfile": () => (/* binding */ ArToolkitProfile)
/* harmony export */ });
/* harmony import */ var _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArToolkitContext */ "./src/ArToolkitContext.ts");
/* harmony import */ var _new_api_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./new-api/Utils */ "./src/new-api/Utils.ts");


class ArToolkitProfile {
    sourceParameters;
    contextParameters;
    defaultMarkerParameters;
    constructor() {
        this.reset();
        this.performance('default');
    }
    reset() {
        this.sourceParameters.sourceType = 'webcam';
        this.contextParameters.cameraParametersUrl = _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__.ArToolkitContext.baseURL + '../data/data/camera_para.dat';
        this.contextParameters.detectionMode = 'mono';
        this.defaultMarkerParameters.type = 'pattern';
        this.defaultMarkerParameters.patternUrl = _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__.ArToolkitContext.baseURL + '../data/data/patt.hiro';
        this.defaultMarkerParameters.changeMatrixMode = 'modelViewMatrix';
        return this;
    }
    ;
    performance(label) {
        if (label === 'default') {
            label = this._guessPerformanceLabel();
        }
        if (label === 'desktop-fast') {
            this.contextParameters.canvasWidth = 640 * 3;
            this.contextParameters.canvasHeight = 480 * 3;
            this.contextParameters.maxDetectionRate = 30;
        }
        else if (label === 'desktop-normal') {
            this.contextParameters.canvasWidth = 640;
            this.contextParameters.canvasHeight = 480;
            this.contextParameters.maxDetectionRate = 60;
        }
        else if (label === 'phone-normal') {
            this.contextParameters.canvasWidth = 80 * 4;
            this.contextParameters.canvasHeight = 60 * 4;
            this.contextParameters.maxDetectionRate = 30;
        }
        else if (label === 'phone-slow') {
            this.contextParameters.canvasWidth = 80 * 3;
            this.contextParameters.canvasHeight = 60 * 3;
            this.contextParameters.maxDetectionRate = 30;
        }
        else {
            console.assert(false, 'unknonwn label ' + label);
        }
        return this;
    }
    defaultMarker(trackingBackend) {
        this.trackingBackend(trackingBackend || this.contextParameters.trackingBackend);
        if (trackingBackend === 'artoolkit') {
            this.contextParameters.detectionMode = 'mono';
            this.defaultMarkerParameters.type = 'pattern';
            this.defaultMarkerParameters.patternUrl = _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__.ArToolkitContext.baseURL + '../data/data/patt.hiro';
        }
        else
            console.assert(false);
        return this;
    }
    sourceWebcam() {
        this.sourceParameters.sourceType = 'webcam';
        delete this.sourceParameters.sourceUrl;
        return this;
    }
    sourceVideo(url) {
        this.sourceParameters.sourceType = 'video';
        this.sourceParameters.sourceUrl = url;
        return this;
    }
    sourceImage(url) {
        this.sourceParameters.sourceType = 'image';
        this.sourceParameters.sourceUrl = url;
        return this;
    }
    trackingBackend(trackingBackend) {
        console.warn('stop profile.trackingBackend() obsolete function. use .trackingMethod instead');
        this.contextParameters.trackingBackend = trackingBackend;
        return this;
    }
    changeMatrixMode(changeMatrixMode) {
        this.defaultMarkerParameters.changeMatrixMode = changeMatrixMode;
        return this;
    }
    trackingMethod(trackingMethod) {
        var data = _new_api_Utils__WEBPACK_IMPORTED_MODULE_1__.Utils.parseTrackingMethod(trackingMethod);
        this.defaultMarkerParameters.markersAreaEnabled = data.markersAreaEnabled;
        this.contextParameters.trackingBackend = data.trackingBackend;
        return this;
    }
    checkIfValid() {
        return this;
    }
    _guessPerformanceLabel() {
        var isMobile = navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
            ? true : false;
        if (isMobile === true) {
            return 'phone-normal';
        }
        return 'desktop-normal';
    }
}


/***/ }),

/***/ "./src/ArToolkitSource.ts":
/*!********************************!*\
  !*** ./src/ArToolkitSource.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArToolkitSource": () => (/* binding */ ArToolkitSource)
/* harmony export */ });
class ArToolkitSource {
    ready;
    domElement;
    parameters;
    constructor(parameters) {
        this.ready = false;
        this.domElement = null;
        this.parameters = {
            sourceType: "webcam",
            sourceUrl: null,
            deviceId: null,
            sourceWidth: 640,
            sourceHeight: 480,
            displayWidth: 640,
            displayHeight: 480,
        };
        this.setParameters(parameters);
    }
    onInitialClick() {
        if (this.domElement && this.domElement instanceof HTMLVideoElement) {
            this.domElement.play().then(() => { });
        }
    }
    ;
    init(onReady, onError) {
        var _this = this;
        var domElement;
        if (this.parameters.sourceType === "image") {
            domElement = this._initSourceImage(onSourceReady, onError);
        }
        else if (this.parameters.sourceType === "video") {
            domElement = this._initSourceVideo(onSourceReady, onError);
        }
        else if (this.parameters.sourceType === "webcam") {
            domElement = this._initSourceWebcam(onSourceReady, onError);
        }
        else {
            console.assert(false);
        }
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
            window.dispatchEvent(new CustomEvent("arjs-video-loaded", {
                detail: {
                    component: document.querySelector("#arjs-video"),
                },
            }));
            _this.ready = true;
            onReady && onReady();
        }
    }
    ;
    _initSourceImage(onReady, onError) {
        var domElement = document.createElement("img");
        domElement.src = this.parameters.sourceUrl;
        domElement.width = this.parameters.sourceWidth;
        domElement.height = this.parameters.sourceHeight;
        domElement.style.width = this.parameters.displayWidth + "px";
        domElement.style.height = this.parameters.displayHeight + "px";
        domElement.onload = onReady;
        return domElement;
    }
    ;
    _initSourceVideo(onReady, onError) {
        var domElement = document.createElement("video");
        domElement.src = this.parameters.sourceUrl;
        domElement.style.objectFit = "initial";
        domElement.autoplay = true;
        domElement.controls = false;
        domElement.loop = true;
        domElement.muted = true;
        document.body.addEventListener("click", this.onInitialClick, { once: true });
        domElement.width = this.parameters.sourceWidth;
        domElement.height = this.parameters.sourceHeight;
        domElement.style.width = this.parameters.displayWidth + "px";
        domElement.style.height = this.parameters.displayHeight + "px";
        domElement.onloadeddata = onReady;
        return domElement;
    }
    ;
    _initSourceWebcam(onReady, onError) {
        var _this = this;
        onError =
            onError ||
                function (error) {
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
        if (navigator.mediaDevices === undefined ||
            navigator.mediaDevices.enumerateDevices === undefined ||
            navigator.mediaDevices.getUserMedia === undefined) {
            if (navigator.mediaDevices === undefined)
                var fctName = "navigator.mediaDevices";
            else if (navigator.mediaDevices.enumerateDevices === undefined)
                var fctName = "navigator.mediaDevices.enumerateDevices";
            else if (navigator.mediaDevices.getUserMedia === undefined)
                var fctName = "navigator.mediaDevices.getUserMedia";
            else
                console.assert(false);
            onError({
                name: "",
                message: "WebRTC issue-! " + fctName + " not present in your browser",
            });
            return null;
        }
        navigator.mediaDevices
            .enumerateDevices()
            .then(function (devices) {
            var userMediaConstraints = {
                audio: false,
                video: {
                    facingMode: "environment",
                    width: {
                        ideal: _this.parameters.sourceWidth,
                    },
                    height: {
                        ideal: _this.parameters.sourceHeight,
                    },
                },
            };
            if (null !== _this.parameters.deviceId) {
                userMediaConstraints.video.deviceId.exact = _this.parameters.deviceId;
            }
            navigator.mediaDevices
                .getUserMedia(userMediaConstraints)
                .then(function success(stream) {
                domElement.srcObject = stream;
                var event = new CustomEvent("camera-init", { detail: { stream: stream } });
                window.dispatchEvent(event);
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
    }
    ;
    setParameters(parameters) {
        if (parameters === undefined)
            return;
        for (var key in parameters) {
            var newValue = parameters[key];
            if (newValue === undefined) {
                console.log(newValue);
                console.warn("ArToolkitSource: '" + key + "' parameter is undefined.");
                continue;
            }
            var currentValue = this.parameters[key];
            if (currentValue === undefined) {
                console.log(newValue);
                console.warn("ArToolkitSource: '" + key + "' is not a property of this material.");
                continue;
            }
            this.parameters[key] = newValue;
        }
    }
    domElementWidth() {
        return parseInt(this.domElement.style.width);
    }
    ;
    domElementHeight() {
        return parseInt(this.domElement.style.height);
    }
    ;
    onResizeElement() {
        var _this = this;
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        console.assert(arguments.length === 0);
        if (this.domElement.nodeName === "IMG" && this.domElement instanceof HTMLImageElement) {
            var sourceWidth = this.domElement.naturalWidth;
            var sourceHeight = this.domElement.naturalHeight;
        }
        else if (this.domElement.nodeName === "VIDEO" && this.domElement instanceof HTMLVideoElement) {
            var sourceWidth = this.domElement.videoWidth;
            var sourceHeight = this.domElement.videoHeight;
        }
        else {
            console.assert(false);
        }
        var sourceAspect = sourceWidth / sourceHeight;
        var screenAspect = screenWidth / screenHeight;
        if (screenAspect < sourceAspect) {
            var newWidth = sourceAspect * screenHeight;
            this.domElement.style.width = newWidth + "px";
            this.domElement.style.marginLeft = -(newWidth - screenWidth) / 2 + "px";
            this.domElement.style.height = screenHeight + "px";
            this.domElement.style.marginTop = "0px";
        }
        else {
            var newHeight = 1 / (sourceAspect / screenWidth);
            this.domElement.style.height = newHeight + "px";
            this.domElement.style.marginTop = -(newHeight - screenHeight) / 2 + "px";
            this.domElement.style.width = screenWidth + "px";
            this.domElement.style.marginLeft = "0px";
        }
    }
    ;
    copyElementSizeTo(otherElement) {
        if (window.innerWidth > window.innerHeight) {
            otherElement.style.width = this.domElement.style.width;
            otherElement.style.height = this.domElement.style.height;
            otherElement.style.marginLeft = this.domElement.style.marginLeft;
            otherElement.style.marginTop = this.domElement.style.marginTop;
        }
        else {
            otherElement.style.height = this.domElement.style.height;
            otherElement.style.width =
                (parseInt(otherElement.style.height) * 4) / 3 + "px";
            otherElement.style.marginLeft =
                (window.innerWidth - parseInt(otherElement.style.width)) / 2 + "px";
            otherElement.style.marginTop = 0;
        }
    }
    ;
    copySizeTo() {
        console.warn("obsolete function arToolkitSource.copySizeTo. Use arToolkitSource.copyElementSizeTo");
        this.copyElementSizeTo.apply(this, arguments);
    }
    ;
    onResize(arToolkitContext, renderer, camera) {
        if (arguments.length !== 3) {
            console.warn("obsolete function arToolkitSource.onResize. Use arToolkitSource.onResizeElement");
            return this.onResizeElement.apply(this, arguments);
        }
        var trackingBackend = arToolkitContext.parameters.trackingBackend;
        if (trackingBackend === "artoolkit") {
            this.onResizeElement();
            var isAframe = renderer.domElement.dataset.aframeCanvas ? true : false;
            if (isAframe === false) {
                this.copyElementSizeTo(renderer.domElement);
            }
            else {
            }
            if (arToolkitContext.arController !== null) {
                this.copyElementSizeTo(arToolkitContext.arController.canvas);
            }
        }
        else
            console.assert(false, "unhandled trackingBackend " + trackingBackend);
        if (trackingBackend === "artoolkit") {
            if (arToolkitContext.arController !== null) {
                camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
            }
        }
        else
            console.assert(false, "unhandled trackingBackend " + trackingBackend);
    }
    ;
}


/***/ }),

/***/ "./src/new-api/Utils.ts":
/*!******************************!*\
  !*** ./src/new-api/Utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Utils": () => (/* binding */ Utils)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);

class Utils {
    constructor() { }
    static createDefaultCamera(trackingMethod) {
        var trackingBackend = Utils.parseTrackingMethod(trackingMethod).trackingBackend;
        if (trackingBackend === "artoolkit") {
            var camera = new three__WEBPACK_IMPORTED_MODULE_0__.Camera();
        }
        else
            console.assert(false, "unknown trackingBackend: " + trackingBackend);
        return camera;
    }
    ;
    static parseTrackingMethod(trackingMethod) {
        if (trackingMethod === "best") {
            trackingMethod = "area-artoolkit";
        }
        if (trackingMethod.startsWith("area-")) {
            return {
                trackingBackend: trackingMethod.replace("area-", ""),
                markersAreaEnabled: true,
            };
        }
        else {
            return {
                trackingBackend: trackingMethod,
                markersAreaEnabled: false,
            };
        }
    }
    ;
}


/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/index-threex.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArToolkitContext": () => (/* reexport safe */ _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__.ArToolkitContext),
/* harmony export */   "ArToolkitProfile": () => (/* reexport safe */ _ArToolkitProfile__WEBPACK_IMPORTED_MODULE_1__.ArToolkitProfile),
/* harmony export */   "ArToolkitSource": () => (/* reexport safe */ _ArToolkitSource__WEBPACK_IMPORTED_MODULE_2__.ArToolkitSource)
/* harmony export */ });
/* harmony import */ var _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArToolkitContext */ "./src/ArToolkitContext.ts");
/* harmony import */ var _ArToolkitProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArToolkitProfile */ "./src/ArToolkitProfile.ts");
/* harmony import */ var _ArToolkitSource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArToolkitSource */ "./src/ArToolkitSource.ts");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFrQixFQUFFLEtBQUs7YUFDNUIsQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQUFBLENBQUM7Q0FDTDs7Ozs7Ozs7Ozs7QUM3Q0Q7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnNEO0FBQ0E7QUFDRjtBQU1oRCIsInNvdXJjZXMiOlsid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vc3JjL0FyVG9vbGtpdENvbnRleHQudHMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vc3JjL0FyVG9vbGtpdFByb2ZpbGUudHMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vc3JjL0FyVG9vbGtpdFNvdXJjZS50cyIsIndlYnBhY2s6Ly9USFJFRXgvLi9zcmMvbmV3LWFwaS9VdGlscy50cyIsIndlYnBhY2s6Ly9USFJFRXgvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1RIUkVFeC8uL3NyYy9pbmRleC10aHJlZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1widGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVEhSRUV4XCJdID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRIUkVFeFwiXSA9IGZhY3Rvcnkocm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pID0+IHtcbnJldHVybiAiLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcclxuaW1wb3J0IHsgSUNvbnRleHRQYXJhbWV0ZXJzIH0gZnJvbSAnLi9Db21tb25JbnRlcmZhY2VzL1RIUkVFeC1pbnRlcmZhY2VzJztcclxuXHJcbi8vbmFtZXNwYWNlIFRIUkVFeCB7XHJcbmV4cG9ydCBjbGFzcyBBclRvb2xraXRDb250ZXh0IHtcclxuICAgIHN0YXRpYyBiYXNlVVJMOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF91cGRhdGVkQXQ6IGFueTtcclxuICAgIHB1YmxpYyBwYXJhbWV0ZXJzOiBJQ29udGV4dFBhcmFtZXRlcnM7XHJcbiAgICBwdWJsaWMgYXJDb250cm9sbGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfYXJNYXJrZXJzQ29udHJvbHM6IG9iamVjdDtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZWRBdCA9IG51bGxcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGRlZmF1bHQgcGFyYW1ldGVyc1xyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHtcclxuICAgICAgICAgICAgLy8gQVIgYmFja2VuZCAtIFsnYXJ0b29sa2l0J11cclxuICAgICAgICAgICAgdHJhY2tpbmdCYWNrZW5kOiAnYXJ0b29sa2l0JyxcclxuICAgICAgICAgICAgLy8gZGVidWcgLSB0cnVlIGlmIG9uZSBzaG91bGQgZGlzcGxheSBhcnRvb2xraXQgZGVidWcgY2FudmFzLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyB0aGUgbW9kZSBvZiBkZXRlY3Rpb24gLSBbJ2NvbG9yJywgJ2NvbG9yX2FuZF9tYXRyaXgnLCAnbW9ubycsICdtb25vX2FuZF9tYXRyaXgnXVxyXG4gICAgICAgICAgICBkZXRlY3Rpb25Nb2RlOiAnbW9ubycsXHJcbiAgICAgICAgICAgIC8vIHR5cGUgb2YgbWF0cml4IGNvZGUgLSB2YWxpZCBpaWYgZGV0ZWN0aW9uTW9kZSBlbmQgd2l0aCAnbWF0cml4JyAtIFszeDMsIDN4M19IQU1NSU5HNjMsIDN4M19QQVJJVFk2NSwgNHg0LCA0eDRfQkNIXzEzXzlfMywgNHg0X0JDSF8xM181XzVdXHJcbiAgICAgICAgICAgIG1hdHJpeENvZGVUeXBlOiAnM3gzJyxcclxuXHJcbiAgICAgICAgICAgIC8vIHVybCBvZiB0aGUgY2FtZXJhIHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgY2FtZXJhUGFyYW1ldGVyc1VybDogQXJUb29sa2l0Q29udGV4dC5iYXNlVVJMICsgJy4uL2RhdGEvZGF0YS9jYW1lcmFfcGFyYS5kYXQnLFxyXG5cclxuICAgICAgICAgICAgLy8gdHVuZSB0aGUgbWF4aW11bSByYXRlIG9mIHBvc2UgZGV0ZWN0aW9uIGluIHRoZSBzb3VyY2UgaW1hZ2VcclxuICAgICAgICAgICAgbWF4RGV0ZWN0aW9uUmF0ZTogNjAsXHJcbiAgICAgICAgICAgIC8vIHJlc29sdXRpb24gb2YgYXQgd2hpY2ggd2UgZGV0ZWN0IHBvc2UgaW4gdGhlIHNvdXJjZSBpbWFnZVxyXG4gICAgICAgICAgICBjYW52YXNXaWR0aDogNjQwLFxyXG4gICAgICAgICAgICBjYW52YXNIZWlnaHQ6IDQ4MCxcclxuXHJcbiAgICAgICAgICAgIC8vIHRoZSBwYXR0ZXJuUmF0aW8gaW5zaWRlIHRoZSBhcnRvb2xraXQgbWFya2VyIC0gYXJ0b29sa2l0IG9ubHlcclxuICAgICAgICAgICAgcGF0dGVyblJhdGlvOiAwLjUsXHJcblxyXG4gICAgICAgICAgICAvLyBlbmFibGUgaW1hZ2Ugc21vb3RoaW5nIG9yIG5vdCBmb3IgY2FudmFzIGNvcHkgLSBkZWZhdWx0IHRvIHRydWVcclxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC9pbWFnZVNtb290aGluZ0VuYWJsZWRcclxuICAgICAgICAgICAgaW1hZ2VTbW9vdGhpbmdFbmFibGVkOiBmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcGFyYW1ldGVycyBzYW5pdHkgY2hlY2tcclxuICAgICAgICBjb25zb2xlLmFzc2VydChbJ2FydG9vbGtpdCddLmluZGV4T2YoU3RyaW5nKHRoaXMucGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQpKSAhPT0gLTEsICdpbnZhbGlkIHBhcmFtZXRlciB0cmFja2luZ0JhY2tlbmQnLCB0aGlzLnBhcmFtZXRlcnMudHJhY2tpbmdCYWNrZW5kKVxyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KFsnY29sb3InLCAnY29sb3JfYW5kX21hdHJpeCcsICdtb25vJywgJ21vbm9fYW5kX21hdHJpeCddLmluZGV4T2YodGhpcy5wYXJhbWV0ZXJzLmRldGVjdGlvbk1vZGUpICE9PSAtMSwgJ2ludmFsaWQgcGFyYW1ldGVyIGRldGVjdGlvbk1vZGUnLCB0aGlzLnBhcmFtZXRlcnMuZGV0ZWN0aW9uTW9kZSlcclxuXHJcbiAgICAgICAgdGhpcy5hckNvbnRyb2xsZXIgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2VcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX2FyTWFya2Vyc0NvbnRyb2xzID0gW11cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy9cdFx0c2V0UGFyYW1ldGVyc1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyhwYXJhbWV0ZXJzKVxyXG4gICAgfVxyXG4gICAgY3JlYXRlRGVmYXVsdENhbWVyYSh0cmFja2luZ0JhY2tlbmQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCAndXNlIEFSanMuVXRpbHMuY3JlYXRlRGVmYXVsdENhbWVyYSBpbnN0ZWFkJylcclxuICAgICAgICAvLyBDcmVhdGUgYSBjYW1lcmFcclxuICAgICAgICBsZXQgY2FtZXJhO1xyXG4gICAgICAgIGlmICh0cmFja2luZ0JhY2tlbmQgPT09ICdhcnRvb2xraXQnKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBUSFJFRS5DYW1lcmEoKTtcclxuICAgICAgICB9IGVsc2UgY29uc29sZS5hc3NlcnQoZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiBjYW1lcmFcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFBhcmFtZXRlcnMocGFyYW1ldGVyczogYW55KSB7XHJcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMgPT09IHVuZGVmaW5lZCkgcmV0dXJuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gcGFyYW1ldGVyc1trZXldXHJcblxyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVEhSRUV4LkFyVG9vbGtpdENvbnRleHQ6ICdcIiArIGtleSArIFwiJyBwYXJhbWV0ZXIgaXMgdW5kZWZpbmVkLlwiKVxyXG4gICAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0byBiZSBmaXhlZC4uLlxyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMucGFyYW1ldGVyc1trZXldXHJcbiAgICAgICAgICAgIC8vdmFyIGN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVEhSRUV4LkFyVG9vbGtpdENvbnRleHQ6ICdcIiArIGtleSArIFwiJyBpcyBub3QgYSBwcm9wZXJ0eSBvZiB0aGlzIG1hdGVyaWFsLlwiKVxyXG4gICAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0byBiZSBmaXhlZC4uLlxyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzW2tleV0gPSBuZXdWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vL30iLCJpbXBvcnQgeyBJQ29udGV4dFBhcmFtZXRlcnMsIElEZWZhdWx0TWFya2VyUGFyYW1ldGVycywgSVNvdXJjZVBhcmFtZXRlcnMgfSBmcm9tICcuL0NvbW1vbkludGVyZmFjZXMvVEhSRUV4LWludGVyZmFjZXMnXHJcbmltcG9ydCB7IEFyVG9vbGtpdENvbnRleHQgfSBmcm9tICcuL0FyVG9vbGtpdENvbnRleHQnXHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSAnLi9uZXctYXBpL1V0aWxzJ1xyXG5cclxuLy9uYW1lc3BhY2UgVEhSRUV4IHtcclxuZXhwb3J0IGNsYXNzIEFyVG9vbGtpdFByb2ZpbGUge1xyXG4gICAgc291cmNlUGFyYW1ldGVyczogSVNvdXJjZVBhcmFtZXRlcnM7XHJcbiAgICBjb250ZXh0UGFyYW1ldGVyczogSUNvbnRleHRQYXJhbWV0ZXJzO1xyXG4gICAgZGVmYXVsdE1hcmtlclBhcmFtZXRlcnM6IElEZWZhdWx0TWFya2VyUGFyYW1ldGVycztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlc2V0KClcclxuXHJcbiAgICAgICAgdGhpcy5wZXJmb3JtYW5jZSgnZGVmYXVsdCcpXHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnd2ViY2FtJ1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbWVyYVBhcmFtZXRlcnNVcmwgPSBBclRvb2xraXRDb250ZXh0LmJhc2VVUkwgKyAnLi4vZGF0YS9kYXRhL2NhbWVyYV9wYXJhLmRhdCc7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5kZXRlY3Rpb25Nb2RlID0gJ21vbm8nO1xyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRNYXJrZXJQYXJhbWV0ZXJzLnR5cGUgPSAncGF0dGVybic7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5wYXR0ZXJuVXJsID0gQXJUb29sa2l0Q29udGV4dC5iYXNlVVJMICsgJy4uL2RhdGEvZGF0YS9wYXR0Lmhpcm8nO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMuY2hhbmdlTWF0cml4TW9kZSA9ICdtb2RlbFZpZXdNYXRyaXgnO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfTtcclxuXHJcbiAgICBwZXJmb3JtYW5jZShsYWJlbDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGlmIChsYWJlbCA9PT0gJ2RlZmF1bHQnKSB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fZ3Vlc3NQZXJmb3JtYW5jZUxhYmVsKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYWJlbCA9PT0gJ2Rlc2t0b3AtZmFzdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNXaWR0aCA9IDY0MCAqIDNcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNIZWlnaHQgPSA0ODAgKiAzXHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLm1heERldGVjdGlvblJhdGUgPSAzMFxyXG4gICAgICAgIH0gZWxzZSBpZiAobGFiZWwgPT09ICdkZXNrdG9wLW5vcm1hbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNXaWR0aCA9IDY0MFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc0hlaWdodCA9IDQ4MFxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5tYXhEZXRlY3Rpb25SYXRlID0gNjBcclxuICAgICAgICB9IGVsc2UgaWYgKGxhYmVsID09PSAncGhvbmUtbm9ybWFsJykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc1dpZHRoID0gODAgKiA0XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzSGVpZ2h0ID0gNjAgKiA0XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLm1heERldGVjdGlvblJhdGUgPSAzMFxyXG4gICAgICAgIH0gZWxzZSBpZiAobGFiZWwgPT09ICdwaG9uZS1zbG93Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc1dpZHRoID0gODAgKiAzXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzSGVpZ2h0ID0gNjAgKiAzXHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLm1heERldGVjdGlvblJhdGUgPSAzMFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCAndW5rbm9ud24gbGFiZWwgJyArIGxhYmVsKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGRlZmF1bHRNYXJrZXIodHJhY2tpbmdCYWNrZW5kOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnRyYWNraW5nQmFja2VuZCh0cmFja2luZ0JhY2tlbmQgfHwgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQpO1xyXG5cclxuICAgICAgICBpZiAodHJhY2tpbmdCYWNrZW5kID09PSAnYXJ0b29sa2l0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmRldGVjdGlvbk1vZGUgPSAnbW9ubydcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy50eXBlID0gJ3BhdHRlcm4nXHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMucGF0dGVyblVybCA9IEFyVG9vbGtpdENvbnRleHQuYmFzZVVSTCArICcuLi9kYXRhL2RhdGEvcGF0dC5oaXJvJ1xyXG4gICAgICAgIH0gZWxzZSBjb25zb2xlLmFzc2VydChmYWxzZSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBzb3VyY2VXZWJjYW0oKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnd2ViY2FtJ1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZVBhcmFtZXRlcnMuc291cmNlVXJsXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBzb3VyY2VWaWRlbyh1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycy5zb3VyY2VUeXBlID0gJ3ZpZGVvJ1xyXG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycy5zb3VyY2VVcmwgPSB1cmxcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIHNvdXJjZUltYWdlKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnaW1hZ2UnXHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVVybCA9IHVybFxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2tpbmdCYWNrZW5kKHRyYWNraW5nQmFja2VuZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdzdG9wIHByb2ZpbGUudHJhY2tpbmdCYWNrZW5kKCkgb2Jzb2xldGUgZnVuY3Rpb24uIHVzZSAudHJhY2tpbmdNZXRob2QgaW5zdGVhZCcpXHJcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQgPSB0cmFja2luZ0JhY2tlbmRcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZU1hdHJpeE1vZGUoY2hhbmdlTWF0cml4TW9kZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5jaGFuZ2VNYXRyaXhNb2RlID0gY2hhbmdlTWF0cml4TW9kZVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2tpbmdNZXRob2QodHJhY2tpbmdNZXRob2Q6IHN0cmluZykge1xyXG4gICAgICAgIC8vLyB0byBiZSBmaXhlZCBVdGlscyBub3QgeWV0IGltcGxlbWVudGVkLi4uXHJcbiAgICAgICAgdmFyIGRhdGEgPSBVdGlscy5wYXJzZVRyYWNraW5nTWV0aG9kKHRyYWNraW5nTWV0aG9kKVxyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRNYXJrZXJQYXJhbWV0ZXJzLm1hcmtlcnNBcmVhRW5hYmxlZCA9IGRhdGEubWFya2Vyc0FyZWFFbmFibGVkXHJcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQgPSBkYXRhLnRyYWNraW5nQmFja2VuZFxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGVjayBpZiB0aGUgcHJvZmlsZSBpcyB2YWxpZC4gVGhyb3cgYW4gZXhjZXB0aW9uIGlzIG5vdCB2YWxpZFxyXG4gICAgICovXHJcbiAgICBjaGVja0lmVmFsaWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ndWVzc1BlcmZvcm1hbmNlTGFiZWwoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpXHJcbiAgICAgICAgICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL3dlYk9TL2kpXHJcbiAgICAgICAgICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZS9pKVxyXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpXHJcbiAgICAgICAgICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSlcclxuICAgICAgICAgICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKVxyXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpXHJcbiAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgICAgaWYgKGlzTW9iaWxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncGhvbmUtbm9ybWFsJ1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ2Rlc2t0b3Atbm9ybWFsJ1xyXG4gICAgfVxyXG59XHJcbi8vfVxyXG4iLCJpbXBvcnQgeyBJU291cmNlUGFyYW1ldGVycywgSVVzZXJNZWRpYUNvbnN0cmFpbnRzIH0gZnJvbSBcIi4vQ29tbW9uSW50ZXJmYWNlcy9USFJFRXgtaW50ZXJmYWNlc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBBclRvb2xraXRTb3VyY2Uge1xyXG4gIHJlYWR5OiBib29sZWFuO1xyXG4gIGRvbUVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQgfCBIVE1MVmlkZW9FbGVtZW50O1xyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBJU291cmNlUGFyYW1ldGVycztcclxuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzOiBhbnkpIHtcclxuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgIHRoaXMuZG9tRWxlbWVudCA9IG51bGw7XHJcblxyXG4gICAgLy8gaGFuZGxlIGRlZmF1bHQgcGFyYW1ldGVyc1xyXG4gICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xyXG4gICAgICAvLyB0eXBlIG9mIHNvdXJjZSAtIFsnd2ViY2FtJywgJ2ltYWdlJywgJ3ZpZGVvJ11cclxuICAgICAgc291cmNlVHlwZTogXCJ3ZWJjYW1cIixcclxuICAgICAgLy8gdXJsIG9mIHRoZSBzb3VyY2UgLSB2YWxpZCBpZiBzb3VyY2VUeXBlID0gaW1hZ2V8dmlkZW9cclxuICAgICAgc291cmNlVXJsOiBudWxsLFxyXG5cclxuICAgICAgLy8gRGV2aWNlIGlkIG9mIHRoZSBjYW1lcmEgdG8gdXNlIChvcHRpb25hbClcclxuICAgICAgZGV2aWNlSWQ6IG51bGwsXHJcblxyXG4gICAgICAvLyByZXNvbHV0aW9uIG9mIGF0IHdoaWNoIHdlIGluaXRpYWxpemUgaW4gdGhlIHNvdXJjZSBpbWFnZVxyXG4gICAgICBzb3VyY2VXaWR0aDogNjQwLFxyXG4gICAgICBzb3VyY2VIZWlnaHQ6IDQ4MCxcclxuICAgICAgLy8gcmVzb2x1dGlvbiBkaXNwbGF5ZWQgZm9yIHRoZSBzb3VyY2VcclxuICAgICAgZGlzcGxheVdpZHRoOiA2NDAsXHJcbiAgICAgIGRpc3BsYXlIZWlnaHQ6IDQ4MCxcclxuICAgIH07XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vXHRcdHNldFBhcmFtZXRlcnNcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgdGhpcy5zZXRQYXJhbWV0ZXJzKHBhcmFtZXRlcnMpO1xyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25Jbml0aWFsQ2xpY2soKSB7XHJcbiAgICBpZiAodGhpcy5kb21FbGVtZW50ICYmIHRoaXMuZG9tRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQpIHtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LnBsYXkoKS50aGVuKCgpID0+IHsgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgaW5pdChvblJlYWR5OiBhbnksIG9uRXJyb3I6IGFueSkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkb21FbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgSFRNTFZpZGVvRWxlbWVudDtcclxuXHJcbiAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICBkb21FbGVtZW50ID0gdGhpcy5faW5pdFNvdXJjZUltYWdlKG9uU291cmNlUmVhZHksIG9uRXJyb3IpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtZXRlcnMuc291cmNlVHlwZSA9PT0gXCJ2aWRlb1wiKSB7XHJcbiAgICAgIGRvbUVsZW1lbnQgPSB0aGlzLl9pbml0U291cmNlVmlkZW8ob25Tb3VyY2VSZWFkeSwgb25FcnJvcik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1ldGVycy5zb3VyY2VUeXBlID09PSBcIndlYmNhbVwiKSB7XHJcbiAgICAgIC8vIHZhciBkb21FbGVtZW50ID0gdGhpcy5faW5pdFNvdXJjZVdlYmNhbU9sZChvblNvdXJjZVJlYWR5KVxyXG4gICAgICBkb21FbGVtZW50ID0gdGhpcy5faW5pdFNvdXJjZVdlYmNhbShvblNvdXJjZVJlYWR5LCBvbkVycm9yKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhdHRhY2hcclxuICAgIHRoaXMuZG9tRWxlbWVudCA9IGRvbUVsZW1lbnQ7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCIwcHhcIjtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS56SW5kZXggPSBcIi0yXCI7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJhcmpzLXZpZGVvXCIpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gICAgZnVuY3Rpb24gb25Tb3VyY2VSZWFkeSgpIHtcclxuICAgICAgaWYgKCFfdGhpcy5kb21FbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF90aGlzLmRvbUVsZW1lbnQpO1xyXG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcclxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJhcmpzLXZpZGVvLWxvYWRlZFwiLCB7XHJcbiAgICAgICAgICBkZXRhaWw6IHtcclxuICAgICAgICAgICAgY29tcG9uZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FyanMtdmlkZW9cIiksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBfdGhpcy5yZWFkeSA9IHRydWU7XHJcblxyXG4gICAgICBvblJlYWR5ICYmIG9uUmVhZHkoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIF9pbml0U291cmNlSW1hZ2Uob25SZWFkeTogYW55LCBvbkVycm9yOiBhbnkpIHtcclxuICAgIC8vIFRPRE8gbWFrZSBpdCBzdGF0aWNcclxuICAgIHZhciBkb21FbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGRvbUVsZW1lbnQuc3JjID0gdGhpcy5wYXJhbWV0ZXJzLnNvdXJjZVVybDtcclxuXHJcbiAgICBkb21FbGVtZW50LndpZHRoID0gdGhpcy5wYXJhbWV0ZXJzLnNvdXJjZVdpZHRoO1xyXG4gICAgZG9tRWxlbWVudC5oZWlnaHQgPSB0aGlzLnBhcmFtZXRlcnMuc291cmNlSGVpZ2h0O1xyXG4gICAgZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMucGFyYW1ldGVycy5kaXNwbGF5V2lkdGggKyBcInB4XCI7XHJcbiAgICBkb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMucGFyYW1ldGVycy5kaXNwbGF5SGVpZ2h0ICsgXCJweFwiO1xyXG5cclxuICAgIGRvbUVsZW1lbnQub25sb2FkID0gb25SZWFkeTtcclxuICAgIHJldHVybiBkb21FbGVtZW50O1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgX2luaXRTb3VyY2VWaWRlbyhvblJlYWR5OiBhbnksIG9uRXJyb3I6IGFueSkge1xyXG4gICAgLy8gVE9ETyBtYWtlIGl0IHN0YXRpY1xyXG4gICAgdmFyIGRvbUVsZW1lbnQ6IEhUTUxWaWRlb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XHJcbiAgICBkb21FbGVtZW50LnNyYyA9IHRoaXMucGFyYW1ldGVycy5zb3VyY2VVcmw7XHJcblxyXG4gICAgZG9tRWxlbWVudC5zdHlsZS5vYmplY3RGaXQgPSBcImluaXRpYWxcIjtcclxuXHJcbiAgICBkb21FbGVtZW50LmF1dG9wbGF5ID0gdHJ1ZTtcclxuICAgIC8vIGVycm9yIGluIHRzYyFcclxuICAgIC8vZG9tRWxlbWVudC53ZWJraXRQbGF5c2lubGluZSA9IHRydWU7XHJcbiAgICBkb21FbGVtZW50LmNvbnRyb2xzID0gZmFsc2U7XHJcbiAgICBkb21FbGVtZW50Lmxvb3AgPSB0cnVlO1xyXG4gICAgZG9tRWxlbWVudC5tdXRlZCA9IHRydWU7XHJcblxyXG4gICAgLy8gc3RhcnQgdGhlIHZpZGVvIG9uIGZpcnN0IGNsaWNrIGlmIG5vdCBzdGFydGVkIGF1dG9tYXRpY2FsbHlcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25Jbml0aWFsQ2xpY2ssIHsgb25jZTogdHJ1ZSB9KTtcclxuXHJcbiAgICBkb21FbGVtZW50LndpZHRoID0gdGhpcy5wYXJhbWV0ZXJzLnNvdXJjZVdpZHRoO1xyXG4gICAgZG9tRWxlbWVudC5oZWlnaHQgPSB0aGlzLnBhcmFtZXRlcnMuc291cmNlSGVpZ2h0O1xyXG4gICAgZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMucGFyYW1ldGVycy5kaXNwbGF5V2lkdGggKyBcInB4XCI7XHJcbiAgICBkb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMucGFyYW1ldGVycy5kaXNwbGF5SGVpZ2h0ICsgXCJweFwiO1xyXG5cclxuICAgIGRvbUVsZW1lbnQub25sb2FkZWRkYXRhID0gb25SZWFkeTtcclxuICAgIHJldHVybiBkb21FbGVtZW50O1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgX2luaXRTb3VyY2VXZWJjYW0ob25SZWFkeTogYW55LCBvbkVycm9yOiBhbnkpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgLy8gaW5pdCBkZWZhdWx0IHZhbHVlXHJcbiAgICBvbkVycm9yID1cclxuICAgICAgb25FcnJvciB8fFxyXG4gICAgICBmdW5jdGlvbiAoZXJyb3I6IGFueSkge1xyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImNhbWVyYS1lcnJvclwiLCB7IGRldGFpbDogeyBlcnJvcjogZXJyb3IgfSB9KTtcclxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yLXBvcHVwXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvclBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgZXJyb3JQb3B1cC5pbm5lckhUTUwgPVxyXG4gICAgICAgICAgICAgIFwiV2ViY2FtIEVycm9yXFxuTmFtZTogXCIgKyBlcnJvci5uYW1lICsgXCJcXG5NZXNzYWdlOiBcIiArIGVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIGVycm9yUG9wdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJlcnJvci1wb3B1cFwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlcnJvclBvcHVwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB2YXIgZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcclxuICAgIGRvbUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgXCJcIik7XHJcbiAgICBkb21FbGVtZW50LnNldEF0dHJpYnV0ZShcIm11dGVkXCIsIFwiXCIpO1xyXG4gICAgZG9tRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCBcIlwiKTtcclxuICAgIGRvbUVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLnBhcmFtZXRlcnMuZGlzcGxheVdpZHRoICsgXCJweFwiO1xyXG4gICAgZG9tRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLnBhcmFtZXRlcnMuZGlzcGxheUhlaWdodCArIFwicHhcIjtcclxuXHJcbiAgICAvLyBjaGVjayBBUEkgaXMgYXZhaWxhYmxlXHJcbiAgICBpZiAoXHJcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMgPT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMgPT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSA9PT0gdW5kZWZpbmVkXHJcbiAgICApIHtcclxuICAgICAgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB2YXIgZmN0TmFtZSA9IFwibmF2aWdhdG9yLm1lZGlhRGV2aWNlc1wiO1xyXG4gICAgICBlbHNlIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB2YXIgZmN0TmFtZSA9IFwibmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzXCI7XHJcbiAgICAgIGVsc2UgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdmFyIGZjdE5hbWUgPSBcIm5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhXCI7XHJcbiAgICAgIGVsc2UgY29uc29sZS5hc3NlcnQoZmFsc2UpO1xyXG4gICAgICBvbkVycm9yKHtcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIG1lc3NhZ2U6IFwiV2ViUlRDIGlzc3VlLSEgXCIgKyBmY3ROYW1lICsgXCIgbm90IHByZXNlbnQgaW4geW91ciBicm93c2VyXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBnZXQgYXZhaWxhYmxlIGRldmljZXNcclxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcclxuICAgICAgLmVudW1lcmF0ZURldmljZXMoKVxyXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGV2aWNlcykge1xyXG4gICAgICAgIHZhciB1c2VyTWVkaWFDb25zdHJhaW50czogSVVzZXJNZWRpYUNvbnN0cmFpbnRzID0ge1xyXG4gICAgICAgICAgYXVkaW86IGZhbHNlLFxyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICB2aWRlbzoge1xyXG4gICAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXHJcbiAgICAgICAgICAgIHdpZHRoOiB7XHJcbiAgICAgICAgICAgICAgaWRlYWw6IF90aGlzLnBhcmFtZXRlcnMuc291cmNlV2lkdGgsXHJcbiAgICAgICAgICAgICAgLy8gbWluOiAxMDI0LFxyXG4gICAgICAgICAgICAgIC8vIG1heDogMTkyMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHtcclxuICAgICAgICAgICAgICBpZGVhbDogX3RoaXMucGFyYW1ldGVycy5zb3VyY2VIZWlnaHQsXHJcbiAgICAgICAgICAgICAgLy8gbWluOiA3NzYsXHJcbiAgICAgICAgICAgICAgLy8gbWF4OiAxMDgwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vZGV2aWNlSWQ6IHsgZXhhY3Q6ICcnIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKG51bGwgIT09IF90aGlzLnBhcmFtZXRlcnMuZGV2aWNlSWQpIHtcclxuICAgICAgICAgIHVzZXJNZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmRldmljZUlkLmV4YWN0ID0gX3RoaXMucGFyYW1ldGVycy5kZXZpY2VJZDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBnZXQgYSBkZXZpY2Ugd2hpY2ggc2F0aXNmeSB0aGUgY29uc3RyYWludHNcclxuICAgICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXHJcbiAgICAgICAgICAuZ2V0VXNlck1lZGlhKHVzZXJNZWRpYUNvbnN0cmFpbnRzKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhzdHJlYW0pIHtcclxuICAgICAgICAgICAgLy8gc2V0IHRoZSAuc3JjIG9mIHRoZSBkb21FbGVtZW50XHJcbiAgICAgICAgICAgIGRvbUVsZW1lbnQuc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG5cclxuICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50PG9iamVjdD4oXCJjYW1lcmEtaW5pdFwiLCB7IGRldGFpbDogeyBzdHJlYW06IHN0cmVhbSB9IH0pO1xyXG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcblxyXG4gICAgICAgICAgICAvLyBzdGFydCB0aGUgdmlkZW8gb24gZmlyc3QgY2xpY2sgaWYgbm90IHN0YXJ0ZWQgYXV0b21hdGljYWxseVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfdGhpcy5vbkluaXRpYWxDbGljaywge1xyXG4gICAgICAgICAgICAgIG9uY2U6IHRydWUsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgb25SZWFkeSgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgb25FcnJvcih7XHJcbiAgICAgICAgICAgICAgbmFtZTogZXJyb3IubmFtZSxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgb25FcnJvcih7XHJcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZG9tRWxlbWVudDtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHNldFBhcmFtZXRlcnMocGFyYW1ldGVyczogYW55KSB7XHJcbiAgICBpZiAocGFyYW1ldGVycyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICB2YXIgbmV3VmFsdWUgPSBwYXJhbWV0ZXJzW2tleV07XHJcblxyXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcclxuXHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiQXJUb29sa2l0U291cmNlOiAnXCIgKyBrZXkgKyBcIicgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZC5cIik7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICB2YXIgY3VycmVudFZhbHVlID0gdGhpcy5wYXJhbWV0ZXJzW2tleV07XHJcblxyXG4gICAgICBpZiAoY3VycmVudFZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhuZXdWYWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgXCJBclRvb2xraXRTb3VyY2U6ICdcIiArIGtleSArIFwiJyBpcyBub3QgYSBwcm9wZXJ0eSBvZiB0aGlzIG1hdGVyaWFsLlwiXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgdGhpcy5wYXJhbWV0ZXJzW2tleV0gPSBuZXdWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRvbUVsZW1lbnRXaWR0aCgpIHtcclxuICAgIHJldHVybiBwYXJzZUludCh0aGlzLmRvbUVsZW1lbnQuc3R5bGUud2lkdGgpO1xyXG4gIH07XHJcbiAgXHJcbiAgZG9tRWxlbWVudEhlaWdodCgpIHtcclxuICAgIHJldHVybiBwYXJzZUludCh0aGlzLmRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICBvblJlc2l6ZUVsZW1lbnQgKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBzY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgdmFyIHNjcmVlbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICBcclxuICAgIC8vIHNhbml0eSBjaGVja1xyXG4gICAgY29uc29sZS5hc3NlcnQoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCk7XHJcbiAgXHJcbiAgICAvLyBjb21wdXRlIHNvdXJjZVdpZHRoLCBzb3VyY2VIZWlnaHRcclxuICAgIGlmICh0aGlzLmRvbUVsZW1lbnQubm9kZU5hbWUgPT09IFwiSU1HXCIgJiYgdGhpcy5kb21FbGVtZW50IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgICB2YXIgc291cmNlV2lkdGg6IG51bWJlciA9IHRoaXMuZG9tRWxlbWVudC5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIHZhciBzb3VyY2VIZWlnaHQgPSB0aGlzLmRvbUVsZW1lbnQubmF0dXJhbEhlaWdodDtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5kb21FbGVtZW50Lm5vZGVOYW1lID09PSBcIlZJREVPXCIgJiYgdGhpcy5kb21FbGVtZW50IGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkge1xyXG4gICAgICB2YXIgc291cmNlV2lkdGggPSB0aGlzLmRvbUVsZW1lbnQudmlkZW9XaWR0aDtcclxuICAgICAgdmFyIHNvdXJjZUhlaWdodCA9IHRoaXMuZG9tRWxlbWVudC52aWRlb0hlaWdodDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlKTtcclxuICAgIH1cclxuICBcclxuICAgIC8vIGNvbXB1dGUgc291cmNlQXNwZWN0XHJcbiAgICB2YXIgc291cmNlQXNwZWN0ID0gc291cmNlV2lkdGggLyBzb3VyY2VIZWlnaHQ7XHJcbiAgICAvLyBjb21wdXRlIHNjcmVlbkFzcGVjdFxyXG4gICAgdmFyIHNjcmVlbkFzcGVjdCA9IHNjcmVlbldpZHRoIC8gc2NyZWVuSGVpZ2h0O1xyXG4gIFxyXG4gICAgLy8gaWYgc2NyZWVuQXNwZWN0IDwgc291cmNlQXNwZWN0LCB0aGVuIGNoYW5nZSB0aGUgd2lkdGgsIGVsc2UgY2hhbmdlIHRoZSBoZWlnaHRcclxuICAgIGlmIChzY3JlZW5Bc3BlY3QgPCBzb3VyY2VBc3BlY3QpIHtcclxuICAgICAgLy8gY29tcHV0ZSBuZXdXaWR0aCBhbmQgc2V0IC53aWR0aC8ubWFyZ2luTGVmdFxyXG4gICAgICB2YXIgbmV3V2lkdGggPSBzb3VyY2VBc3BlY3QgKiBzY3JlZW5IZWlnaHQ7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IG5ld1dpZHRoICsgXCJweFwiO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdCA9IC0obmV3V2lkdGggLSBzY3JlZW5XaWR0aCkgLyAyICsgXCJweFwiO1xyXG4gIFxyXG4gICAgICAvLyBpbml0IHN0eWxlLmhlaWdodC8ubWFyZ2luVG9wIHRvIG5vcm1hbCB2YWx1ZVxyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gc2NyZWVuSGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luVG9wID0gXCIwcHhcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbXB1dGUgbmV3SGVpZ2h0IGFuZCBzZXQgLmhlaWdodC8ubWFyZ2luVG9wXHJcbiAgICAgIHZhciBuZXdIZWlnaHQgPSAxIC8gKHNvdXJjZUFzcGVjdCAvIHNjcmVlbldpZHRoKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IG5ld0hlaWdodCArIFwicHhcIjtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IC0obmV3SGVpZ2h0IC0gc2NyZWVuSGVpZ2h0KSAvIDIgKyBcInB4XCI7XHJcbiAgXHJcbiAgICAgIC8vIGluaXQgc3R5bGUud2lkdGgvLm1hcmdpbkxlZnQgdG8gbm9ybWFsIHZhbHVlXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHNjcmVlbldpZHRoICsgXCJweFwiO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvKlxyXG4gIFNvdXJjZS5wcm90b3R5cGUuY29weUVsZW1lbnRTaXplVG8gPSBmdW5jdGlvbihvdGhlckVsZW1lbnQpe1xyXG4gICAgb3RoZXJFbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5kb21FbGVtZW50LnN0eWxlLndpZHRoXHJcbiAgICBvdGhlckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5kb21FbGVtZW50LnN0eWxlLmhlaWdodFxyXG4gICAgb3RoZXJFbGVtZW50LnN0eWxlLm1hcmdpbkxlZnQgPSB0aGlzLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdFxyXG4gICAgb3RoZXJFbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IHRoaXMuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5Ub3BcclxuICB9XHJcbiAgKi9cclxuXHJcbiAgY29weUVsZW1lbnRTaXplVG8gKG90aGVyRWxlbWVudDogYW55KSB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgLy9sYW5kc2NhcGVcclxuICAgICAgb3RoZXJFbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5kb21FbGVtZW50LnN0eWxlLndpZHRoO1xyXG4gICAgICBvdGhlckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5kb21FbGVtZW50LnN0eWxlLmhlaWdodDtcclxuICAgICAgb3RoZXJFbGVtZW50LnN0eWxlLm1hcmdpbkxlZnQgPSB0aGlzLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdDtcclxuICAgICAgb3RoZXJFbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IHRoaXMuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5Ub3A7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvL3BvcnRyYWl0XHJcbiAgICAgIG90aGVyRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xyXG4gICAgICBvdGhlckVsZW1lbnQuc3R5bGUud2lkdGggPVxyXG4gICAgICAgIChwYXJzZUludChvdGhlckVsZW1lbnQuc3R5bGUuaGVpZ2h0KSAqIDQpIC8gMyArIFwicHhcIjtcclxuICAgICAgb3RoZXJFbGVtZW50LnN0eWxlLm1hcmdpbkxlZnQgPVxyXG4gICAgICAgICh3aW5kb3cuaW5uZXJXaWR0aCAtIHBhcnNlSW50KG90aGVyRWxlbWVudC5zdHlsZS53aWR0aCkpIC8gMiArIFwicHhcIjtcclxuICAgICAgb3RoZXJFbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IDA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29weVNpemVUbyAoKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgIFwib2Jzb2xldGUgZnVuY3Rpb24gYXJUb29sa2l0U291cmNlLmNvcHlTaXplVG8uIFVzZSBhclRvb2xraXRTb3VyY2UuY29weUVsZW1lbnRTaXplVG9cIlxyXG4gICAgKTtcclxuICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5jb3B5RWxlbWVudFNpemVUby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy9cdFx0Q29kZSBTZXBhcmF0b3JcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBcclxuICBvblJlc2l6ZSAoYXJUb29sa2l0Q29udGV4dDogYW55LCByZW5kZXJlcjogYW55LCBjYW1lcmE6IGFueSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDMpIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgIFwib2Jzb2xldGUgZnVuY3Rpb24gYXJUb29sa2l0U291cmNlLm9uUmVzaXplLiBVc2UgYXJUb29sa2l0U291cmNlLm9uUmVzaXplRWxlbWVudFwiXHJcbiAgICAgICk7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICByZXR1cm4gdGhpcy5vblJlc2l6ZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxuICBcclxuICAgIHZhciB0cmFja2luZ0JhY2tlbmQgPSBhclRvb2xraXRDb250ZXh0LnBhcmFtZXRlcnMudHJhY2tpbmdCYWNrZW5kO1xyXG4gIFxyXG4gICAgLy8gUkVTSVpFIERPTUVMRU1FTlRcclxuICAgIGlmICh0cmFja2luZ0JhY2tlbmQgPT09IFwiYXJ0b29sa2l0XCIpIHtcclxuICAgICAgdGhpcy5vblJlc2l6ZUVsZW1lbnQoKTtcclxuICBcclxuICAgICAgdmFyIGlzQWZyYW1lID0gcmVuZGVyZXIuZG9tRWxlbWVudC5kYXRhc2V0LmFmcmFtZUNhbnZhcyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgaWYgKGlzQWZyYW1lID09PSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuY29weUVsZW1lbnRTaXplVG8ocmVuZGVyZXIuZG9tRWxlbWVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgaWYgKGFyVG9vbGtpdENvbnRleHQuYXJDb250cm9sbGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5jb3B5RWxlbWVudFNpemVUbyhhclRvb2xraXRDb250ZXh0LmFyQ29udHJvbGxlci5jYW52YXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwidW5oYW5kbGVkIHRyYWNraW5nQmFja2VuZCBcIiArIHRyYWNraW5nQmFja2VuZCk7XHJcbiAgXHJcbiAgICAvLyBVUERBVEUgQ0FNRVJBXHJcbiAgICBpZiAodHJhY2tpbmdCYWNrZW5kID09PSBcImFydG9vbGtpdFwiKSB7XHJcbiAgICAgIGlmIChhclRvb2xraXRDb250ZXh0LmFyQ29udHJvbGxlciAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNhbWVyYS5wcm9qZWN0aW9uTWF0cml4LmNvcHkoYXJUb29sa2l0Q29udGV4dC5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwidW5oYW5kbGVkIHRyYWNraW5nQmFja2VuZCBcIiArIHRyYWNraW5nQmFja2VuZCk7XHJcbiAgfTtcclxuICBcclxuICBcclxuXHJcbn0iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVdGlscyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkZWZhdWx0IHJlbmRlcmluZyBjYW1lcmEgZm9yIHRoaXMgdHJhY2tpbmdCYWNrZW5kLiBUaGV5IG1heSBiZSBtb2RpZmllZCBsYXRlci4gdG8gZml0IHBoeXNpY2FsIGNhbWVyYSBwYXJhbWV0ZXJzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRyYWNraW5nQmFja2VuZCAtIHRoZSB0cmFja2luZyB0byB1c2VyXHJcbiAgICAgKiBAcmV0dXJuIHtUSFJFRS5DYW1lcmF9IHRoZSBjcmVhdGVkIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlRGVmYXVsdENhbWVyYSh0cmFja2luZ01ldGhvZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRyYWNraW5nQmFja2VuZCA9XHJcbiAgICAgICAgICAgIFV0aWxzLnBhcnNlVHJhY2tpbmdNZXRob2QodHJhY2tpbmdNZXRob2QpLnRyYWNraW5nQmFja2VuZDtcclxuICAgICAgICAvLyBDcmVhdGUgYSBjYW1lcmFcclxuICAgICAgICBpZiAodHJhY2tpbmdCYWNrZW5kID09PSBcImFydG9vbGtpdFwiKSB7XHJcbiAgICAgICAgICAgIHZhciBjYW1lcmEgPSBuZXcgVEhSRUUuQ2FtZXJhKCk7XHJcbiAgICAgICAgfSBlbHNlIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcInVua25vd24gdHJhY2tpbmdCYWNrZW5kOiBcIiArIHRyYWNraW5nQmFja2VuZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW1lcmE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogcGFyc2UgdHJhY2tpbmcgbWV0aG9kXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRyYWNraW5nTWV0aG9kIC0gdGhlIHRyYWNraW5nIG1ldGhvZCB0byBwYXJzZVxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAtIHZhcmlvdXMgZmllbGQgb2YgdGhlIHRyYWNraW5nIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFyc2VUcmFja2luZ01ldGhvZCh0cmFja2luZ01ldGhvZDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRyYWNraW5nTWV0aG9kID09PSBcImJlc3RcIikge1xyXG4gICAgICAgICAgICB0cmFja2luZ01ldGhvZCA9IFwiYXJlYS1hcnRvb2xraXRcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0cmFja2luZ01ldGhvZC5zdGFydHNXaXRoKFwiYXJlYS1cIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHRyYWNraW5nQmFja2VuZDogdHJhY2tpbmdNZXRob2QucmVwbGFjZShcImFyZWEtXCIsIFwiXCIpLFxyXG4gICAgICAgICAgICAgICAgbWFya2Vyc0FyZWFFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0cmFja2luZ0JhY2tlbmQ6IHRyYWNraW5nTWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgbWFya2Vyc0FyZWFFbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEFyVG9vbGtpdENvbnRleHQgfSBmcm9tIFwiLi9BclRvb2xraXRDb250ZXh0XCI7XHJcbmltcG9ydCB7IEFyVG9vbGtpdFByb2ZpbGUgfSBmcm9tIFwiLi9BclRvb2xraXRQcm9maWxlXCI7XHJcbmltcG9ydCB7IEFyVG9vbGtpdFNvdXJjZSB9IGZyb20gXCIuL0FyVG9vbGtpdFNvdXJjZVwiO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIEFyVG9vbGtpdENvbnRleHQsXHJcbiAgICBBclRvb2xraXRQcm9maWxlLFxyXG4gICAgQXJUb29sa2l0U291cmNlXHJcbiAgfTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=