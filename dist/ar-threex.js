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
            var currentValue;
            if (currentValue === undefined) {
                console.warn("THREEx.ArToolkitContext: '" + key + "' is not a property of this material.");
                continue;
            }
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
/* harmony export */   "ArToolkitProfile": () => (/* reexport safe */ _ArToolkitProfile__WEBPACK_IMPORTED_MODULE_1__.ArToolkitProfile)
/* harmony export */ });
/* harmony import */ var _ArToolkitContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArToolkitContext */ "./src/ArToolkitContext.ts");
/* harmony import */ var _ArToolkitProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArToolkitProfile */ "./src/ArToolkitProfile.ts");




})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0gsT0FBTztnQkFDSCxlQUFlLEVBQUUsY0FBYztnQkFDL0Isa0JBQWtCLEVBQUUsS0FBSzthQUM1QixDQUFDO1NBQ0w7SUFDTCxDQUFDO0lBQUEsQ0FBQztDQUNMOzs7Ozs7Ozs7OztBQzdDRDs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnNEO0FBQ0E7QUFLbEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1RIUkVFeC8uL3NyYy9BclRvb2xraXRDb250ZXh0LnRzIiwid2VicGFjazovL1RIUkVFeC8uL3NyYy9BclRvb2xraXRQcm9maWxlLnRzIiwid2VicGFjazovL1RIUkVFeC8uL3NyYy9uZXctYXBpL1V0aWxzLnRzIiwid2VicGFjazovL1RIUkVFeC9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vc3JjL2luZGV4LXRocmVleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiVEhSRUV4XCJdID0gZmFjdG9yeShyb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJ1xyXG5pbXBvcnQgeyBJQ29udGV4dFBhcmFtZXRlcnMgfSBmcm9tICcuL0NvbW1vbkludGVyZmFjZXMvVEhSRUV4LWludGVyZmFjZXMnO1xyXG5cclxuLy9uYW1lc3BhY2UgVEhSRUV4IHtcclxuZXhwb3J0IGNsYXNzIEFyVG9vbGtpdENvbnRleHQge1xyXG4gICAgc3RhdGljIGJhc2VVUkw6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3VwZGF0ZWRBdDogYW55O1xyXG4gICAgcHVibGljIHBhcmFtZXRlcnM6IElDb250ZXh0UGFyYW1ldGVycztcclxuICAgIHB1YmxpYyBhckNvbnRyb2xsZXI6IGFueTtcclxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9hck1hcmtlcnNDb250cm9sczogb2JqZWN0O1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVyczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlZEF0ID0gbnVsbFxyXG5cclxuICAgICAgICAvLyBoYW5kbGUgZGVmYXVsdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge1xyXG4gICAgICAgICAgICAvLyBBUiBiYWNrZW5kIC0gWydhcnRvb2xraXQnXVxyXG4gICAgICAgICAgICB0cmFja2luZ0JhY2tlbmQ6ICdhcnRvb2xraXQnLFxyXG4gICAgICAgICAgICAvLyBkZWJ1ZyAtIHRydWUgaWYgb25lIHNob3VsZCBkaXNwbGF5IGFydG9vbGtpdCBkZWJ1ZyBjYW52YXMsIGZhbHNlIG90aGVyd2lzZVxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXHJcbiAgICAgICAgICAgIC8vIHRoZSBtb2RlIG9mIGRldGVjdGlvbiAtIFsnY29sb3InLCAnY29sb3JfYW5kX21hdHJpeCcsICdtb25vJywgJ21vbm9fYW5kX21hdHJpeCddXHJcbiAgICAgICAgICAgIGRldGVjdGlvbk1vZGU6ICdtb25vJyxcclxuICAgICAgICAgICAgLy8gdHlwZSBvZiBtYXRyaXggY29kZSAtIHZhbGlkIGlpZiBkZXRlY3Rpb25Nb2RlIGVuZCB3aXRoICdtYXRyaXgnIC0gWzN4MywgM3gzX0hBTU1JTkc2MywgM3gzX1BBUklUWTY1LCA0eDQsIDR4NF9CQ0hfMTNfOV8zLCA0eDRfQkNIXzEzXzVfNV1cclxuICAgICAgICAgICAgbWF0cml4Q29kZVR5cGU6ICczeDMnLFxyXG5cclxuICAgICAgICAgICAgLy8gdXJsIG9mIHRoZSBjYW1lcmEgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICBjYW1lcmFQYXJhbWV0ZXJzVXJsOiBBclRvb2xraXRDb250ZXh0LmJhc2VVUkwgKyAnLi4vZGF0YS9kYXRhL2NhbWVyYV9wYXJhLmRhdCcsXHJcblxyXG4gICAgICAgICAgICAvLyB0dW5lIHRoZSBtYXhpbXVtIHJhdGUgb2YgcG9zZSBkZXRlY3Rpb24gaW4gdGhlIHNvdXJjZSBpbWFnZVxyXG4gICAgICAgICAgICBtYXhEZXRlY3Rpb25SYXRlOiA2MCxcclxuICAgICAgICAgICAgLy8gcmVzb2x1dGlvbiBvZiBhdCB3aGljaCB3ZSBkZXRlY3QgcG9zZSBpbiB0aGUgc291cmNlIGltYWdlXHJcbiAgICAgICAgICAgIGNhbnZhc1dpZHRoOiA2NDAsXHJcbiAgICAgICAgICAgIGNhbnZhc0hlaWdodDogNDgwLFxyXG5cclxuICAgICAgICAgICAgLy8gdGhlIHBhdHRlcm5SYXRpbyBpbnNpZGUgdGhlIGFydG9vbGtpdCBtYXJrZXIgLSBhcnRvb2xraXQgb25seVxyXG4gICAgICAgICAgICBwYXR0ZXJuUmF0aW86IDAuNSxcclxuXHJcbiAgICAgICAgICAgIC8vIGVuYWJsZSBpbWFnZSBzbW9vdGhpbmcgb3Igbm90IGZvciBjYW52YXMgY29weSAtIGRlZmF1bHQgdG8gdHJ1ZVxyXG4gICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEL2ltYWdlU21vb3RoaW5nRW5hYmxlZFxyXG4gICAgICAgICAgICBpbWFnZVNtb290aGluZ0VuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwYXJhbWV0ZXJzIHNhbml0eSBjaGVja1xyXG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KFsnYXJ0b29sa2l0J10uaW5kZXhPZihTdHJpbmcodGhpcy5wYXJhbWV0ZXJzLnRyYWNraW5nQmFja2VuZCkpICE9PSAtMSwgJ2ludmFsaWQgcGFyYW1ldGVyIHRyYWNraW5nQmFja2VuZCcsIHRoaXMucGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQpXHJcbiAgICAgICAgY29uc29sZS5hc3NlcnQoWydjb2xvcicsICdjb2xvcl9hbmRfbWF0cml4JywgJ21vbm8nLCAnbW9ub19hbmRfbWF0cml4J10uaW5kZXhPZih0aGlzLnBhcmFtZXRlcnMuZGV0ZWN0aW9uTW9kZSkgIT09IC0xLCAnaW52YWxpZCBwYXJhbWV0ZXIgZGV0ZWN0aW9uTW9kZScsIHRoaXMucGFyYW1ldGVycy5kZXRlY3Rpb25Nb2RlKVxyXG5cclxuICAgICAgICB0aGlzLmFyQ29udHJvbGxlciA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fYXJNYXJrZXJzQ29udHJvbHMgPSBbXVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvL1x0XHRzZXRQYXJhbWV0ZXJzXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKHBhcmFtZXRlcnMpXHJcbiAgICB9XHJcbiAgICBjcmVhdGVEZWZhdWx0Q2FtZXJhKHRyYWNraW5nQmFja2VuZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsICd1c2UgQVJqcy5VdGlscy5jcmVhdGVEZWZhdWx0Q2FtZXJhIGluc3RlYWQnKVxyXG4gICAgICAgIC8vIENyZWF0ZSBhIGNhbWVyYVxyXG4gICAgICAgIGxldCBjYW1lcmE7XHJcbiAgICAgICAgaWYgKHRyYWNraW5nQmFja2VuZCA9PT0gJ2FydG9vbGtpdCcpIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gbmV3IFRIUkVFLkNhbWVyYSgpO1xyXG4gICAgICAgIH0gZWxzZSBjb25zb2xlLmFzc2VydChmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIGNhbWVyYVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0UGFyYW1ldGVycyhwYXJhbWV0ZXJzOiBhbnkpIHtcclxuICAgICAgICBpZiAocGFyYW1ldGVycyA9PT0gdW5kZWZpbmVkKSByZXR1cm5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBwYXJhbWV0ZXJzW2tleV1cclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJUSFJFRXguQXJUb29sa2l0Q29udGV4dDogJ1wiICsga2V5ICsgXCInIHBhcmFtZXRlciBpcyB1bmRlZmluZWQuXCIpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRvIGJlIGZpeGVkLi4uXHJcbiAgICAgICAgICAgIC8vdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMucGFyYW1ldGVyc1trZXldXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlRIUkVFeC5BclRvb2xraXRDb250ZXh0OiAnXCIgKyBrZXkgKyBcIicgaXMgbm90IGEgcHJvcGVydHkgb2YgdGhpcyBtYXRlcmlhbC5cIilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIC8vIHRvIGJlIGZpeGVkLi4uXHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXJhbWV0ZXJzW2tleV0gPSBuZXdWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vL30iLCJpbXBvcnQgeyBJQ29udGV4dFBhcmFtZXRlcnMsIElEZWZhdWx0TWFya2VyUGFyYW1ldGVycywgSVNvdXJjZVBhcmFtZXRlcnMgfSBmcm9tICcuL0NvbW1vbkludGVyZmFjZXMvVEhSRUV4LWludGVyZmFjZXMnXHJcbmltcG9ydCB7IEFyVG9vbGtpdENvbnRleHQgfSBmcm9tICcuL0FyVG9vbGtpdENvbnRleHQnXHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSAnLi9uZXctYXBpL1V0aWxzJ1xyXG5cclxuLy9uYW1lc3BhY2UgVEhSRUV4IHtcclxuZXhwb3J0IGNsYXNzIEFyVG9vbGtpdFByb2ZpbGUge1xyXG4gICAgc291cmNlUGFyYW1ldGVyczogSVNvdXJjZVBhcmFtZXRlcnM7XHJcbiAgICBjb250ZXh0UGFyYW1ldGVyczogSUNvbnRleHRQYXJhbWV0ZXJzO1xyXG4gICAgZGVmYXVsdE1hcmtlclBhcmFtZXRlcnM6IElEZWZhdWx0TWFya2VyUGFyYW1ldGVycztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlc2V0KClcclxuXHJcbiAgICAgICAgdGhpcy5wZXJmb3JtYW5jZSgnZGVmYXVsdCcpXHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnd2ViY2FtJ1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbWVyYVBhcmFtZXRlcnNVcmwgPSBBclRvb2xraXRDb250ZXh0LmJhc2VVUkwgKyAnLi4vZGF0YS9kYXRhL2NhbWVyYV9wYXJhLmRhdCc7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5kZXRlY3Rpb25Nb2RlID0gJ21vbm8nO1xyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRNYXJrZXJQYXJhbWV0ZXJzLnR5cGUgPSAncGF0dGVybic7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5wYXR0ZXJuVXJsID0gQXJUb29sa2l0Q29udGV4dC5iYXNlVVJMICsgJy4uL2RhdGEvZGF0YS9wYXR0Lmhpcm8nO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMuY2hhbmdlTWF0cml4TW9kZSA9ICdtb2RlbFZpZXdNYXRyaXgnO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfTtcclxuXHJcbiAgICBwZXJmb3JtYW5jZShsYWJlbDogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGlmIChsYWJlbCA9PT0gJ2RlZmF1bHQnKSB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fZ3Vlc3NQZXJmb3JtYW5jZUxhYmVsKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYWJlbCA9PT0gJ2Rlc2t0b3AtZmFzdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNXaWR0aCA9IDY0MCAqIDNcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNIZWlnaHQgPSA0ODAgKiAzXHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLm1heERldGVjdGlvblJhdGUgPSAzMFxyXG4gICAgICAgIH0gZWxzZSBpZiAobGFiZWwgPT09ICdkZXNrdG9wLW5vcm1hbCcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNXaWR0aCA9IDY0MFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc0hlaWdodCA9IDQ4MFxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5tYXhEZXRlY3Rpb25SYXRlID0gNjBcclxuICAgICAgICB9IGVsc2UgaWYgKGxhYmVsID09PSAncGhvbmUtbm9ybWFsJykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc1dpZHRoID0gODAgKiA0XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzSGVpZ2h0ID0gNjAgKiA0XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLm1heERldGVjdGlvblJhdGUgPSAzMFxyXG4gICAgICAgIH0gZWxzZSBpZiAobGFiZWwgPT09ICdwaG9uZS1zbG93Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc1dpZHRoID0gODAgKiAzXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzSGVpZ2h0ID0gNjAgKiAzXHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLm1heERldGVjdGlvblJhdGUgPSAzMFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCAndW5rbm9ud24gbGFiZWwgJyArIGxhYmVsKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGRlZmF1bHRNYXJrZXIodHJhY2tpbmdCYWNrZW5kOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnRyYWNraW5nQmFja2VuZCh0cmFja2luZ0JhY2tlbmQgfHwgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQpO1xyXG5cclxuICAgICAgICBpZiAodHJhY2tpbmdCYWNrZW5kID09PSAnYXJ0b29sa2l0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmRldGVjdGlvbk1vZGUgPSAnbW9ubydcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy50eXBlID0gJ3BhdHRlcm4nXHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMucGF0dGVyblVybCA9IEFyVG9vbGtpdENvbnRleHQuYmFzZVVSTCArICcuLi9kYXRhL2RhdGEvcGF0dC5oaXJvJ1xyXG4gICAgICAgIH0gZWxzZSBjb25zb2xlLmFzc2VydChmYWxzZSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBzb3VyY2VXZWJjYW0oKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnd2ViY2FtJ1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZVBhcmFtZXRlcnMuc291cmNlVXJsXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBzb3VyY2VWaWRlbyh1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycy5zb3VyY2VUeXBlID0gJ3ZpZGVvJ1xyXG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycy5zb3VyY2VVcmwgPSB1cmxcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIHNvdXJjZUltYWdlKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnaW1hZ2UnXHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVVybCA9IHVybFxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2tpbmdCYWNrZW5kKHRyYWNraW5nQmFja2VuZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdzdG9wIHByb2ZpbGUudHJhY2tpbmdCYWNrZW5kKCkgb2Jzb2xldGUgZnVuY3Rpb24uIHVzZSAudHJhY2tpbmdNZXRob2QgaW5zdGVhZCcpXHJcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQgPSB0cmFja2luZ0JhY2tlbmRcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZU1hdHJpeE1vZGUoY2hhbmdlTWF0cml4TW9kZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5jaGFuZ2VNYXRyaXhNb2RlID0gY2hhbmdlTWF0cml4TW9kZVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2tpbmdNZXRob2QodHJhY2tpbmdNZXRob2Q6IHN0cmluZykge1xyXG4gICAgICAgIC8vLyB0byBiZSBmaXhlZCBVdGlscyBub3QgeWV0IGltcGxlbWVudGVkLi4uXHJcbiAgICAgICAgdmFyIGRhdGEgPSBVdGlscy5wYXJzZVRyYWNraW5nTWV0aG9kKHRyYWNraW5nTWV0aG9kKVxyXG5cclxuICAgICAgICB0aGlzLmRlZmF1bHRNYXJrZXJQYXJhbWV0ZXJzLm1hcmtlcnNBcmVhRW5hYmxlZCA9IGRhdGEubWFya2Vyc0FyZWFFbmFibGVkXHJcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQgPSBkYXRhLnRyYWNraW5nQmFja2VuZFxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGVjayBpZiB0aGUgcHJvZmlsZSBpcyB2YWxpZC4gVGhyb3cgYW4gZXhjZXB0aW9uIGlzIG5vdCB2YWxpZFxyXG4gICAgICovXHJcbiAgICBjaGVja0lmVmFsaWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ndWVzc1BlcmZvcm1hbmNlTGFiZWwoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpXHJcbiAgICAgICAgICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL3dlYk9TL2kpXHJcbiAgICAgICAgICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZS9pKVxyXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpXHJcbiAgICAgICAgICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSlcclxuICAgICAgICAgICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKVxyXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpXHJcbiAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgICAgaWYgKGlzTW9iaWxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncGhvbmUtbm9ybWFsJ1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ2Rlc2t0b3Atbm9ybWFsJ1xyXG4gICAgfVxyXG59XHJcbi8vfVxyXG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVdGlscyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkZWZhdWx0IHJlbmRlcmluZyBjYW1lcmEgZm9yIHRoaXMgdHJhY2tpbmdCYWNrZW5kLiBUaGV5IG1heSBiZSBtb2RpZmllZCBsYXRlci4gdG8gZml0IHBoeXNpY2FsIGNhbWVyYSBwYXJhbWV0ZXJzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRyYWNraW5nQmFja2VuZCAtIHRoZSB0cmFja2luZyB0byB1c2VyXHJcbiAgICAgKiBAcmV0dXJuIHtUSFJFRS5DYW1lcmF9IHRoZSBjcmVhdGVkIGNhbWVyYVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlRGVmYXVsdENhbWVyYSh0cmFja2luZ01ldGhvZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRyYWNraW5nQmFja2VuZCA9XHJcbiAgICAgICAgICAgIFV0aWxzLnBhcnNlVHJhY2tpbmdNZXRob2QodHJhY2tpbmdNZXRob2QpLnRyYWNraW5nQmFja2VuZDtcclxuICAgICAgICAvLyBDcmVhdGUgYSBjYW1lcmFcclxuICAgICAgICBpZiAodHJhY2tpbmdCYWNrZW5kID09PSBcImFydG9vbGtpdFwiKSB7XHJcbiAgICAgICAgICAgIHZhciBjYW1lcmEgPSBuZXcgVEhSRUUuQ2FtZXJhKCk7XHJcbiAgICAgICAgfSBlbHNlIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcInVua25vd24gdHJhY2tpbmdCYWNrZW5kOiBcIiArIHRyYWNraW5nQmFja2VuZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjYW1lcmE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogcGFyc2UgdHJhY2tpbmcgbWV0aG9kXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRyYWNraW5nTWV0aG9kIC0gdGhlIHRyYWNraW5nIG1ldGhvZCB0byBwYXJzZVxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAtIHZhcmlvdXMgZmllbGQgb2YgdGhlIHRyYWNraW5nIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFyc2VUcmFja2luZ01ldGhvZCh0cmFja2luZ01ldGhvZDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRyYWNraW5nTWV0aG9kID09PSBcImJlc3RcIikge1xyXG4gICAgICAgICAgICB0cmFja2luZ01ldGhvZCA9IFwiYXJlYS1hcnRvb2xraXRcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0cmFja2luZ01ldGhvZC5zdGFydHNXaXRoKFwiYXJlYS1cIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHRyYWNraW5nQmFja2VuZDogdHJhY2tpbmdNZXRob2QucmVwbGFjZShcImFyZWEtXCIsIFwiXCIpLFxyXG4gICAgICAgICAgICAgICAgbWFya2Vyc0FyZWFFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0cmFja2luZ0JhY2tlbmQ6IHRyYWNraW5nTWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgbWFya2Vyc0FyZWFFbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEFyVG9vbGtpdENvbnRleHQgfSBmcm9tIFwiLi9BclRvb2xraXRDb250ZXh0XCI7XHJcbmltcG9ydCB7IEFyVG9vbGtpdFByb2ZpbGUgfSBmcm9tIFwiLi9BclRvb2xraXRQcm9maWxlXCI7XHJcblxyXG5leHBvcnQge1xyXG4gICAgQXJUb29sa2l0Q29udGV4dCxcclxuICAgIEFyVG9vbGtpdFByb2ZpbGUsXHJcbiAgfTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=