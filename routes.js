const url = require('url')
const { getUserList, createUser, updateUser, deleteUser } = require('./db');

const requestHandler = (req, res) => {

    const parseUrl = url.parse(req.url);
    let pathParam = parseUrl.pathname.split('/');
    parseUrl.pathname = `/${pathParam[1]}`;
    if (pathParam.length > 2) {
        pathParam = pathParam[2]
    } else {
        pathParam = null;
    }

    switch (parseUrl.pathname) {
        case '/':
            handleHomeReq(req, res);
            break;
        case '/users':
            handleUsersReq(req, res, pathParam);
            break;
        default:
            res.writeHead(404)
            res.end("This URL is not supported!")
            break;
    }

}

const handleHomeReq = (req, res) => {
    if (req.method === 'GET') {
        const msg = "Hello Server!"
        res.writeHead(200)
        res.end(msg)
    } else {
        res.writeHead(400)
        res.end('Error!')
    }
}

const handleUsersReq = async (req, res, pathParam) => {
    if (req.method === 'GET') {
        let result = await getUserList().catch(err => {
            res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
            res.setHeader('Access-Control-Allow-Headers', "*");
            res.setHeader("Content-Type", "application/json");
            res.writeHead(500);
            res.end(JSON.stringify({ errorMessage: "Internal server error" }))
        })

        if (result) {
            res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
            res.setHeader('Access-Control-Allow-Headers', "*");
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(result))
        }
    }

    else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        })

        // * chunk needs to be a string, hence using shorthand method, body += chunk

        req.on('end', async () => {
            const result = await createUser(JSON.parse(body)).catch(err => {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(500);
                res.end(JSON.stringify({ "errorMessage": "Internal server error" }))
            })

            if (result) {
                res.setHeader("Content-Type", "application/json")
                res.writeHead(200);
                res.end(JSON.stringify(result))
            }
        })
    }

    else if (req.method === "PUT") {
        const query = url.parse(req.url, true).query;

        //* userId needs to be string.

        if (query.userId) {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            })
            req.on('end', async () => {
                const result = await updateUser(query.userId, JSON.parse(body)).catch(err => {
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end(JSON.stringify({ "errorMessage": "Internal server error" }))
                })

                if (result) {
                    res.setHeader("Content-Type", "application/json")
                    res.writeHead(200);
                    res.end(JSON.stringify(result))
                }
            })
        } else {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify({ "errorMessage": "userId is required in the query param" }))
        }
    }

    else if (req.method == "DELETE") {

        // * pathParam is coming from url using split method, /users/<<pathParam>>

        if (pathParam) {
            const result = await deleteUser(pathParam).catch(err => {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(500);
                res.end(JSON.stringify({ "errorMessage": "Internal server error" }))
            })

            if (result) {
                if (result.deletedCount) {
                    res.setHeader("Content-Type", "application/json")
                    res.writeHead(200);
                    res.end(JSON.stringify({ successMsg: 'User has been updated successfully' }))
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end(JSON.stringify({ "errorMessage": "No record found with that userId" }))
                }
            } else {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(400);
                res.end(JSON.stringify({ errorMessage: "userId is required in the url path" }));
            }
        }
    }

    else {
        res.writeHead(404);
        res.end('Method for this HTTP request is not yet supported!');
    }
}

module.exports = requestHandler;


// * using nodejs with react app on local server, using GET method 

// const handleGETReq = (req, res) => {
//     if (req.url === '/') {
//         const data = [
//             {
//                 _id: 101,
//                 fName: "abc",
//                 lName: "xyz"
//             },
//             {
//                 _id: 102,
//                 fName: "mno",
//                 lName: "pqr"
//             }
//         ];
//         res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
//         res.setHeader('Access-Control-Allow-Headers', "*");
//         res.setHeader("Content-Type", "application/json");
//         res.writeHead(200);
//         res.end(JSON.stringify(data))
//     } else (
//         res.writeHead(400)
//     )
// }

// const handlePOSTReq = (req, res) => {
//     if (req.url === '/') {
//         res.writeHead(404);
//     }
// }


// * simply handling only the routes URL

// if (req.url === '/') {
//     res.write('HTTP module worked, This is Home page!')
//     res.end()
// } else if (req.url === '/aboutpage') {
//     res.write(JSON.stringify(['HTML', 'CSS', 'JS']))
//     res.end()
// }