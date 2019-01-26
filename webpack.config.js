const path = require('path');

module.exports = {
    mode: "development",
    entry: "./pulpstatus/js-src/app.js",
    output: {
        path: path.resolve(__dirname, 'pulpstatus/static/js'),
        filename: 'app-bundle.js'
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
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ]
    }
};