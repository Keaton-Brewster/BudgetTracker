const config = {
    mode: "development",
    entry: {
        index: "./public/assets/index.js",
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
    // plugins: [
    //     new WebpackPwaManifest({
    //         fingerprints: false,
    //         name: 'Budgety',
    //         short_name: 'Budgety',
    //         description: 'An application that helps you manage your exspenses.',
    //         background_color: '#000',
    //         theme_color: '#000',
    //         start_url: '/',
    //         icons: [{
    //             //! Something is going on here and causing AUTO to show up in icon pathname and its making production not work
    //             src: path.resolve('public/assets/icons/icon-192x192.png'),
    //             sizes: [192, 512],
    //             destination: 'icons'
    //         }, ],
    //     })
    // ],
};

module.exports = config;