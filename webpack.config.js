const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');


const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;
const devtool = isDevelopment ? 'source-map' : undefined;
const target = isDevelopment ? 'web' : 'browserslist';


module.exports = {
    target,
    devtool,
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-[contenthash].js',
        // clean: true,
        assetModuleFilename: path.join('img', '[name].[contenthash][ext]'),
        environment: {
            arrowFunction: false
        }
      },
      devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        compress: true,
        port: 9000,
        open: true,
      },
      plugins: [
        new HtmlWebpackPlugin({
            title: 'Weather App',
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProduction,
                removeComments: isProduction
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].css'
        }),
        new FileManagerPlugin({
            events: {
                onStart: {
                delete: ['dist'],
                },
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            // CSS loader   
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    isDevelopment ? "style-loader":MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                          postcssOptions: {
                            plugins: [
                              [
                                "postcss-preset-env",
                                {
                                  // Options
                                },
                              ],
                            ],
                          },
                        },
                    },
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            // Image loader
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                generator:{
                    filename: 'assets/img/[contenthash][ext]'
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
                generator: {
                filename: path.join('icons', '[name].[contenthash][ext]'),
                },
            },
            // Fonts loader
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator:{
                    filename: 'assets/fonts/[name][ext]'
                }
            },
            // Source-map-loader
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            // Babel loader
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ],
    },
    optimization: {
        minimizer: [
          "...",
          new ImageMinimizerPlugin({
            minimizer: [
                // `sharp` will handle all bitmap formats (JPG, PNG, GIF, ...)
                {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        encodeOptions: {
                            jpeg: {
                                // https://sharp.pixelplumbing.com/api-output#jpeg
                                quality: 30,
                            },
                            webp: {
                                // https://sharp.pixelplumbing.com/api-output#webp
                                lossless: true,
                                quality: 30,
                            },
                            avif: {
                                // https://sharp.pixelplumbing.com/api-output#avif
                                lossless: true,
                                quality: 30,
                            },
            
                            // png by default sets the quality to 100%, which is same as lossless
                            // https://sharp.pixelplumbing.com/api-output#png
                            png: {
                                quality: 30,
                            },
            
                            // gif does not support lossless compression at all
                            // https://sharp.pixelplumbing.com/api-output#gif
                            gif: {
                                quality: 30,
                            },
                        },
                    },
                },
                // `svgo` will handle vector images (SVG)
                {
                    implementation: ImageMinimizerPlugin.svgoMinify,
                    options: {
                        encodeOptions: {
                            // Pass over SVGs multiple times to ensure all optimizations are applied. False by default
                            multipass: true,
                            plugins: [
                                // set of built-in plugins enabled by default
                                // see: https://github.com/svg/svgo#default-preset
                                "preset-default",
                            ],
                        },
                    },
                },
            ]
          }),
        ],
    },
    performance: {
        hints: isDevelopment ? 'warning' : false,
        maxEntrypointSize: 750000,
        maxAssetSize: 750000
    }
}