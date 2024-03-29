import { Context } from "../Context"; // TODO context build-dependent

/**
 * Create an debug UI for an ARjs.Anchor
 *
 * @param {ARjs.Anchor} arAnchor - the anchor to user
 */
export class SessionDebugUI {
    private domElement: any;
    constructor(arSession: any) {
        var trackingBackend = arSession.arContext.parameters.trackingBackend;

        this.domElement = document.createElement("div");
        this.domElement.style.color = "rgba(0,0,0,0.9)";
        this.domElement.style.backgroundColor = "rgba(127,127,127,0.5)";
        this.domElement.style.display = "block";
        this.domElement.style.padding = "0.5em";
        this.domElement.style.position = "fixed";
        this.domElement.style.left = "5px";
        this.domElement.style.bottom = "10px";
        this.domElement.style.textAlign = "right";

        //////////////////////////////////////////////////////////////////////////////
        //		current-tracking-backend
        //////////////////////////////////////////////////////////////////////////////

        var domElement = document.createElement("span");
        domElement.style.display = "block";
        domElement.innerHTML = "<b>trackingBackend</b> : " + trackingBackend;
        this.domElement.appendChild(domElement);
    };

    /**
     * Url of augmented-website service - if === '' then dont include augmented-website link
     * @type {String}
     */
    static AugmentedWebsiteURL = "https://webxr.io/augmented-website";
}
//////////////////////////////////////////////////////////////////////////////
//		AnchorDebugUI
//////////////////////////////////////////////////////////////////////////////

/**
 * Create an debug UI for an ARjs.Anchor
 *
 * @param {ARjs.Anchor} arAnchor - the anchor to user
 */
export class AnchorDebugUI  {
    private domElement: any;
    constructor (arAnchor: any){
    var arSession = arAnchor.arSession;
    var trackingBackend = arSession.arContext.parameters.trackingBackend;

    this.domElement = document.createElement("div");
    this.domElement.style.color = "rgba(0,0,0,0.9)";
    this.domElement.style.backgroundColor = "rgba(127,127,127,0.5)";
    this.domElement.style.display = "inline-block";
    this.domElement.style.padding = "0.5em";
    this.domElement.style.margin = "0.5em";
    this.domElement.style.textAlign = "left";

    //////////////////////////////////////////////////////////////////////////////
    //		current-tracking-backend
    //////////////////////////////////////////////////////////////////////////////

    var spanDomElement = document.createElement("span");
    spanDomElement.style.display = "block";
    spanDomElement.style.padding = "0.5em";
    spanDomElement.style.color = "rgba(0,0,0,0.9)";
    spanDomElement.style.backgroundColor = "rgba(127,127,127,0.5)";
    spanDomElement.style.position = "fixed";
    spanDomElement.style.left = "5px";
    spanDomElement.style.bottom = "40px";

    this.domElement.appendChild(spanDomElement);
    spanDomElement.innerHTML =
        "<b>markersAreaEnabled</b> :" + arAnchor.parameters.markersAreaEnabled;

    //////////////////////////////////////////////////////////////////////////////
    //		toggle-marker-helper
    //////////////////////////////////////////////////////////////////////////////

    if (arAnchor.parameters.markersAreaEnabled) {
        var buttonDomElement = document.createElement("button");
        buttonDomElement.style.display = "block";
        this.domElement.style.padding = "0.5em";
        this.domElement.style.position = "fixed";
        this.domElement.style.textAlign = "left";
        this.domElement.appendChild(buttonDomElement);

        buttonDomElement.id = "buttonToggleMarkerHelpers";
        buttonDomElement.innerHTML = "toggle-marker-helper";
        //buttonDomElement.href = "javascript:void(0)";

        var subMarkerHelpersVisible = false;
        buttonDomElement.addEventListener("click", function () {
            subMarkerHelpersVisible = subMarkerHelpersVisible ? false : true;
        });
    }

    //////////////////////////////////////////////////////////////////////////////
    //		Learn-new-marker-area
    //////////////////////////////////////////////////////////////////////////////

    if (arAnchor.parameters.markersAreaEnabled) {
        var button2DomElement = document.createElement("button");
        button2DomElement.style.display = "block";
        this.domElement.appendChild(button2DomElement);

        button2DomElement.id = "buttonMarkersAreaLearner";
        button2DomElement.innerHTML = "Learn-new-marker-area";
        //button2DomElement.href = "javascript:void(0)";

        button2DomElement.addEventListener("click", function () {
            if (AnchorDebugUI.MarkersAreaLearnerURL !== null) {
                var learnerURL = AnchorDebugUI.MarkersAreaLearnerURL;
            } else {
                var learnerURL: any =
                    Context.baseURL + "examples/multi-markers/examples/learner.html";
            }
        });
    }

    //////////////////////////////////////////////////////////////////////////////
    //		Reset-marker-area
    //////////////////////////////////////////////////////////////////////////////

    if (arAnchor.parameters.markersAreaEnabled) {
        var button3domElement = document.createElement("button");
        button3domElement.style.display = "block";
        this.domElement.appendChild(button3domElement);

        button3domElement.id = "buttonMarkersAreaReset";
        button3domElement.innerHTML = "Reset-marker-area";
        //button3domElement.href = "javascript:void(0)";

        button3domElement.addEventListener("click", function () {
            location.reload();
        });
    }
};

/**
 * url for the markers-area learner. if not set, take the default one
 * @type {String}
 */
static MarkersAreaLearnerURL: any = null;
}
