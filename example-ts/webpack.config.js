var path = require('path');

module.exports = (env, argv) => {
    let devtool = false;
    if (argv.mode === 'development') {
        devtool = 'inline-source-map';
    }
    console.log(`${argv.mode} build`);
    const module = {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
            }]
        }
        ]
    };

    return [

        {
            name: "example-basic",
            devtool,
            entry: './basic.ts',
            output: {
                path: path.resolve(__dirname, './dist'),
                filename: 'basic.js',
                libraryTarget: 'umd',
                globalObject: 'this'
            },
            resolve: {
                /*alias: {
                    jsartoolkit: '@ar-js-org/artoolkit5-js',
                    //threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
                },*/
                extensions: [".tsx", ".ts", ".js"],
            },
            module,
            externals: {
                three: {
                    commonjs: 'three',
                    commonjs2: 'three',
                    amd: 'three',
                    root: 'THREE' // indicates global variable
                }
            }
        },
        {
            name: "example-nft",
            devtool,
            entry: './nft.ts',
            output: {
                path: path.resolve(__dirname, './dist'),
                filename: 'nft.js',
                libraryTarget: 'umd',
                globalObject: 'this'
            },
            resolve: {
                /*alias: {
                    jsartoolkit: '@ar-js-org/artoolkit5-js',
                    //threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
                },*/
                extensions: [".tsx", ".ts", ".js"],
            },
            module,
            externals: {
                three: {
                    commonjs: 'three',
                    commonjs2: 'three',
                    amd: 'three',
                    root: 'THREE' // indicates global variable
                }
            }
        }
    ];
};