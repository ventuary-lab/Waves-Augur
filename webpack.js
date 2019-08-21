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
                },
                {
                    '/api': {
                        target: 'https://alpha.ventuary.space',
                        pathRewrite: {'^/api' : ''},
                        changeOrigin: true
                    }
                },
                {
                    context: ['/get-dapp-info'],
                    target: 'https://alpha.ventuary.space',
                    changeOrigin: true
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
            }
        },
    })
    .base('./src/index.js');
