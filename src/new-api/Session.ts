import { Camera, Scene, WebGLRenderer } from "three";
import { Source } from "../Source";
import { Context } from "../Context"; // TODO context build-dependent
import { setParameters } from '../common-functions/utilityFunctions';
import { IArToolkitSource, IArToolkitContext } from "../CommonInterfaces/THREEx-interfaces";

/**
 *  * define a Session
 *
 * @param {Object} parameters - parameters for this session
 */
export class Session {
    private parameters: any;
    private arSource: IArToolkitSource;
    private arContext: IArToolkitContext;
    constructor(parameters: any) {
        var _this = this;
        // handle default parameters
        this.parameters = {
            renderer: null,
            camera: null,
            scene: null,
            sourceParameters: {},
            contextParameters: {},
        };

        //////////////////////////////////////////////////////////////////////////////
        //		setParameters
        //////////////////////////////////////////////////////////////////////////////
        setParameters(parameters, this);

        // sanity check
        console.assert(this.parameters.renderer instanceof WebGLRenderer);
        console.assert(this.parameters.camera instanceof Camera);
        console.assert(this.parameters.scene instanceof Scene);

        // backward emulation
        Object.defineProperty(this, "renderer", {
            get: function () {
                console.warn("use .parameters.renderer renderer");
                return this.parameters.renderer;
            },
        });
        Object.defineProperty(this, "camera", {
            get: function () {
                console.warn("use .parameters.camera instead");
                return this.parameters.camera;
            },
        });
        Object.defineProperty(this, "scene", {
            get: function () {
                console.warn("use .parameters.scene instead");
                return this.parameters.scene;
            },
        });

        // log the version
        console.log(
            "AR.js",
            Context.REVISION,
            "- trackingBackend:",
            parameters.contextParameters.trackingBackend
        );

        //////////////////////////////////////////////////////////////////////////////
        //		init arSource
        //////////////////////////////////////////////////////////////////////////////
        var arSource = (_this.arSource = new Source(parameters.sourceParameters));

        arSource.init(() => {
            arSource.onResize(
                arContext,
                _this.parameters.renderer,
                _this.parameters.camera
            );
        }, () => { console.log("arSource init failed") });

        // handle resize
        window.addEventListener("resize", function () {
            arSource.onResize(
                arContext,
                _this.parameters.renderer,
                _this.parameters.camera
            );
        });

        //////////////////////////////////////////////////////////////////////////////
        //		init arContext
        //////////////////////////////////////////////////////////////////////////////

        // create atToolkitContext
        var arContext = (_this.arContext = new Context(parameters.contextParameters));

        // initialize it
        window.addEventListener("arjs-video-loaded", function () {
            _this.arContext.init(() => {
                _this.arContext.arController.orientation = getSourceOrientation();
                _this.arContext.arController.options.orientation = getSourceOrientation();
            });
        });

        function getSourceOrientation() {
            if (!_this) {
                return null;
            }

            console.log(
                "actual source dimensions",
                arSource.domElement.clientWidth,
                arSource.domElement.clientHeight
            );

            if (arSource.domElement.clientWidth > arSource.domElement.clientHeight) {
                console.log("source orientation", "landscape");
                return "landscape";
            } else {
                console.log("source orientation", "portrait");
                return "portrait";
            }
        }

        arContext.addEventListener("initialized", function (event: Event) {
            arSource.onResize(
                arContext,
                _this.parameters.renderer,
                _this.parameters.camera
            );
        });
    };

    //////////////////////////////////////////////////////////////////////////////
    //		update function
    //////////////////////////////////////////////////////////////////////////////
    // update artoolkit on every frame

    update() {
        if (this.arSource.ready === false) return;

        this.arContext.update(this.arSource.domElement);
    };

    onResize() {
        this.arSource.onResize(
            this.arContext,
            this.parameters.renderer,
            this.parameters.camera
        );
    };
}
