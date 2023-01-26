import * as THREE from 'three'
import { THREEx, ARjs } from "@ar-js-org/ar.js-threejs"

THREEx.ArToolkitContext.baseURL = "./";
// log in the console the two newly created namespaces
console.log(THREEx);
console.log(ARjs)
//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
var onRenderFcts: any[] = [];
var arToolkitContext: any, arMarkerControls;

// init scene and camera
var scene = new THREE.Scene();

//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
var camera = new THREE.Camera();
scene.add(camera);


var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType: 'webcam',

    sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
    sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
})

arToolkitSource.init(function onReady() {
    
    arToolkitSource.domElement.addEventListener('canplay', () => {
        console.log(
            'canplay',
            'actual source dimensions',
            arToolkitSource.domElement.videoWidth,
			arToolkitSource.domElement.videoHeight,
        );
        initARContext();
    }) as unknown as HTMLVideoElement;
    window.arToolkitSource = arToolkitSource;
    setTimeout(() => {
        onResize()
    }, 2000);
}, function onError() { })

// handle resize
window.addEventListener('resize', function () {
    onResize()
})

function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (window.arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(window.arToolkitContext.arController.canvas)
    }
}

function initARContext() { // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: THREEx.ArToolkitContext.baseURL + './data/camera_para.dat',
        detectionMode: 'mono',
    })

    // initialize it
    arToolkitContext.init(() => { // copy projection matrix to camera
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

        arToolkitContext.arController.orientatio = getSourceOrientation();
        arToolkitContext.arController.options.orientation = getSourceOrientation();

        console.log('arToolkitContext', arToolkitContext);
        window.arToolkitContext = arToolkitContext;
    })

    // MARKER
    arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
        type: 'pattern',
        patternUrl: THREEx.ArToolkitContext.baseURL + './data/patt.hiro',
        // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
        // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
        changeMatrixMode: 'cameraTransformMatrix',
    })

    scene.visible = false

    console.log('ArMarkerControls', arMarkerControls);
    window.arMarkerControls = arMarkerControls;
}

function getSourceOrientation(): string {
    if (!arToolkitSource) {
        return '';
    }

    console.log(
        'actual source dimensions',
        arToolkitSource.domElement.videoWidth,
        arToolkitSource.domElement.videoHeight
    );

    if (arToolkitSource.domElement.videoWidth > arToolkitSource.domElement.videoHeight) {
        console.log('source orientation', 'landscape');
        return 'landscape';
    } else {
        console.log('source orientation', 'portrait');
        return 'portrait';
    }
}

window.addEventListener("markerFound", function (e) {
    console.log("marker found!", e);
})

onRenderFcts.push(function () {
    if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) {
        return;
    }

    arToolkitContext.update(arToolkitSource.domElement)

    // update scene.visible if the marker is seen
    scene.visible = camera.visible
})

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = geometry.parameters.height / 2
scene.add(mesh);

var torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var torusMesh = new THREE.Mesh(torusKnotGeometry, material);
torusMesh.position.y = 0.5
scene.add(torusMesh);

onRenderFcts.push(function (delta: any) {
    torusMesh.rotation.x += Math.PI * delta
})

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// render the scene
onRenderFcts.push(function () {
    renderer.render(scene, camera);
})

// run the rendering loop
var lastTimeMsec: number;
requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    // call each update function
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })
})

