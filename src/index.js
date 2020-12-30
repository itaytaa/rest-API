const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((req, res) => {

    if (req.method === 'PUT' && req.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        readFile((users) => {

            users.push(query.username)
            console.log(query.username)
            saveFile(users, () => {
                res.write(`user ${query.username} created`)
                res.end()
            })
        });
    } else if (req.method === 'GET' && req.url.includes('/user')) {
        readFile((users) => {

            res.write(JSON.stringify(users));
            res.end()
        })
    }
    else if (req.method === 'DELETE' && req.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        readFile((users) => {
            if (users.indexOf(query.username) === -1) {
                res.write(`user ${url.parse(req.url, true).query.username} does not exist`)
                res.end()
                return
            }
            users.splice(users.indexOf(query.username), 1)
            saveFile(users, () => {
                res.write(`user ${query.username} was deleted`)
                res.end()
            })
        })
    } else if (req.method === 'POST' && req.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        readFile((users) => {
         
            if (users.indexOf(query.username) === -1) {
                res.write(`user ${url.parse(req.url, true).query.username} does not exist`)
                res.end()
                return
            }
            users.splice(users.indexOf(query.username), 1, query.newUsername)
            saveFile(users, () => {
                res.write(`user ${query.username} was changed to ${query.newUsername}`)
                res.end()
            })
        })
    }
}).listen(4000);

function saveFile(content, cb) {
    fs.writeFile('./src/db.json', JSON.stringify(content), cb)
}
function readFile(cb) {
    fs.readFile('./src/db.json', { encoding: 'utf-8' }, (err, content) => {
        if (err) {
            console.log(err)
            return;
        }
        cb(JSON.parse(content))
    });

}

console.log('Listening on : http://localhost:4000')