const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
// const MinifyPlugin = require('babel-minify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: "./index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  target: "node",
  externals: [nodeExternals()], //node 打包可去除一些警告
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"], //兼容es6，并添加.babelrc
            },
          },
        ],
      },
    ],
  },
  plugins: [
		// 清楚dist
    new CleanWebpackPlugin(),
		// js压缩
		// split切片
		// 复制静态目录
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, './static'),
					to: path.resolve(__dirname, './dist/static')
				}
			]
		})
    // new MinifyPlugin() //压缩js
  ],
};
