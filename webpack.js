require('yii-steroids/webpack')
    .config({
        port: 8081,
        baseUrl: '',
        staticPath: '',
        outputPath: __dirname + '/dist',
        sourcePath: __dirname + '/src',
        useHash: true,
        devServer: {
            hot: false,
            inline: false,
            liveReload: false,
            proxy: [
                {
                    '**': null,
                },
                {
                    context: ['/upload', '/api'],
                    target: 'http://localhost:5000',
                },
                // {
                //     context: ['/get-dapp-info'],
                //     target: 'https://alpha.ventuary.space',
                //     changeOrigin: true
                // }
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
        },
    })
    .base('./src/index.js');
