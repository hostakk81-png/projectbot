const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  const mode = env.mode;
  const isProd = mode === 'production';

  return {
    mode,
    entry: ["./src/index.js", "./src/scss/pages/index.scss"],
    output: {
      path: __dirname + "/build",
      filename: 'js/bundle-[contenthash].js',
      chunkFilename: 'js/chunk-[contenthash].js',
      publicPath: "./",
      assetModuleFilename: "assets/[name]-[contenthash][ext]",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'swc-loader',
              options: {
                jsc: {
                    parser: {
                        syntax: "ecmascript",
                        jsx: true,
                        decorators: false,
                        dynamicImport: true
                    },
                    "target": "es5"
                }
            }
          }
        },
        {
          test: /\.(scss|css)$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      "postcss-preset-env",
                    ],
                  ],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.svg$/,
          type: "asset/inline",
        },
        {
          test: /\.(png|jpg|jpeg|gif|woff2|mp3)$/i,
          type: "asset/resource",
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/assets/favicon.ico"
      }),
      new MiniCssExtractPlugin({
        linkType: "text/css",
        filename: "css/main-[contenthash].css",
        chunkFilename: "css/chunk-[contenthash].css"
      }),
      new Dotenv()
    ],
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        '@':  __dirname + '/src',
        '@@': __dirname + '/public'
      }
    },
    devServer: {
      static: {
        directory: __dirname + "/public",
      },
      historyApiFallback: true,
      allowedHosts: 'all',
      port: 3000,
      hot: true,
      open: true,
      client: {
        overlay: false,
        logging: 'error'
      },
    },
    cache: false
  }  
}
