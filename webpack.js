const webpack = require('webpack');

console.log('process.env.DAPP', process.env.DAPP);

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
                    'process.env.APP_DAPP_NETWORK': JSON.stringify(process.env.APP_DAPP_NETWORK),
                    'process.env.DAPP': JSON.stringify(process.env.DAPP),
                    'process.env.NODE_URL': JSON.stringify(process.env.NODE_URL),
                    'process.env.ORACLE': JSON.stringify(process.env.ORACLE),
                    'process.env.ORACLE_SEED': JSON.stringify(process.env.ORACLE_SEED),
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                })
            ]
        },
    })
    .base('./src/index.js');
