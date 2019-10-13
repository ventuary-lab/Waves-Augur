const fs = require('fs');

async function main (route = 'dist/index.html') {

    let html = await new Promise(resolve => {
        fs.readFile(route, 'utf8', (err, data) => {
            if (err) {
                return;
            }
            resolve(data);
        });
    });
    const gTagId = process.env.G_ANALYTICS_TAG || '???';

    const string = `
        <script async src="https://www.googletagmanager.com/gtag/js?id=${gTagId}"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        gtag('js', new Date());
        gtag('config', '${gTagId}');
        </script>
    `.trim();

    html = html.replace('<!-- gtag -->', string);

    return html;
}

module.exports = main;