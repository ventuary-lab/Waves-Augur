/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/first */
require('dotenv-safe').config();

import webpack from 'webpack';
import sharedConfig from './webpack.config.shared';

const { apiHost, apiPort, apiProto } = sharedConfig.processEnv;
const RestApiHost = `${apiProto}://${apiHost}:${apiPort}`;

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'source-map',
  target: sharedConfig.target,
  context: sharedConfig.rootDir, // the home directory for webpack the entry and module.rules.loader option
  entry: {
    app: [
      sharedConfig.entryPoint,
    ],
  },
  output: sharedConfig.output,
  module: sharedConfig.module,
  resolve: sharedConfig.resolve,
  plugins: [
    ...sharedConfig.plugins,
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: sharedConfig.outputPath,
    port: 8081,
    compress: true, // Enable gzip compression for everything served
    hot: true,
    historyApiFallback: true,
    publicPath: sharedConfig.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
};

export default config;
