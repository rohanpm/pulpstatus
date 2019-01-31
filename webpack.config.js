const path = require('path');

module.exports = {
    mode: "development",
    entry: "./pulpstatus/js-src/app.js",
    output: {
        path: path.resolve(__dirname, 'pulpstatus/static/js'),
        filename: 'app-bundle.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.(t|j)sx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useCache: true
                }
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    devtool: "source-map"
};