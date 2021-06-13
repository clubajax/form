const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DEV = args.mode === 'development';
const DIST = path.resolve(__dirname, '../build');
const ROOT = __dirname;

console.log('DEV:::', DEV);

module.exports = {
    mode: !DEV ? 'production' : 'development',
    entry: './build-profiles/webpack-index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'index.js',
        libraryTarget: 'umd',
        globalObject: 'this',
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
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: 'form.css',
            // chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new HtmlWebpackPlugin({
            title: 'Form Library',
            filename: 'index.html',
            template: path.join(ROOT, 'tests/index.html'),
        }),
        new CopyPlugin({
            patterns: [
                { from: 'tests/src', to: 'asset/src' },
                { from: './node_modules/mocha/mocha.css', to: 'asset/mocha.css' },
                { from: './node_modules/mocha/mocha.js', to: 'asset/mocha.js' },
                { from: './node_modules/chai/chai.js', to: 'asset/chai.js' },
                { from: './node_modules/chai-spies/chai-spies.js', to: 'asset/chai-spies.js' },
            ],
        }),
    ],
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
