var fs = require('fs');

var files = fs.readdirSync('../public').filter(fn => fn.startsWith('precache-manifest'));

if (files.length == 0) {
    console.warn('Could not find precache-manifest.* manifest file to edit start_url. PWA functionality will probably not work.')
    process.exit(1);
}

var data = fs.readFileSync('../public/' + files[0], 'utf-8');

var newValue = data.replace(/\/index.html/g, '/');

fs.writeFileSync('../public/' + files[0], newValue, 'utf-8');

console.log('Edited precache-manifest file to make start_url: "/" instead of "/index.html". This is a hacky way, we need a better way. Thanks.');
