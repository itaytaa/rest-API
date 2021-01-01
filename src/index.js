const http = require('http');
const url = require('url');
const fs = require('fs');
// const id = require('./id')


class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;

    }
}

http.createServer((req, res) => {

    if (req.method === 'PUT' && req.url.includes('/user')) {

        const query = url.parse(req.url, true).query; // /user?username=itay&password=1234
        readFile((users) => {
            const newUser = new User(query.username, query.password, query.email)
            users.push(newUser)
            saveFile(users, () => {
                res.write(`user ${newUser.username} created`)
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
        let isExist = false
        readFile((users) => {
            users = users.filter((user, idx) => {
                if (user.username !== query.username) {
                    return true
                } else {
                    isExist = true;
                }
            })
            if (!isExist) {
                res.write(`user ${url.parse(req.url, true).query.username} does not exist`)
                res.end()
                return
            } else {
                saveFile(users, () => {
                    res.write(`user ${query.username} was deleted`)
                    res.end()
                })

            }

        })
    } else if (req.method === 'POST' && req.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        let isExist = false
        let index;
        readFile((users) => {
             const newUsers = users.map((user) => {
                if (user.username === query.username) {
                    user.username = query.newUsername
                    isExist = true;
                    return   user
                }
                return user
            })
            if (!isExist) {
                res.write(`user ${url.parse(req.url, true).query.username} does not exist`)
                res.end()
                return
            }
            saveFile(newUsers, () => {
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