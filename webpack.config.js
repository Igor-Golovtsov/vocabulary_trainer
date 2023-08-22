const HtmlWebpackPlugin = require("html-webpack-plugin");
const TSConfigPathWebpackPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

const resolvePath = (dir, target) => path.resolve(dir, target);

const sourceDir = resolvePath(__dirname, "src");
const outputDir = resolvePath(__dirname, "dist");

module.exports = (env, { mode }) => ({
  entry: resolvePath(sourceDir, "index.ts"),
  output: {
    path: outputDir,
    filename: "main.js",
    // publicPath: '/dist/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath(sourceDir, "index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    plugins: [new TSConfigPathWebpackPlugin()],
    extensions: [".ts", ".js"],
  },
  devtool: mode === "development" ? "source-map" : false,
  devServer: {
    static: {
      directory: outputDir,
    },
    port: 9000,
  },
});
