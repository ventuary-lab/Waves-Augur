require('yii-steroids/webpack')
    .config({
        port: 8081,
        baseUrl: '',
        staticPath: '',
        outputPath: __dirname + '/dist',
        sourcePath: __dirname + '/src',
        useHash: true,
        devServer: {
            historyApiFallback: {
                index: '/index.html',
            },
        },
    })
    .base('./src/index.js');
