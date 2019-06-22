const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader'
                    },
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/',
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'fonts/'
                    }
                }]
            },
        ]
    },
    devServer: {
        contentBase: './src',
        historyApiFallback: true,
    },

    resolve: {
        alias: {
            actions: __dirname + '/src/actions',
            components: __dirname + '/src/components',
            enums: __dirname + '/src/enums',
            reducers: __dirname + '/src/reducers',
            shared: __dirname + '/src/shared',
            ui: __dirname + '/src/ui',
            style: __dirname + '/src/style',
            types: __dirname + '/src/types',
            static: __dirname + '/src/static',
        },
        extensions: ['.js', '.jsx', '.scss', '.css', '.json'],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
};