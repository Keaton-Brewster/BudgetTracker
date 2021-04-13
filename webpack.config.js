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
    }
};
module.exports = config;