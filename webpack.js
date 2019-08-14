const webpack = require('webpack');

require('yii-steroids/webpack')
    .config({
        port: 8081,
        baseUrl: '',
        staticPath: '',
        outputPath: __dirname + '/dist',
        sourcePath: __dirname + '/src',
        useHash: true,
        devServer: {
            proxy: [
                {
                    '**': null,
                },
                {
                    context: ['/upload'],
                    target: 'http://localhost:5000',
                }
            ]
        },
        webpack: {
            module: {
                rules: {
                    favicon: {
                        test: /\.ico$/,
                        use: {
                            file: {
                                loader: 'file-loader',
                                options: {
                                    name: 'images/[name].[ext]',
                                },
                            },
                        },
                    },
                },
            },
            plugins: [
                new webpack.DefinePlugin({
                    APP_DAPP_NETWORK: process.env.APP_DAPP_NETWORK,
                    DAPP: process.env.DAPP,
                    NODE_ENV: process.env.NODE_ENV,
                    NODE_URL: process.env.NODE_URL,
                    ORACLE: process.env.ORACLE,
                    ORACLE_SEED: process.env.ORACLE_SEED,
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                })
            ]
        },
    })
    .base('./src/index.js');
