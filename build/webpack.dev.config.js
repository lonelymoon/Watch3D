const path = require("path");
const merge = require('webpack-merge');
const base = require("./webpack.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = merge(base,{
    output : {
        path : path.join(__dirname,"../demo/"),
        publicPath : "demo/",
        filename : "watch3D.js"
    }
});

module.exports = config;