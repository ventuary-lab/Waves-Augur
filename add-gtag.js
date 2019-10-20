const fs = require('fs');

function constructLinkedInScript () {
    return `
        <script type="text/javascript"> _linkedin_partner_id = "1572412"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push(_linkedin_partner_id); </script>
        <script type="text/javascript"> (function(){var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s);})(); </script>
        <noscript> <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=1572412&fmt=gif" /> </noscript>
    `.trim();
}

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
    const linkedInString = constructLinkedInScript();

    html = html.replace('<!-- gtag -->', string + linkedInString);

    return html;
}

exports.constructGtag = constructGtag;
module.exports = main;