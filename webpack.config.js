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

        }]
    };

    return [

        {
            name: 'threex',
            devtool,
            entry: './src/index-threex.ts',
            output: {
                library: 'THREEx',
                path: path.resolve(__dirname, './dist'),
                filename: 'ar-threex.js',
                libraryTarget: 'umd',
                globalObject: 'this'
            },
            resolve: {
              alias: {
                jsartoolkit: '@ar-js-org/artoolkit5-js',
                //threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
              },
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
    ];
};