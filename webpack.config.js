const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DEV = args.mode === 'development';
const distFolder = DEV ? './dist' : './build';
const ROOT = __dirname;
const DIST = path.resolve(ROOT, distFolder);

console.log('DEV:::', DEV);


let plugins = [
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'form.css',
        // chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
];

if (DEV) {
    plugins = [
        ...plugins,
        new HtmlWebpackPlugin({
            title: 'Form Library',
            filename: 'index.html',
            template: path.join(ROOT, 'index.html'),
        }),
        new CopyPlugin({
            patterns: [
                { from: 'tests', to: 'tests' },
                { from: 'assets', to: 'assets/src' },
                { from: './node_modules/mocha/mocha.css', to: 'assets/mocha.css' },
                { from: './node_modules/mocha/mocha.js', to: 'assets/mocha.js' },
                { from: './node_modules/chai/chai.js', to: 'assets/chai.js' },
                { from: './node_modules/chai-spies/chai-spies.js', to: 'assets/chai-spies.js' },
            ],
        }),
    ];
}

module.exports = {
    mode: DEV ? 'development' : 'production',
    entry: DEV ? './tests/index.js' : './build-profiles/webpack-index.js',
    output: {
        path: DIST,
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'form',
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
        // libraryExport: 'default',
        // sourceMapFilename: '@clubajax/form/form.js.map',
    },
    // source map options
    // https://webpack.js.org/configuration/devtool/
    // DEV options
    //      Of the options, we want those that have original source
    //      All options work best when refreshing page with dev tools open
    // inline-source-map: works best, slowest
    // cheap-module-eval-source-map: works well, faster
    // eval-source-map: has wrong line numbers, fastest
    // source-map: slow, org source, external
    devtool: DEV ? 'inline-source-map' : 'source-map',
    // externals: [
    //     '@clubajax/custom-elements-polyfill',
    //     '@clubajax/dom',
    //     '@clubajax/on',
    //     '@clubajax/base-component',
    //     '@clubajax/dates',
    //     '@clubajax/key-nav',
    //     '@clubajax/no-dash',
    // ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
            {
                test: /\.scss$/i,
                exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                use: [
                    DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            // indentWidth: 4,
                            // outputStyle: 'compressed',
                            webpackImporter: false,
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins,
    devServer: {
        contentBase: DIST,
        compress: false,
        progress: false,
        hot: true,
        index: 'index.html',
        port: 9004,
        publicPath: 'http://localhost:9004/',
    },
};
