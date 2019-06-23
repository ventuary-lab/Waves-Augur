/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import path from 'path';
import HappyPack from 'happypack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const processEnv = {
  apiProto: process.env.APIPROTO || 'http',
  apiHost: process.env.APIHOST,
  apiPort: process.env.APIPORT || 80,
  // host: process.env.HOST || 'localhost',
  // port: process.env.PORT || 80,
};

const publicPath = '/';
const outputPath = path.join(__dirname, '..', 'dist');
const rootDir = path.resolve(__dirname, '..');
const srcPath = path.join(__dirname, '..', 'src');
const entryPoint = path.join(__dirname, '..', 'src', 'index.tsx');

type CustomConfig = {
  publicPath: string;
  outputPath: string;
  rootDir: string;
  srcPath: string;
  entryPoint: string;
  processEnv: typeof processEnv;
};

const config: webpack.Configuration & CustomConfig = {
  publicPath,
  outputPath,
  rootDir,
  srcPath,
  entryPoint,
  processEnv,
  target: 'web',
  output: {
    publicPath,
    path: outputPath,
    filename: '[name].js',
  },
  module: {
    noParse: [/proj4\/dist\/proj4.js/, /openlayers\/dist\/ol.js/],
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            },
          },
          'happypack/loader?id=ts',
        ],
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ],
              plugins: [
                [
                  "@babel/plugin-proposal-decorators",
                  {
                    "legacy": true
                  }
                ],
                [
                  "@babel/plugin-proposal-class-properties",
                  {
                    "loose": true
                  }
                ]
              ]
            }
        }
      },
      {
        test: /\.(png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader',
            options: {
              removeSVGTagAttrs: false,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {},
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader",
            "css-loader",
            "sass-loader"
        ]
      }
    ],
  },
  resolve: {
    modules: ['node_modules', srcPath],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'], // Automatically resolve certain extensions
    enforceExtension: false, // If true, it will not allow extension-less files
    alias: {
      actions: __dirname + '/../src/actions',
      components: __dirname + '/../src/components',
      enums: __dirname + '/../src/enums',
      reducers: __dirname + '/../src/reducers',
      shared: __dirname + '/../src/shared',
      ui: __dirname + '/../src/ui',
      style: __dirname + '/../src/style',
      types: __dirname + '/../src/types',
      static: __dirname + '/../src/static',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
      hash: true,
    }),
    new HappyPack({
      id: 'ts',
      threads: 2,
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
          },
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
  ],
};

export default config;
