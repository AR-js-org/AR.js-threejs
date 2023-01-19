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

class ArToolkitProfile {
    sourceParameters;
    contextParameters;
    defaultMarkerParameters;
    constructor() {
        this.reset();
        this.performance('default');
    }
    reset() {
        this.sourceParameters = {
            sourceType: 'webcam',
        };
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
        var data = {
            markersAreaEnabled: '',
            trackingBackend: ''
        };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBSyxDQUFDLFNBQVMsQ0FBQztlQUNwQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7ZUFDbEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2VBQ2xDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztlQUN4QyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztZQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLO1FBQ2xCLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNuQixPQUFPLGNBQWM7U0FDeEI7UUFDRCxPQUFPLGdCQUFnQjtJQUMzQixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7O0FDMUlEOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOc0Q7QUFDQTtBQUtsRCIsInNvdXJjZXMiOlsid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vc3JjL0FyVG9vbGtpdENvbnRleHQudHMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vc3JjL0FyVG9vbGtpdFByb2ZpbGUudHMiLCJ3ZWJwYWNrOi8vVEhSRUV4L2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9USFJFRXgvLi9zcmMvaW5kZXgtdGhyZWV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlRIUkVFeFwiXSA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXG5pbXBvcnQgeyBJQ29udGV4dFBhcmFtZXRlcnMgfSBmcm9tICcuL0NvbW1vbkludGVyZmFjZXMvVEhSRUV4LWludGVyZmFjZXMnO1xuXG4vL25hbWVzcGFjZSBUSFJFRXgge1xuZXhwb3J0IGNsYXNzIEFyVG9vbGtpdENvbnRleHQge1xuICAgIHN0YXRpYyBiYXNlVVJMOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfdXBkYXRlZEF0OiBhbnk7XG4gICAgcHVibGljIHBhcmFtZXRlcnM6IElDb250ZXh0UGFyYW1ldGVycztcbiAgICBwdWJsaWMgYXJDb250cm9sbGVyOiBhbnk7XG4gICAgcHJpdmF0ZSBpbml0aWFsaXplZDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9hck1hcmtlcnNDb250cm9sczogb2JqZWN0O1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IGFueSkge1xuICAgICAgICB0aGlzLl91cGRhdGVkQXQgPSBudWxsXG5cbiAgICAgICAgLy8gaGFuZGxlIGRlZmF1bHQgcGFyYW1ldGVyc1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAvLyBBUiBiYWNrZW5kIC0gWydhcnRvb2xraXQnXVxuICAgICAgICAgICAgdHJhY2tpbmdCYWNrZW5kOiAnYXJ0b29sa2l0JyxcbiAgICAgICAgICAgIC8vIGRlYnVnIC0gdHJ1ZSBpZiBvbmUgc2hvdWxkIGRpc3BsYXkgYXJ0b29sa2l0IGRlYnVnIGNhbnZhcywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICAvLyB0aGUgbW9kZSBvZiBkZXRlY3Rpb24gLSBbJ2NvbG9yJywgJ2NvbG9yX2FuZF9tYXRyaXgnLCAnbW9ubycsICdtb25vX2FuZF9tYXRyaXgnXVxuICAgICAgICAgICAgZGV0ZWN0aW9uTW9kZTogJ21vbm8nLFxuICAgICAgICAgICAgLy8gdHlwZSBvZiBtYXRyaXggY29kZSAtIHZhbGlkIGlpZiBkZXRlY3Rpb25Nb2RlIGVuZCB3aXRoICdtYXRyaXgnIC0gWzN4MywgM3gzX0hBTU1JTkc2MywgM3gzX1BBUklUWTY1LCA0eDQsIDR4NF9CQ0hfMTNfOV8zLCA0eDRfQkNIXzEzXzVfNV1cbiAgICAgICAgICAgIG1hdHJpeENvZGVUeXBlOiAnM3gzJyxcblxuICAgICAgICAgICAgLy8gdXJsIG9mIHRoZSBjYW1lcmEgcGFyYW1ldGVyc1xuICAgICAgICAgICAgY2FtZXJhUGFyYW1ldGVyc1VybDogQXJUb29sa2l0Q29udGV4dC5iYXNlVVJMICsgJy4uL2RhdGEvZGF0YS9jYW1lcmFfcGFyYS5kYXQnLFxuXG4gICAgICAgICAgICAvLyB0dW5lIHRoZSBtYXhpbXVtIHJhdGUgb2YgcG9zZSBkZXRlY3Rpb24gaW4gdGhlIHNvdXJjZSBpbWFnZVxuICAgICAgICAgICAgbWF4RGV0ZWN0aW9uUmF0ZTogNjAsXG4gICAgICAgICAgICAvLyByZXNvbHV0aW9uIG9mIGF0IHdoaWNoIHdlIGRldGVjdCBwb3NlIGluIHRoZSBzb3VyY2UgaW1hZ2VcbiAgICAgICAgICAgIGNhbnZhc1dpZHRoOiA2NDAsXG4gICAgICAgICAgICBjYW52YXNIZWlnaHQ6IDQ4MCxcblxuICAgICAgICAgICAgLy8gdGhlIHBhdHRlcm5SYXRpbyBpbnNpZGUgdGhlIGFydG9vbGtpdCBtYXJrZXIgLSBhcnRvb2xraXQgb25seVxuICAgICAgICAgICAgcGF0dGVyblJhdGlvOiAwLjUsXG5cbiAgICAgICAgICAgIC8vIGVuYWJsZSBpbWFnZSBzbW9vdGhpbmcgb3Igbm90IGZvciBjYW52YXMgY29weSAtIGRlZmF1bHQgdG8gdHJ1ZVxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC9pbWFnZVNtb290aGluZ0VuYWJsZWRcbiAgICAgICAgICAgIGltYWdlU21vb3RoaW5nRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICAgLy8gcGFyYW1ldGVycyBzYW5pdHkgY2hlY2tcbiAgICAgICAgY29uc29sZS5hc3NlcnQoWydhcnRvb2xraXQnXS5pbmRleE9mKFN0cmluZyh0aGlzLnBhcmFtZXRlcnMudHJhY2tpbmdCYWNrZW5kKSkgIT09IC0xLCAnaW52YWxpZCBwYXJhbWV0ZXIgdHJhY2tpbmdCYWNrZW5kJywgdGhpcy5wYXJhbWV0ZXJzLnRyYWNraW5nQmFja2VuZClcbiAgICAgICAgY29uc29sZS5hc3NlcnQoWydjb2xvcicsICdjb2xvcl9hbmRfbWF0cml4JywgJ21vbm8nLCAnbW9ub19hbmRfbWF0cml4J10uaW5kZXhPZih0aGlzLnBhcmFtZXRlcnMuZGV0ZWN0aW9uTW9kZSkgIT09IC0xLCAnaW52YWxpZCBwYXJhbWV0ZXIgZGV0ZWN0aW9uTW9kZScsIHRoaXMucGFyYW1ldGVycy5kZXRlY3Rpb25Nb2RlKVxuXG4gICAgICAgIHRoaXMuYXJDb250cm9sbGVyID0gbnVsbDtcblxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2VcblxuXG4gICAgICAgIHRoaXMuX2FyTWFya2Vyc0NvbnRyb2xzID0gW11cblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy9cdFx0c2V0UGFyYW1ldGVyc1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKHBhcmFtZXRlcnMpXG4gICAgfVxuICAgIGNyZWF0ZURlZmF1bHRDYW1lcmEodHJhY2tpbmdCYWNrZW5kOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsICd1c2UgQVJqcy5VdGlscy5jcmVhdGVEZWZhdWx0Q2FtZXJhIGluc3RlYWQnKVxuICAgICAgICAvLyBDcmVhdGUgYSBjYW1lcmFcbiAgICAgICAgbGV0IGNhbWVyYTtcbiAgICAgICAgaWYgKHRyYWNraW5nQmFja2VuZCA9PT0gJ2FydG9vbGtpdCcpIHtcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBUSFJFRS5DYW1lcmEoKTtcbiAgICAgICAgfSBlbHNlIGNvbnNvbGUuYXNzZXJ0KGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIGNhbWVyYVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UGFyYW1ldGVycyhwYXJhbWV0ZXJzOiBhbnkpIHtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBwYXJhbWV0ZXJzW2tleV1cblxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJUSFJFRXguQXJUb29sa2l0Q29udGV4dDogJ1wiICsga2V5ICsgXCInIHBhcmFtZXRlciBpcyB1bmRlZmluZWQuXCIpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRvIGJlIGZpeGVkLi4uXG4gICAgICAgICAgICAvL3ZhciBjdXJyZW50VmFsdWUgPSB0aGlzLnBhcmFtZXRlcnNba2V5XVxuICAgICAgICAgICAgdmFyIGN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVEhSRUV4LkFyVG9vbGtpdENvbnRleHQ6ICdcIiArIGtleSArIFwiJyBpcyBub3QgYSBwcm9wZXJ0eSBvZiB0aGlzIG1hdGVyaWFsLlwiKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgLy8gdG8gYmUgZml4ZWQuLi5cbiAgICAgICAgICAgIC8vdGhpcy5wYXJhbWV0ZXJzW2tleV0gPSBuZXdWYWx1ZVxuICAgICAgICB9XG4gICAgfVxufVxuLy99IiwiaW1wb3J0IHsgSUNvbnRleHRQYXJhbWV0ZXJzLCBJRGVmYXVsdE1hcmtlclBhcmFtZXRlcnMsIElTb3VyY2VQYXJhbWV0ZXJzIH0gZnJvbSAnLi9Db21tb25JbnRlcmZhY2VzL1RIUkVFeC1pbnRlcmZhY2VzJ1xuaW1wb3J0IHsgQXJUb29sa2l0Q29udGV4dCB9IGZyb20gJy4vQXJUb29sa2l0Q29udGV4dCdcbmltcG9ydCB7IFpfRklYRUQgfSBmcm9tICd6bGliJztcblxuLy9uYW1lc3BhY2UgVEhSRUV4IHtcbmV4cG9ydCBjbGFzcyBBclRvb2xraXRQcm9maWxlIHtcbiAgICBzb3VyY2VQYXJhbWV0ZXJzOiBJU291cmNlUGFyYW1ldGVycztcbiAgICBjb250ZXh0UGFyYW1ldGVyczogSUNvbnRleHRQYXJhbWV0ZXJzO1xuICAgIGRlZmF1bHRNYXJrZXJQYXJhbWV0ZXJzOiBJRGVmYXVsdE1hcmtlclBhcmFtZXRlcnM7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpXG5cbiAgICAgICAgdGhpcy5wZXJmb3JtYW5jZSgnZGVmYXVsdCcpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIC8vIHRvIHJlYWQgZnJvbSB0aGUgd2ViY2FtXG4gICAgICAgICAgICBzb3VyY2VUeXBlOiAnd2ViY2FtJyxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FtZXJhUGFyYW1ldGVyc1VybCA9IEFyVG9vbGtpdENvbnRleHQuYmFzZVVSTCArICcuLi9kYXRhL2RhdGEvY2FtZXJhX3BhcmEuZGF0JztcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5kZXRlY3Rpb25Nb2RlID0gJ21vbm8nO1xuXG4gICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMudHlwZSA9ICdwYXR0ZXJuJztcbiAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5wYXR0ZXJuVXJsID0gQXJUb29sa2l0Q29udGV4dC5iYXNlVVJMICsgJy4uL2RhdGEvZGF0YS9wYXR0Lmhpcm8nO1xuICAgICAgICB0aGlzLmRlZmF1bHRNYXJrZXJQYXJhbWV0ZXJzLmNoYW5nZU1hdHJpeE1vZGUgPSAnbW9kZWxWaWV3TWF0cml4JztcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH07XG5cbiAgICBwZXJmb3JtYW5jZShsYWJlbDogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKGxhYmVsID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fZ3Vlc3NQZXJmb3JtYW5jZUxhYmVsKClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsYWJlbCA9PT0gJ2Rlc2t0b3AtZmFzdCcpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzV2lkdGggPSA2NDAgKiAzXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmNhbnZhc0hlaWdodCA9IDQ4MCAqIDNcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5tYXhEZXRlY3Rpb25SYXRlID0gMzBcbiAgICAgICAgfSBlbHNlIGlmIChsYWJlbCA9PT0gJ2Rlc2t0b3Atbm9ybWFsJykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNXaWR0aCA9IDY0MFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNIZWlnaHQgPSA0ODBcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5tYXhEZXRlY3Rpb25SYXRlID0gNjBcbiAgICAgICAgfSBlbHNlIGlmIChsYWJlbCA9PT0gJ3Bob25lLW5vcm1hbCcpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzV2lkdGggPSA4MCAqIDRcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMuY2FudmFzSGVpZ2h0ID0gNjAgKiA0XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMubWF4RGV0ZWN0aW9uUmF0ZSA9IDMwXG4gICAgICAgIH0gZWxzZSBpZiAobGFiZWwgPT09ICdwaG9uZS1zbG93Jykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNXaWR0aCA9IDgwICogM1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5jYW52YXNIZWlnaHQgPSA2MCAqIDNcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy5tYXhEZXRlY3Rpb25SYXRlID0gMzBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCAndW5rbm9ud24gbGFiZWwgJyArIGxhYmVsKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZGVmYXVsdE1hcmtlcih0cmFja2luZ0JhY2tlbmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnRyYWNraW5nQmFja2VuZCh0cmFja2luZ0JhY2tlbmQgfHwgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQpO1xuXG4gICAgICAgIGlmICh0cmFja2luZ0JhY2tlbmQgPT09ICdhcnRvb2xraXQnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRQYXJhbWV0ZXJzLmRldGVjdGlvbk1vZGUgPSAnbW9ubydcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMudHlwZSA9ICdwYXR0ZXJuJ1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5wYXR0ZXJuVXJsID0gQXJUb29sa2l0Q29udGV4dC5iYXNlVVJMICsgJy4uL2RhdGEvZGF0YS9wYXR0Lmhpcm8nXG4gICAgICAgIH0gZWxzZSBjb25zb2xlLmFzc2VydChmYWxzZSlcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHNvdXJjZVdlYmNhbSgpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnd2ViY2FtJ1xuICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVVybFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHNvdXJjZVZpZGVvKHVybDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycy5zb3VyY2VUeXBlID0gJ3ZpZGVvJ1xuICAgICAgICB0aGlzLnNvdXJjZVBhcmFtZXRlcnMuc291cmNlVXJsID0gdXJsXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc291cmNlSW1hZ2UodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VQYXJhbWV0ZXJzLnNvdXJjZVR5cGUgPSAnaW1hZ2UnXG4gICAgICAgIHRoaXMuc291cmNlUGFyYW1ldGVycy5zb3VyY2VVcmwgPSB1cmxcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB0cmFja2luZ0JhY2tlbmQodHJhY2tpbmdCYWNrZW5kOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdzdG9wIHByb2ZpbGUudHJhY2tpbmdCYWNrZW5kKCkgb2Jzb2xldGUgZnVuY3Rpb24uIHVzZSAudHJhY2tpbmdNZXRob2QgaW5zdGVhZCcpXG4gICAgICAgIHRoaXMuY29udGV4dFBhcmFtZXRlcnMudHJhY2tpbmdCYWNrZW5kID0gdHJhY2tpbmdCYWNrZW5kXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY2hhbmdlTWF0cml4TW9kZShjaGFuZ2VNYXRyaXhNb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0TWFya2VyUGFyYW1ldGVycy5jaGFuZ2VNYXRyaXhNb2RlID0gY2hhbmdlTWF0cml4TW9kZVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHRyYWNraW5nTWV0aG9kKHRyYWNraW5nTWV0aG9kOiBzdHJpbmcpIHtcbiAgICAgICAgLy8vIHRvIGJlIGZpeGVkIFV0aWxzIG5vdCB5ZXQgaW1wbGVtZW50ZWQuLi5cbiAgICAgICAgLy92YXIgZGF0YSA9IEFSanMuVXRpbHMucGFyc2VUcmFja2luZ01ldGhvZCh0cmFja2luZ01ldGhvZClcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBtYXJrZXJzQXJlYUVuYWJsZWQ6ICcnLFxuICAgICAgICAgICAgdHJhY2tpbmdCYWNrZW5kOiAnJ1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVmYXVsdE1hcmtlclBhcmFtZXRlcnMubWFya2Vyc0FyZWFFbmFibGVkID0gZGF0YS5tYXJrZXJzQXJlYUVuYWJsZWRcbiAgICAgICAgdGhpcy5jb250ZXh0UGFyYW1ldGVycy50cmFja2luZ0JhY2tlbmQgPSBkYXRhLnRyYWNraW5nQmFja2VuZFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoZWNrIGlmIHRoZSBwcm9maWxlIGlzIHZhbGlkLiBUaHJvdyBhbiBleGNlcHRpb24gaXMgbm90IHZhbGlkXG4gICAgICovXG4gICAgY2hlY2tJZlZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHByaXZhdGUgX2d1ZXNzUGVyZm9ybWFuY2VMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICB2YXIgaXNNb2JpbGUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC93ZWJPUy9pKVxuICAgICAgICAgICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lL2kpXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpXG4gICAgICAgICAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpXG4gICAgICAgICAgICA/IHRydWUgOiBmYWxzZVxuICAgICAgICBpZiAoaXNNb2JpbGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiAncGhvbmUtbm9ybWFsJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnZGVza3RvcC1ub3JtYWwnXG4gICAgfVxufVxuLy99XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQXJUb29sa2l0Q29udGV4dCB9IGZyb20gXCIuL0FyVG9vbGtpdENvbnRleHRcIjtcbmltcG9ydCB7IEFyVG9vbGtpdFByb2ZpbGUgfSBmcm9tIFwiLi9BclRvb2xraXRQcm9maWxlXCI7XG5cbmV4cG9ydCB7XG4gICAgQXJUb29sa2l0Q29udGV4dCxcbiAgICBBclRvb2xraXRQcm9maWxlLFxuICB9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==