const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const DEV = false;

module.exports = {
    mode: 'production',
    entry: './build-profiles/webpack-index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'index.js',
        libraryTarget: 'umd',
        globalObject: 'this',
        // libraryExport: 'default',
        library: 'form',
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
    externals: [
        '@clubajax/custom-elements-polyfill',
        '@clubajax/dom',
        '@clubajax/on',
        '@clubajax/base-component',
        '@clubajax/dates',
        '@clubajax/key-nav',
        '@clubajax/no-dash',
    ],
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
    ],
};
