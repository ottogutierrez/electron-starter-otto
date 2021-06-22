/* eslint-disable no-undef */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: { renderer: "./src/index.js" },
  target: "electron-renderer",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "src/index.html" }, { from: "main.js" }],
    }),
  ],
};
