const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry : {
        main : path.join(__dirname,"../index")
    },
    output : {
        path : path.join(__dirname,"../dist/"),
        publicPath : "dist/",
        filename : "watch3D.js"
    },
    module : {
        rules : [
            {
                test : /\.js$/,
                loader : "babel-loader",
                exclude : /node_modules/
            },
            {
                test : /\.less$/,
                use : ExtractTextPlugin.extract({
                    use : ["css-loader","less-loader"],
                    fallback : "style-loader"
                })
            },
            {
                test : /\.css$/,
                use : ExtractTextPlugin.extract({
                    use : ["css-loader"],
                    fallback : "style-loader"
                })
            },
            {
                test : /\.(png|jpg|gif|bmp|ttf|otf|woff|svg|eot)\??.*$/,
                loader : "url-loader?limit=2048"
            }
        ]
    },
    plugins : [
        new ExtractTextPlugin("watch3D.css")
    ]
};

module.exports = config;