import * as THREE from "three";
import { PlaneGeometry, ShaderMaterial, Mesh, Vector2, Vector3, Matrix4, MeshNormalMaterial } from "three";

/**
 * - videoTexture
 * - cloakWidth
 * - cloakHeight
 * - cloakSegmentsHeight
 * - remove all mentions of cache, for cloak
 */
export class ArMarkerCloak {
    static vertexShader: string;
    static fragmentShader: string;
    static markerSpaceShaderFunction: string;
    public object3d: any;
    private orthoMesh: any;
    private cloakMesh: any;
    private originalsFaceVertexUvs: any[][];
    private originalOrthoVertices: any[];
    private updateInShaderEnabled: boolean
    constructor(videoTexture: Uint8ClampedArray) {
        this.updateInShaderEnabled = true;
        //////////////////////////////////////////////////////////////////////////////
        //                Shaders
        //////////////////////////////////////////////////////////////////////////////
        ArMarkerCloak.markerSpaceShaderFunction =
            "\n" +
            "        vec2 transformUvToMarkerSpace(vec2 originalUv){\n" +
            "                vec3 transformedUv;\n" +
            "                // set transformedUv - from UV coord to clip coord\n" +
            "                transformedUv.x = originalUv.x * 2.0 - 1.0;\n" +
            "                transformedUv.y = originalUv.y * 2.0 - 1.0;\n" +
            "                transformedUv.z = 0.0;\n" +
            "\n" +
            "		// apply modelViewMatrix and projectionMatrix\n" +
            "                transformedUv = (projectionMatrix * modelViewMatrix * vec4( transformedUv, 1.0 ) ).xyz;\n" +
            "\n" +
            "		// apply perspective\n" +
            "		transformedUv.x /= transformedUv.z;\n" +
            "		transformedUv.y /= transformedUv.z;\n" +
            "\n" +
            "                // set back from clip coord to Uv coord\n" +
            "                transformedUv.x = transformedUv.x / 2.0 + 0.5;\n" +
            "                transformedUv.y = transformedUv.y / 2.0 + 0.5;\n" +
            "\n" +
            "                // return the result\n" +
            "                return transformedUv.xy;\n" +
            "        }";

        ArMarkerCloak.vertexShader =
            ArMarkerCloak.markerSpaceShaderFunction +
            "	varying vec2 vUv;\n" +
            "\n" +
            "	void main(){\n" +
            "                // pass the UV to the fragment\n" +
            "                #if (updateInShaderEnabled == 1)\n" +
            "		        vUv = transformUvToMarkerSpace(uv);\n" +
            "                #else\n" +
            "		        vUv = uv;\n" +
            "                #endif\n" +
            "\n" +
            "                // compute gl_Position\n" +
            "		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
            "		gl_Position = projectionMatrix * mvPosition;\n" +
            "	}";

        ArMarkerCloak.fragmentShader =
            "\n" +
            "	varying vec2 vUv;\n" +
            "	uniform sampler2D texture;\n" +
            "	uniform float opacity;\n" +
            "\n" +
            "	void main(void){\n" +
            "		vec3 color = texture2D( texture, vUv ).rgb;\n" +
            "\n" +
            "		gl_FragColor = vec4( color, opacity);\n" +
            "	}";

        // build cloakMesh
        // TODO if webgl2 use repeat warp, and not multi segment, this will reduce the geometry to draw
        var geometry = new PlaneGeometry(
            1.3 + 0.25,
            1.85 + 0.25,
            1,
            8
        ).translate(0, -0.3, 0);
        var shaderMaterial = new ShaderMaterial({
            vertexShader: ArMarkerCloak.vertexShader,
            fragmentShader: ArMarkerCloak.fragmentShader,
            transparent: true,
            uniforms: {
                texture: {
                    value: videoTexture,
                },
                opacity: {
                    value: 0.5,
                },
            },
            defines: {
                updateInShaderEnabled: this.updateInShaderEnabled ? 1 : 0,
            },
        });

        this.cloakMesh = new Mesh(geometry, shaderMaterial);
        this.cloakMesh.rotation.x = -Math.PI / 2;
        this.object3d = this.cloakMesh;

        //////////////////////////////////////////////////////////////////////////////
        //		Code Separator
        //////////////////////////////////////////////////////////////////////////////

        var xMin = -0.65;
        var xMax = 0.65;
        var yMin = 0.65 + 0.1;
        var yMax = 0.95 + 0.1;

        //////////////////////////////////////////////////////////////////////////////
        //		originalsFaceVertexUvs
        //////////////////////////////////////////////////////////////////////////////
        this.originalsFaceVertexUvs = [[]];

        // build originalsFaceVertexUvs array
        for (
            var faceIndex = 0;
            faceIndex < this.cloakMesh.geometry.faces.length;
            faceIndex++
        ) {
            this.originalsFaceVertexUvs[0][faceIndex] = [];
            this.originalsFaceVertexUvs[0][faceIndex][0] = new Vector2();
            this.originalsFaceVertexUvs[0][faceIndex][1] = new Vector2();
            this.originalsFaceVertexUvs[0][faceIndex][2] = new Vector2();
        }

        // set values in originalsFaceVertexUvs
        for (var i = 0; i < this.cloakMesh.geometry.parameters.heightSegments / 2; i++) {
            // one segment height - even row - normale orientation
            this.originalsFaceVertexUvs[0][i * 4 + 0][0].set(xMin / 2 + 0.5, yMax / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 0][1].set(xMin / 2 + 0.5, yMin / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 0][2].set(xMax / 2 + 0.5, yMax / 2 + 0.5);

            this.originalsFaceVertexUvs[0][i * 4 + 1][0].set(xMin / 2 + 0.5, yMin / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 1][1].set(xMax / 2 + 0.5, yMin / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 1][2].set(xMax / 2 + 0.5, yMax / 2 + 0.5);

            // one segment height - odd row - mirror-y orientation
            this.originalsFaceVertexUvs[0][i * 4 + 2][0].set(xMin / 2 + 0.5, yMin / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 2][1].set(xMin / 2 + 0.5, yMax / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 2][2].set(xMax / 2 + 0.5, yMin / 2 + 0.5);

            this.originalsFaceVertexUvs[0][i * 4 + 3][0].set(xMin / 2 + 0.5, yMax / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 3][1].set(xMax / 2 + 0.5, yMax / 2 + 0.5);
            this.originalsFaceVertexUvs[0][i * 4 + 3][2].set(xMax / 2 + 0.5, yMin / 2 + 0.5);
        }

        if (this.updateInShaderEnabled === true) {
            this.cloakMesh.geometry.faceVertexUvs = this.originalsFaceVertexUvs;
            this.cloakMesh.geometry.uvsNeedUpdate = true;
        }

        //////////////////////////////////////////////////////////////////////////////
        //		Code Separator
        //////////////////////////////////////////////////////////////////////////////

        this.originalOrthoVertices = [];
        this.originalOrthoVertices.push(new Vector3(xMin, yMax, 0));
        this.originalOrthoVertices.push(new Vector3(xMax, yMax, 0));
        this.originalOrthoVertices.push(new Vector3(xMin, yMin, 0));
        this.originalOrthoVertices.push(new Vector3(xMax, yMin, 0));

        // build debugMesh
        var material = new MeshNormalMaterial({
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        });
        var ortoGeometry = new THREE.PlaneGeometry(1, 1);
        var orthoMesh = new THREE.Mesh(ortoGeometry, material);
        this.orthoMesh = orthoMesh;
        //return;
    }
    // update cloakMesh
    private updateUvs(modelViewMatrix: Matrix4, cameraProjectionMatrix: Matrix4) {
        var transformedUv = new Vector3();
        this.originalsFaceVertexUvs[0].forEach((faceVertexUvs, faceIndex) => {
            faceVertexUvs.forEach((originalUv: any, uvIndex: any) => {
                // set transformedUv - from UV coord to clip coord
                transformedUv.x = originalUv.x * 2.0 - 1.0;
                transformedUv.y = originalUv.y * 2.0 - 1.0;
                transformedUv.z = 0;
                // apply modelViewMatrix and projectionMatrix
                transformedUv.applyMatrix4(modelViewMatrix);
                transformedUv.applyMatrix4(cameraProjectionMatrix);
                // apply perspective
                transformedUv.x /= transformedUv.z;
                transformedUv.y /= transformedUv.z;
                // set back from clip coord to Uv coord
                transformedUv.x = transformedUv.x / 2.0 + 0.5;
                transformedUv.y = transformedUv.y / 2.0 + 0.5;
                // copy the trasnformedUv into the geometry
                this.cloakMesh.geometry.faceVertexUvs[0][faceIndex][uvIndex].set(
                    transformedUv.x,
                    transformedUv.y
                );
            });
        });

        // cloakMesh.geometry.faceVertexUvs = faceVertexUvs
        this.cloakMesh.geometry.uvsNeedUpdate = true;
    }

    // update orthoMesh
    private updateOrtho(modelViewMatrix: Matrix4, cameraProjectionMatrix: Matrix4) {
        // compute transformedUvs
        var transformedUvs: any = [];
        this.originalOrthoVertices.forEach((originalOrthoVertices, index) => {
            var transformedUv = originalOrthoVertices.clone();
            // apply modelViewMatrix and projectionMatrix
            transformedUv.applyMatrix4(modelViewMatrix);
            transformedUv.applyMatrix4(cameraProjectionMatrix);
            // apply perspective
            transformedUv.x /= transformedUv.z;
            transformedUv.y /= transformedUv.z;
            // store it
            transformedUvs.push(transformedUv);
        });

        // change orthoMesh vertices
        for (var i = 0; i < transformedUvs.length; i++) {
            this.orthoMesh.geometry.vertices[i].copy(transformedUvs[i]);
        }
        this.orthoMesh.geometry.computeBoundingSphere();
        this.orthoMesh.geometry.verticesNeedUpdate = true;
    }

    public update(modelViewMatrix: Matrix4, cameraProjectionMatrix: Matrix4) {
        this.updateOrtho(modelViewMatrix, cameraProjectionMatrix);

        if (this.updateInShaderEnabled === false) {
            this.updateUvs(modelViewMatrix, cameraProjectionMatrix);
        }
    };
}
