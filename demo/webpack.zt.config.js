var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var fs = require("fs");
fs.read()

module.exports = {
    entry: ["webpack/hot/dev-server",path.resolve(__dirname,"app/main.js")],
    output: {
        path: __dirname,
        filename: "bundle.js",
        publishPath: "/build/",
        vender: ['react']
    },
    resolve:{
      alias: {
        // 'react': path.resolve(__dirname,'node_modules/react/dist/react.min.js'),
        // 'react-dom': path.resolve(__dirname,'node_modules/react/dist/react.min.js')
      },
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel', // 'babel-loader' is also a legal name to reference
          query: {
            presets: ['es2015', 'react']
          }
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract('css?sourceMap&-minimize!' + 'autoprefixer!' + 'less?sourceMap')
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('css?sourceMap&-minimize!'+'autoprefixer')
        },
        {
          test: /\.(jpg|png)$/,
          loader: "url-loader?limit=8192"
        }
      ],
      noParse: ['react','react-dom']
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('common.js'),
      new ExtractTextPlugin("[name].css"),
    ],
    devtool: 'source-map'
}
