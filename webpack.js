require('yii-steroids/webpack')
    .config({
        port: 5010,
        baseUrl: 'frontend/',
        staticPath: '',
        sourcePath: __dirname + '/src',
        useHash: true,
        devServer: {
            historyApiFallback: {
                index: '/frontend/index.html',
            },
            proxy: [
                {
                    context: ['/api'],
                    target: process.env.APP_BACKEND_URL || 'https://example.com',
                    changeOrigin: true,
                },
            ],
        },
    })
    .base('./src/index.js');
