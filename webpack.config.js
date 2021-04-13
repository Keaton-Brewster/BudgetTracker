const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    mode: "production",
    entry: {
        index: "./public/index.js",
    },
    output: {
        path: __dirname + "/public/dist",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]
    },
    plugins: [
        new WebpackPwaManifest({
            fingerprints: false,
            name: 'Newsy app',
            short_name: 'Newsy',
            description: 'An application that allows you to view different news articles and save your favorites.',
            background_color: '#01579b',
            theme_color: '#ffffff',
            start_url: '/',
            icons: [{
                src: path.resolve('./public/icons/icon-512x512.png'),
                sizes: [192, 512],
                destination: path.join('assets', 'icons'),
            }, ],
        }),
    ],
};

module.exports = config;