const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/example/main.ts"
        },
        output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "./",
        filename: '[name]-[hash].js'
        },
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
        },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new HtmlWebPackPlugin({
        inject: true,
        hash: true,        
      template: "./src/example/index.html",
      filename: "./index.html"
    })
  ],
  devServer: {
    contentBase: './src/example',
    publicPath: '/',
    port: 9000
  }
};