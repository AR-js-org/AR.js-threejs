# AR.js-threejs

Testing repository for the AR.js core module. I'm converting AR.js code to the Typescript language but providing the same classes and structures as much as possible.
The module export two namespaces as in the old implementation: **THREEx** and **ARjs**.
The project is under development, so things could not works as expected. If you find a bug file an issue at our [issues](https://github.com/AR-js-org/AR.js-threejs/issues)

## List of classes in the namespaces
### THREEx:
- [x] ArBaseControls
- [x] ArClickability
- [x] ArMarkerCloak
- [x] ArMarkerControls
- [x] ArMarkerHelper
- [x] ArSmoothedControls
- [x] ArToolkitContext
- [x] ArToolkitSource
- [x] ArToolkitProfile
- [x] ArVideoinWebgl
- [x] HitTestingPlane

### ARjs:

- [x] Anchor
- [x] AnchorDebugUI
- [x] Context
- [x] HitTesting
- [x] Session
- [x] SessionDebugUI
- [x] Source
- [x] Profile
- [x] Utils

## Examples
For now, you can find some vanilla JS examples in the **examples** folder and anothers in Typescript in the **example-ts** folder. More examples will be added in a near future.
Update 20/10/2024: Now also NFT examples.

## Test it with Typescript

First, you need to add the `ar.js-threejs` package to your project:

`npm install @ar-js-org/ar.js-threejs`

then in your typescript code you can import the `THREEx` and `ARjs` namespaces:

```typescript
import { THREEx, ARjs } from "@ar-js-org/ar.js-threejs"

var arToolkitSource = new THREEx.ArToolkitSource({
// to read from the webcam
sourceType: 'webcam',

    sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
    sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
})
// other Ar.js code...
```

After, you need a bundler (webpack, rollup..) to build the final app. look at _example-ts_ for this purpose.

## Feature to add

- [ ] markers-area with multimarker support?