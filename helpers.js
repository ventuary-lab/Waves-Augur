const fs = require('fs');


async function addGtag () {
    const gTag = process.env.G_ANALYTICS_TAG || '123123';
    
    const string = `
        <script async src="https://www.googletagmanager.com/gtag/js?id=${gTag}"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        gtag('js', new Date());
        gtag('config', '${gTag}');
        </script>
    `.trim();

    const indexFile = 'src/index.html';
    const newHtml = await new Promise(resolve => {
        const onRead = (err, data) => {
            if (err) { return; };

            let html = data;
            html = html.replace('<!-- gtag -->', string);

            resolve(html);
        };

        fs.readFile(indexFile, 'utf8', onRead);
    });
    const onSave = () => {};
    console.log({ newHtml })
    await fs.writeFile(indexFile, newHtml, onSave);
}

async function main () {
    
    await addGtag();
}

main();