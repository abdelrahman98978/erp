const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

let cookie = '';

https.get('https://clickerp.com.sa/public/index.php/dashboard', (res) => {
    if (res.headers['set-cookie']) {
        cookie = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
    }
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        const match = body.match(/name="_token"\s+value="([^"]+)"/);
        const token = match ? match[1] : '';
        console.log('CSRF Token:', token);

        const postData = querystring.stringify({
            login: 'abdelftah',
            password: '1234@$',
            _token: token
        });

        const req = https.request('https://clickerp.com.sa/public/index.php/dashboard/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'Cookie': cookie,
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, (resLogin) => {
            let loginBody = '';
            resLogin.on('data', chunk => loginBody += chunk);
            resLogin.on('end', () => {
                console.log('Login Response:', loginBody);
                if (resLogin.headers['set-cookie']) {
                    const newCookies = resLogin.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
                    cookie = cookie ? cookie + '; ' + newCookies : newCookies;
                }
                
                https.get('https://clickerp.com.sa/public/index.php/dashboard', {
                    headers: { 'Cookie': cookie }
                }, (resDash) => {
                    let dashBody = '';
                    resDash.on('data', chunk => dashBody += chunk);
                    resDash.on('end', () => {
                        fs.writeFileSync('c:/Users/abdo1/Downloads/ERP/dash.html', dashBody);
                        console.log('Saved dashboard HTML successfully to dash.html');
                    });
                });
            });
        });

        req.write(postData);
        req.end();
    });
});
