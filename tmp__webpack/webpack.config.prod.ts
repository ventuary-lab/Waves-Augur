import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// tslint:disable-next-line:no-relative-imports
import sharedConfig from './webpack.config.shared';

const config: webpack.Configuration = {
  mode: 'production',
  target: sharedConfig.target,
  context: sharedConfig.rootDir, // the home directory for webpack the entry and module.rules.loader option
  entry: {
    app: [
      sharedConfig.entryPoint,
    ],
  },
  output: sharedConfig.output,
  module: {
    ...sharedConfig.module,
    rules: [
      ...sharedConfig.module.rules,
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader as string,
            options: {
              publicPath: '/',
            },
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
    ],
  },
  resolve: sharedConfig.resolve,
  plugins: [
    ...sharedConfig.plugins,
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false,
    }),
    new CleanWebpackPlugin(['dist'], { root: sharedConfig.rootDir }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};

export default config;
