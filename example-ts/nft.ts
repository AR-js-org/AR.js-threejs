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
var camera = new THREE.PerspectiveCamera();
scene.add(camera);


var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType: 'webcam',

    sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
    sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
})

arToolkitSource.init(function onReady(){
    // use a resize to fullscreen mobile devices
    setTimeout(function() {
        onResize()
    }, 1000);
}, function onError() { })

// handle resize
window.addEventListener('resize', function(){
    onResize()
})

// listener for end loading of NFT marker
window.addEventListener('arjs-nft-loaded', function(ev){
    console.log(ev);
})

function onResize(){
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if( arToolkitContext.arController !== null ){
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
}

////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////

// create atToolkitContext
var arToolkitContext: any = new THREEx.ArToolkitContext({
    detectionMode: 'mono',
    cameraParametersUrl: 'https://ar-js-org.github.io/AR.js/data/data/camera_para.dat',
    canvasWidth: 640,
    canvasHeight: 480,
})

// initialize it
arToolkitContext.init(function onCompleted(){
    // copy projection matrix to camera
    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})

console.log('context done!')

////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'nft',
    descriptorsUrl : '' + 'AR.js-threejs/example-ts/data/dataNFT/pinball',
    changeMatrixMode: 'cameraTransformMatrix'
})

scene.visible = false

var root = new THREE.Object3D();
scene.add(root);

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
})
var cube = new THREE.Mesh(geometry, material);
cube.position.y = 90;
cube.scale.set(180, 180, 180);
root.matrixAutoUpdate = false;
root.add(cube);

window.addEventListener('arjs-nft-init-data', function(nft: any) {
    console.log(nft);
    var msg = nft.detail;
    cube.position.z = -(msg.height / msg.dpi * 2.54 * 10)/2.0; //y axis?
    cube.position.x = (msg.width / msg.dpi * 2.54 * 10)/2.0; //x axis?
})

var animate = function() {
    requestAnimationFrame(animate);

    if (!arToolkitSource.ready) {
        return;
    }

    arToolkitContext.update( arToolkitSource.domElement )

    // update scene.visible if the marker is seen
    scene.visible = camera.visible;

    renderer.render(scene, camera);
};

requestAnimationFrame(animate);