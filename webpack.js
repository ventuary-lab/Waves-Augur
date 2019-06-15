const utils = require('yii-steroids/webpack/utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const port = 5010;
const staticPath = '';

require('yii-steroids/webpack')
    .config({
        port: port,
        staticPath: staticPath,
        devServer: {
            proxy: {
                '**': null,
            },
        },
        webpack: {
            output: utils.isProduction()
                ? {
                    publicPath: '/',
                    filename: 'assets/bundle-[name].[hash].js',
                    chunkFilename: 'assets/bundle-[name].[hash].js',
                }
                : {
                    publicPath: `http://localhost:${port}/`,
                    filename: `${staticPath}assets/bundle-[name].[hash].js`,
                    chunkFilename: `${staticPath}assets/bundle-[name].[hash].js`,
                },
            module: {
                rules: {
                    js: {
                        test: /\.jsx?$/,
                        exclude: /node_modules(\/|\\+)(?!yii-steroids)/,
                    },
                    css: {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader'],
                    },
                    image: {
                        test: /\.(jpe?g|gif|png|svg)$/,
                        use: {
                            file: {
                                loader: 'file-loader',
                                options: {
                                    name: 'images/[hash].[ext]',
                                },
                            },
                        },
                    },
                },
            },
            resolve: {
                extensions: ['.js', '.jsx', '.json'],
                alias: {
                    actions: __dirname + '/src/actions',
                    reducers: __dirname + '/src/reducers',
                    routes: __dirname + '/src/routes',
                    components: __dirname + '/src/components',
                    shared: __dirname + '/src/shared',
                    types: __dirname + '/src/types',
                    enums: __dirname + '/src/enums',
                    ui: __dirname + '/src/ui',
                    style: __dirname + '/src/style',
                },
            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: `assets/bundle-[name].[hash].css`,
                    chunkFilename: `assets/bundle-[id].[hash].css`,
                }),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: './src/index.html',
                    filename: './index.html'
                }),
            ],
        },
    })
    .base('./src/index.js');
