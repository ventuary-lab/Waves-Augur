const fs = require('fs');

function constructGtag (gTagId = '???') {
    return `
        <script async src="https://www.googletagmanager.com/gtag/js?id=${gTagId}"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        gtag('js', new Date());
        gtag('config', '${gTagId}');

        (function () {
            var url = new URL(window.location.href);
            var param = url.searchParams.get('redirect_to');

            if (param) {
                console.log({ param })
                window.location.href = (
                    window.location.origin + '/api/v1/redirect-to/' + param
                )
            }
        })();

        </script>
    `.trim();
}

async function main (route = 'dist/index.html') {

    let html = await new Promise(resolve => {
        fs.readFile(route, 'utf8', (err, data) => {
            if (err) {
                return;
            }
            resolve(data);
        });
    });

    const gTagId = process.env.G_ANALYTICS_TAG;
    const string = constructGtag(gTagId);

    html = html.replace('<!-- gtag -->', string);

    return html;
}

exports.constructGtag = constructGtag;
module.exports = main;