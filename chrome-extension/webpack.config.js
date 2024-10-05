const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: "./src/background.ts",
    // content: './src/content.ts',
    // popup: './src/popup.ts'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "manifest.json", to: "manifest.json" },
      ],
    }),
  ],
  mode: "production", // Can change to 'development' during dev
  target: ["web", "es2020"], // Ensures compatibility with Chrome's service workers
};
